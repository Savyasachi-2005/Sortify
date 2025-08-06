from fastapi import APIRouter, HTTPException, Depends, Request, Body
from typing import List, Optional, Dict, Any
import logging
import time
import random
from datetime import datetime, timedelta
from utils.security import get_current_user
from models.user import User
from schemas.task import TaskInput, TaskOutput, ProcessedTask, TaskDetail
from pydantic import BaseModel
import requests
import json
from cachetools import TTLCache
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry


class TransformRequest(BaseModel):
    tasks: List[str]
    
    class Config:
        extra = "forbid"  # Reject any extra fields

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router=APIRouter(
    prefix="/api/ai",
    tags=["AI task"]
)

# No longer need server API key since users must provide their own

API_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "moonshotai/kimi-dev-72b:free"

# Rate limiting cache: key = user_id, value = last request timestamp
request_cache = TTLCache(maxsize=1000, ttl=60)  # 60 seconds TTL

def setup_retry_session(retries=3, backoff_factor=0.5):
    session = requests.Session()
    retry = Retry(
        total=retries,
        read=retries,
        connect=retries,
        backoff_factor=backoff_factor,
        status_forcelist=[429, 500, 502, 503, 504],
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

@router.post("/transform", response_model=TaskOutput)
def process_tasks(data: TransformRequest, current_user: User = Depends(get_current_user)):
    # Rate limiting check
    user_id = current_user.id
    last_request = request_cache.get(user_id)
    now = datetime.now()
    
    if last_request is not None:
        time_since_last = (now - last_request).total_seconds()
        if time_since_last < 2:  # Minimum 2 seconds between requests
            raise HTTPException(
                status_code=429,
                detail=f"Too many requests. Please wait {2 - time_since_last:.1f} seconds."
            )
    try:
        # Log incoming request
        logger.info(f"Received request from user: {current_user.email}")
        logger.info(f"Request data: {data}")
        logger.info(f"Request tasks: {data.tasks}")
        logger.info(f"User stored API key: {current_user.api_key[:10] if current_user.api_key else 'None'}...")
        
        # Validate tasks
        if not data.tasks or len(data.tasks) == 0:
            logger.error("No tasks provided in the request")
            raise HTTPException(status_code=400, detail="No tasks provided")
        
        # Validate API key from user's profile
        if not current_user.api_key or not current_user.api_key.strip():
            logger.error("No API key found in user profile")
            raise HTTPException(status_code=400, detail="API key not found. Please set your API key in your profile first.")
        
        # Create TaskInput object
        task_input = TaskInput(
            tasks=data.tasks,
            user_id=current_user.id
        )
        
        logger.info(f"Processing {len(data.tasks)} tasks for user {current_user.id}")
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        logger.error(f"Exception type: {type(e)}")
        raise HTTPException(status_code=400, detail=f"Error processing request: {str(e)}")
        
    # Use the user's stored API key
    active_api_key = current_user.api_key
    logger.info("Using user's stored API key")
    
    # Create the prompt with tasks
    tasks_text = "\n".join(data.tasks)
    prompt = (
        "You are an AI productivity assistant. "
        "Take the following messy task list and return each task in SMART format "
        "(Specific, Measurable, Achievable, Relevant, Time-bound). "
        "Also assign a priority (High, Medium, Low) to each. "
        "Respond in JSON array format where each object has these exact fields:\n"
        "1. original_task: the original task text\n"
        "2. smart_task: the SMART version of the task\n"
        "3. priority: either 'High', 'Medium', or 'Low'\n"
        "Example: [{ \"original_task\": \"write report\", "
        "\"smart_task\": \"Complete 5-page quarterly report with sales data analysis by next Friday\", "
        "\"priority\": \"High\" }]"
        f"\n\nTasks to transform:\n{tasks_text}"
    )

    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a helpful productivity assistant."},
            {"role": "user", "content": prompt}
        ]
    }

    headers = {
        "Authorization": f"Bearer {active_api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://sortiq.com",  # Replace with your actual domain
        "X-Title": "SortIQ Task Transformer",
    }
    try:
        # Update rate limiting cache
        request_cache[user_id] = now
        
        # Log API request details for debugging
        logger.info(f"Sending request to {API_URL} for model {MODEL}")
        logger.info(f"Request headers: {headers}")
        logger.info(f"Request body: {json.dumps(body, indent=2)}")
        
        # Use session with retry logic
        session = setup_retry_session()
        response = session.post(API_URL, json=body, headers=headers)
        
        # Log response details
        logger.info(f"Response status: {response.status_code}")
        logger.info(f"Response headers: {dict(response.headers)}")
        
        try:
            response_json = response.json()
            logger.info(f"Response body: {json.dumps(response_json, indent=2)}")
        except json.JSONDecodeError:
            logger.error(f"Failed to decode response as JSON: {response.text}")
        
        if response.status_code == 429:
            # Handle rate limit specifically
            retry_after = int(response.headers.get('Retry-After', 5))
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded. Please try again in {retry_after} seconds."
            )
            
        response.raise_for_status()
        
        # Log successful API call
        logger.info("Successfully received response from AI API")
        
        # Parse the response
        data = response.json()
        if not data or "choices" not in data or not data["choices"]:
            logger.error("Invalid response format from AI API")
            logger.error(f"Raw response: {response.text}")
            raise HTTPException(
                status_code=500,
                detail="Invalid response format from AI API"
            )

        ai_reply = data["choices"][0]["message"]["content"]
        if not ai_reply:
            logger.error("Empty response content from AI API")
            raise HTTPException(
                status_code=500,
                detail="Empty response from AI API"
            )
        
        # Log AI response (first 100 chars)
        logger.info(f"AI reply received: {ai_reply[:100]}...")
        
        # Clean up the response string
        ai_reply = ai_reply.strip()
        
        # Handle code blocks with markdown backticks (```json)
        if ai_reply.startswith('```'):
            # Find the first actual JSON content after the opening code fence
            content_start = ai_reply.find('\n')
            if content_start != -1:
                # Skip the first line with ```json
                ai_reply = ai_reply[content_start:].strip()
                
            # Remove closing code fence if present
            if '```' in ai_reply:
                closing_fence = ai_reply.rfind('```')
                ai_reply = ai_reply[:closing_fence].strip()
        
        # Find JSON array if it doesn't start with [
        if not ai_reply.startswith('['):
            start_idx = ai_reply.find('[')
            if start_idx != -1:
                ai_reply = ai_reply[start_idx:]
        
        # Log the cleaned JSON for debugging
        logger.info(f"Cleaned AI reply for parsing: {ai_reply[:50]}...")
        
        try:
            processed_tasks = json.loads(ai_reply)
            if not isinstance(processed_tasks, list):
                raise ValueError("Expected a JSON array of tasks")
            
            output = []
            for task in processed_tasks:
                # Ensure required fields are present - check both field naming conventions
                # Some models might return "task" while others "original_task"
                has_fields = True
                
                if 'original_task' in task and 'smart_task' in task and 'priority' in task:
                    # Already has the correct field names
                    original = task['original_task']
                    smart = task['smart_task']
                    priority = task['priority']
                elif 'task' in task and 'smart_task' in task and 'priority' in task:
                    # Using "task" instead of "original_task"
                    original = task['task']
                    smart = task['smart_task']
                    priority = task['priority']
                else:
                    logger.error(f"Missing required fields in task: {task}")
                    has_fields = False
                
                if not has_fields:
                    continue
                    
                # Convert task to ProcessedTask
                processed_task = ProcessedTask(
                    original_task=original,
                    smart_task=smart,
                    priority=priority
                )
                output.append(processed_task)
            
            if not output:
                raise ValueError("No valid tasks found in response")
            
            logger.info(f"Successfully processed {len(output)} tasks")
            return {"processed_tasks": output}
            
        except json.JSONDecodeError as json_err:
            logger.error(f"JSON parse error: {str(json_err)}")
            logger.error(f"Raw AI response: {ai_reply}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse AI response as JSON. Please try again."
            )
        except ValueError as val_err:
            logger.error(f"Validation error: {str(val_err)}")
            logger.error(f"Raw AI response: {ai_reply}")
            raise HTTPException(
                status_code=500,
                detail=f"Invalid response format: {str(val_err)}"
            )
    except requests.exceptions.RequestException as req_err:
        logger.error(f"Request error: {str(req_err)}")
        response_text = None
        error_detail = None
        
        try:
            if hasattr(req_err, 'response') and req_err.response is not None:
                response_text = req_err.response.text
                response_json = req_err.response.json()
                error_detail = response_json.get('error', {}).get('message')
                logger.error(f"Response JSON: {json.dumps(response_json, indent=2)}")
        except Exception as e:
            logger.error(f"Failed to parse error response: {e}")
            if response_text:
                logger.error(f"Raw response text: {response_text}")
        
        if error_detail:
            raise HTTPException(
                status_code=500,
                detail=f"API Error: {error_detail}"
            )
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to get response from AI API. Please check your API key and try again."
            )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        if response:
            logger.error(f"Response text: {response.text}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again."
        )
