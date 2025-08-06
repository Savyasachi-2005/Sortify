from fastapi_mail import FastMail,MessageSchema,ConnectionConfig
from core.config import settings
from typing import List

conf= ConnectionConfig(
    MAIL_USERNAME = settings.mail_username,
    MAIL_PASSWORD = settings.mail_password,
    MAIL_FROM = settings.mail_from,
    MAIL_PORT = settings.mail_port,
    MAIL_SERVER = settings.mail_server,
    MAIL_FROM_NAME = "Sortify Team",  # You can customize
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)
async def send_verification_link(to: str, subject: str, body: str, subtype: str = "html"):
    message = MessageSchema(
        subject=subject,
        recipients=[to],
        body=body,
        subtype=subtype
    )

    fm = FastMail(conf)
    await fm.send_message(message)
