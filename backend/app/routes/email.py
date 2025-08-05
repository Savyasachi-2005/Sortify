from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from utils.security import get_current_user
from models.user import User
from utils.email_utils import send_verification_link
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/email",
    tags=["email"]
)

class EmailTaskResult(BaseModel):
    tasks: List[str]
    processed_tasks: List[dict]

@router.post("/send-task-result")
async def send_task_result(
    email_data: EmailTaskResult,
    current_user: User = Depends(get_current_user)
):
    """Send task results to user's email"""
    try:
        # Format the email content
        original_tasks = "\n".join([f"• {task}" for task in email_data.tasks])
        
        processed_content = ""
        for task in email_data.processed_tasks:
            processed_content += f"""
📝 Original: {task['task']}
✅ SMART: {task['smart_task']}
🏷️ Priority: {task['priority']}

"""
        
        email_body = f"""
Hello {current_user.full_name or current_user.username}!

Here are your organized tasks from SortIQ:

📋 ORIGINAL TASKS:
{original_tasks}

✨ TRANSFORMED TASKS:
{processed_content}

Best regards,
The SortIQ Team
        """
        
        # Send the email
        await send_email(
            subject="Your Organized Tasks from SortIQ",
            body=email_body,
            to_email=current_user.email
        )
        
        logger.info(f"Task results sent to {current_user.email}")
        return {"message": "Task results sent to your email successfully!"}
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}") 