# routers/auth.py
from ..core.db import get_db
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from ..utils.email_token import verify_email_token
from ..utils.security import create_access_token  # Import this
from sqlalchemy.orm import Session
from ..models.user import User

apirouter = APIRouter(
    prefix="/api/auth",
    tags=["users"],
)

@apirouter.get("/verify-email", response_class=HTMLResponse)
def verify_email(token: str, db: Session = Depends(get_db)):
    email = verify_email_token(token)
    if not email:
        return create_error_html("Invalid or expired verification link")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        return create_error_html("User not found")

    if user.is_active:
        # Already verified, redirect with auto-login
        access_token = create_access_token(data={"sub": user.email})
        return RedirectResponse(url=f"http://localhost:3000/verify-success?token={access_token}")

    # Activate the user
    user.is_active = True
    db.commit()
    
    # Generate access token for auto-login
    access_token = create_access_token(data={"sub": user.email})
    
    # Return HTML with redirect to frontend with token
    return create_success_html("Email verification successful! Redirecting to login...", access_token)

def create_success_html(message, access_token):
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Email Verification Successful</title>
        <meta http-equiv="refresh" content="3;url=http://localhost:3000/verify-success?token={access_token}" />
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }}
            .card {{
                background-color: #f8f9fa;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                padding: 20px;
                margin-top: 40px;
            }}
            .success-icon {{
                color: #28a745;
                font-size: 48px;
                margin-bottom: 20px;
            }}
            h1 {{
                color: #28a745;
            }}
            .redirect-msg {{
                margin-top: 20px;
                font-size: 14px;
                color: #6c757d;
            }}
            .btn {{
                display: inline-block;
                background-color: #007bff;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                font-weight: bold;
            }}
        </style>
    </head>
    <body>
        <div class="card">
            <div class="success-icon">✓</div>
            <h1>Email Verification Successful</h1>
            <p>{message}</p>
            <p class="redirect-msg">You will be automatically logged in and redirected to SortIQ...</p>
            <a href="http://localhost:3000/verify-success?token={access_token}" class="btn">
                Continue to SortIQ
            </a>
        </div>
    </body>
    </html>
    """

def create_error_html(error_message):
    # Keep your existing error HTML, but redirect to login page instead
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Email Verification Failed</title>
        <meta http-equiv="refresh" content="5;url=http://localhost:3000/login" />
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }}
            .card {{
                background-color: #f8f9fa;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                padding: 20px;
                margin-top: 40px;
            }}
            .error-icon {{
                color: #dc3545;
                font-size: 48px;
                margin-bottom: 20px;
            }}
            h1 {{
                color: #dc3545;
            }}
            .redirect-msg {{
                margin-top: 20px;
                font-size: 14px;
                color: #6c757d;
            }}
            .btn {{
                display: inline-block;
                background-color: #007bff;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                font-weight: bold;
            }}
        </style>
    </head>
    <body>
        <div class="card">
            <div class="error-icon">✗</div>
            <h1>Verification Failed</h1>
            <p>{error_message}</p>
            <p class="redirect-msg">You will be redirected to the login page in 5 seconds...</p>
            <a href="http://localhost:3000/login" class="btn">Go to Login</a>
        </div>
    </body>
    </html>
    """
