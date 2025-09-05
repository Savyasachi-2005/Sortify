from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from ..utils.security import get_current_user
from ..models.user import User
from ..utils.email_utils import send_verification_link
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
        # Format the email content into a beautiful HTML table
        original_tasks_html = "".join([f"<li>{task}</li>" for task in email_data.tasks])
        
        processed_tasks_html = ""
        for task in email_data.processed_tasks:
            priority_color = {
                "High": "#ff6b6b",
                "Medium": "#feca57",
                "Low": "#48dbfb"
            }.get(task['priority'], "#ced6e0")

            processed_tasks_html += f"""
            <tr>
                <td>{task['task']}</td>
                <td>{task['smart_task']}</td>
                <td style="color: {priority_color}; font-weight: bold;">{task['priority']}</td>
            </tr>
            """
        
        email_body = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Organized Tasks from SortIQ</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }}
        h1, h2 {{
            color: #2c3e50;
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 10px;
        }}
        h1 {{ font-size: 24px; }}
        h2 {{ font-size: 20px; margin-top: 30px; }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }}
        th, td {{
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }}
        th {{
            background-color: #f8f9fa;
            font-weight: bold;
        }}
        ul {{
            padding-left: 20px;
        }}
        .footer {{
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #888;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello {current_user.full_name or current_user.username}!</h1>
        <p>Here are your organized tasks from SortIQ:</p>

        <h2>📋 Original Tasks</h2>
        <ul>{original_tasks_html}</ul>

        <h2>✨ Transformed Tasks</h2>
        <table>
            <thead>
                <tr>
                    <th>Original Task</th>
                    <th>SMART Task</th>
                    <th>Priority</th>
                </tr>
            </thead>
            <tbody>
                {processed_tasks_html}
            </tbody>
        </table>

        <p class="footer">
            Best regards,<br>
            The SortIQ Team
        </p>
    </div>
</body>
</html>
        """
        
        # Send the email
        await send_verification_link(
            subject="Your Organized Tasks from SortIQ",
            body=email_body,
            to=current_user.email,
            subtype="html"
        )
        
        logger.info(f"Task results sent to {current_user.email}")
        return {"message": "Task results sent to your email successfully!"}
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}") 