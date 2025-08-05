from fastapi import APIRouter, HTTPException, Depends, Request, Body
from typing import List, Optional, Dict, Any
import logging
from utils.security import get_current_user
from models.user import User
from core.config import settings
from schemas.task import TaskInput, TaskOutput, ProcessedTask
from pydantic import BaseModel
import requests
import json
from core.config import settings

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
MODEL = "qwen/qwen3-coder:free"

@router.post("/transform", response_model=TaskOutput)
def process_tasks(data: TransformRequest, current_user: User = Depends(get_current_user)):
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
        "Respond in JSON like this: "
        "[{ \"task\": original, \"smart_task\": smart version, \"priority\": level }]"
        f"\n\nTasks:\n{tasks_text}"
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
        "Content-Type": "application/json"
    }
    try:
        # Log API request
        logger.info(f"Sending request to {API_URL} for model {MODEL}")
        
        response = requests.post(API_URL, json=body, headers=headers)
        response.raise_for_status()
        
        # Log successful API call
        logger.info("Successfully received response from AI API")
        
        data = response.json()
        ai_reply = data["choices"][0]["message"]["content"]
        
        # Log AI response (first 100 chars)
        logger.info(f"AI reply received: {ai_reply[:100]}...")
        
        try:
            processed_tasks = json.loads(ai_reply)
            output = [ProcessedTask(**task) for task in processed_tasks]
            logger.info(f"Successfully processed {len(output)} tasks")
            return {"processed_task": output}
        except json.JSONDecodeError as json_err:
            logger.error(f"JSON parse error: {str(json_err)}")
            logger.error(f"Raw AI response: {ai_reply}")
            raise HTTPException(status_code=500, 
                               detail=f"Failed to parse AI response as JSON: {str(json_err)}")
    except requests.exceptions.RequestException as req_err:
        logger.error(f"Request error: {str(req_err)}")
        raise HTTPException(status_code=500, 
                           detail=f"AI API request failed: {str(req_err)}")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, 
                           detail=f"AI processing error: {str(e)}")
