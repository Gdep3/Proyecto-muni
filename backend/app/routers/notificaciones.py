import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST     = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT     = int(os.getenv("SMTP_PORT", 587))
SMTP_USER     = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
EMAIL_FROM    = os.getenv("EMAIL_FROM", "noreply@municipalidad.cl")

def enviar_notificacion_respuesta(
    email_destino: str,
    nombre_ciudadano: str,
    folio: str,
    asunto: str,
    respuesta: str,
):
    """Envía un email al ciudadano cuando su solicitud es respondida."""
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"[Notificación simulada] Email a {email_destino}: solicitud {folio} respondida")
        return

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Tu solicitud {folio} ha sido respondida"
        msg["From"]    = EMAIL_FROM
        msg["To"]      = email_destino

        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #15305b; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h2 style="color: white; margin: 0;">Municipalidad de Santo Domingo</h2>
                </div>
                <div style="border: 1px solid #ddd; padding: 24px; border-radius: 0 0 8px 8px;">
                    <p>Estimado/a <strong>{nombre_ciudadano}</strong>,</p>
                    <p>Su solicitud de información ha sido procesada.</p>
                    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                        <tr style="background-color: #f0f2f5;">
                            <td style="padding: 10px; font-weight: bold;">Folio</td>
                            <td style="padding: 10px;">{folio}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; font-weight: bold;">Asunto</td>
                            <td style="padding: 10px;">{asunto}</td>
                        </tr>
                    </table>
                    <p><strong>Respuesta:</strong></p>
                    <div style="background-color: #f9f9f9; padding: 16px; border-radius: 8px; border-left: 4px solid #15305b;">
                        {respuesta}
                    </div>
                    <p style="margin-top: 24px; color: #888; font-size: 12px;">
                        Este es un mensaje automático del Portal de Transparencia Municipal.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(EMAIL_FROM, email_destino, msg.as_string())

        print(f"✓ Email enviado a {email_destino}")

    except Exception as e:
        print(f"✗ Error enviando email: {e}")