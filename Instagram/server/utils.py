from datetime import datetime
from config import settings
import smtplib
from email.mime.text import MIMEText
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


BASE_URL = "http://localhost:3000/"


def hash(password: str) -> str:
    return pwd_context.hash(password)


def verify(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def send_reset_email(email, token):
    subject = "Password Reset Request"
    body = (
        f"Click the following link to reset your password: "
        f"{BASE_URL}resetpassword/{token}\n\n"
        f"The link is valid for only 15 minutes. "
        f"After that, you need to generate another link."
    )

    # Construct the email message
    message = MIMEText(body)
    message["Subject"] = subject
    message["From"] = settings.EMAIL_ADDRESS
    message["To"] = email

    # Connect to the SMTP server (in this case, Gmail's SMTP server)
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(settings.EMAIL_ADDRESS, settings.EMAIL_PASSWORD)

        # Send the email
        server.sendmail(settings.EMAIL_ADDRESS, [email], message.as_string())


def add_timestamps_to_document(document):
    current_time = datetime.utcnow()
    document['createdAt'] = document.get('createdAt', current_time)
    document['updatedAt'] = current_time
