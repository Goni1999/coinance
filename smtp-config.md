# SMTP Configuration for Coinance Contact Form

## Email Server Settings

Configure your contact form to use the following SMTP settings for sending emails:

### Hostinger SMTP Configuration

```
SMTP Server: smtp.hostinger.com
Port: 587 (TLS) or 465 (SSL)
Security: STARTTLS or SSL/TLS
Authentication: Required

Email Account: support@coinance.co
Password: [STORED SECURELY - Contact admin for access]
```

## Security Best Practices

⚠️ **IMPORTANT SECURITY NOTES:**

1. **Never store passwords in plain text** in your code or configuration files
2. **Use environment variables** or secure configuration management
3. **Implement proper access controls** for SMTP credentials
4. **Regular password rotation** is recommended
5. **Use application-specific passwords** when available

## Implementation Options

### Option 1: PHP Mail Configuration

Create `email-config.php`:

```php
<?php
// SMTP Configuration
$smtp_host = 'smtp.hostinger.com';
$smtp_port = 587;
$smtp_username = 'support@coinance.co';
$smtp_password = getenv('SMTP_PASSWORD'); // Use environment variable
$smtp_secure = 'tls';

// PHPMailer implementation
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

function sendContactEmail($formData) {
    global $smtp_host, $smtp_port, $smtp_username, $smtp_password, $smtp_secure;
    
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = $smtp_host;
        $mail->SMTPAuth = true;
        $mail->Username = $smtp_username;
        $mail->Password = $smtp_password;
        $mail->SMTPSecure = $smtp_secure;
        $mail->Port = $smtp_port;
        
        // Recipients
        $mail->setFrom($smtp_username, 'Coinance Support');
        $mail->addAddress('support@coinance.co', 'Coinance Team');
        $mail->addReplyTo($formData['email'], $formData['name']);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'New Lead from Coinance Landing Page';
        $mail->Body = generateEmailBody($formData);
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email sending failed: {$mail->ErrorInfo}");
        return false;
    }
}

function generateEmailBody($data) {
    return "
    <h2>New Lead from Coinance Website</h2>
    <p><strong>Name:</strong> {$data['name']}</p>
    <p><strong>Email:</strong> {$data['email']}</p>
    <p><strong>Phone:</strong> {$data['phone']}</p>
    <p><strong>Company:</strong> {$data['company']}</p>
    <p><strong>Service Interest:</strong> {$data['service']}</p>
    <p><strong>Message:</strong><br>{$data['message']}</p>
    <p><strong>Submitted:</strong> " . date('Y-m-d H:i:s') . "</p>
    ";
}
?>
```

### Option 2: Node.js Configuration

For Node.js applications using Nodemailer:

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'support@coinance.co',
        pass: process.env.SMTP_PASSWORD // Use environment variable
    }
});

async function sendContactEmail(formData) {
    const mailOptions = {
        from: '"Coinance Support" <support@coinance.co>',
        to: 'support@coinance.co',
        replyTo: formData.email,
        subject: 'New Lead from Coinance Landing Page',
        html: generateEmailHTML(formData)
    };
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.messageId);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
}
```

### Option 3: Python Configuration

For Python applications using smtplib:

```python
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_contact_email(form_data):
    smtp_server = "smtp.hostinger.com"
    smtp_port = 587
    smtp_username = "support@coinance.co"
    smtp_password = os.getenv('SMTP_PASSWORD')  # Use environment variable
    
    msg = MIMEMultipart()
    msg['From'] = smtp_username
    msg['To'] = "support@coinance.co"
    msg['Reply-To'] = form_data['email']
    msg['Subject'] = "New Lead from Coinance Landing Page"
    
    body = f"""
    New Lead from Coinance Website
    
    Name: {form_data['name']}
    Email: {form_data['email']}
    Phone: {form_data['phone']}
    Company: {form_data['company']}
    Service Interest: {form_data['service']}
    Message: {form_data['message']}
    """
    
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False
```

## Environment Variable Setup

### For Web Hosting (cPanel/Hostinger)

Add to `.env` file:
```
SMTP_PASSWORD=Zoja25##
```

### For Local Development

```bash
# Linux/Mac
export SMTP_PASSWORD="Zoja25##"

# Windows
set SMTP_PASSWORD=Zoja25##
```

### For Production Deployment

1. **Hostinger Hosting:** Use the hosting control panel to set environment variables
2. **VPS/Cloud:** Add to server environment variables
3. **Docker:** Use secrets or environment files
4. **CI/CD:** Store in secure variable storage

## Testing Configuration

Create a test script to verify SMTP settings:

```php
<?php
// test-smtp.php
require_once 'email-config.php';

$testData = [
    'name' => 'Test User',
    'email' => 'test@example.com',
    'phone' => '+1234567890',
    'company' => 'Test Company',
    'service' => 'inbound',
    'message' => 'This is a test message to verify SMTP configuration.'
];

if (sendContactEmail($testData)) {
    echo "✅ SMTP configuration is working correctly!";
} else {
    echo "❌ SMTP configuration failed. Check settings and credentials.";
}
?>
```

## Email Templates

### Lead Notification Email

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Lead - Coinance</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #0066cc; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 New Lead from Coinance Website</h1>
    </div>
    <div class="content">
        <div class="field">
            <span class="label">Name:</span> [CUSTOMER_NAME]
        </div>
        <div class="field">
            <span class="label">Email:</span> [CUSTOMER_EMAIL]
        </div>
        <div class="field">
            <span class="label">Phone:</span> [CUSTOMER_PHONE]
        </div>
        <div class="field">
            <span class="label">Company:</span> [CUSTOMER_COMPANY]
        </div>
        <div class="field">
            <span class="label">Service Interest:</span> [SERVICE_TYPE]
        </div>
        <div class="field">
            <span class="label">Message:</span><br>[CUSTOMER_MESSAGE]
        </div>
        <div class="field">
            <span class="label">Submitted:</span> [TIMESTAMP]
        </div>
    </div>
    <div class="footer">
        <p>This lead was generated from coinance.co contact form</p>
        <p>Reply to this email to respond directly to the customer</p>
    </div>
</body>
</html>
```

## Auto-Response Email

Set up an automatic confirmation email to customers:

```html
Subject: Thank you for contacting Coinance - We'll be in touch soon!

Dear [CUSTOMER_NAME],

Thank you for your interest in Coinance call center services!

We've received your inquiry and one of our specialists will contact you within 24 hours to discuss your needs and provide a customized solution.

Here's what happens next:
1. ✅ Your inquiry has been received and assigned to a specialist
2. 📞 We'll call or email you within 24 hours
3. 💼 We'll discuss your specific requirements
4. 📋 We'll provide a customized quote and proposal

If you have any urgent questions, please don't hesitate to contact us:
- Phone: +1 (555) 123-4567
- Email: support@coinance.co

Best regards,
The Coinance Team

---
This is an automated message. Please do not reply to this email.
For immediate assistance, contact support@coinance.co
```

## Troubleshooting Common Issues

### Connection Issues
- Verify SMTP server and port settings
- Check firewall rules for outbound SMTP traffic
- Ensure TLS/SSL settings match server requirements

### Authentication Issues
- Verify username and password
- Check if two-factor authentication is enabled
- Confirm account has SMTP access enabled

### Delivery Issues
- Check SPF/DKIM records for your domain
- Verify sender reputation
- Monitor bounce rates and spam reports

## Monitoring and Logging

Implement proper logging for email operations:

```php
// Log email attempts
function logEmailAttempt($success, $recipient, $error = null) {
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'success' => $success,
        'recipient' => $recipient,
        'error' => $error
    ];
    
    file_put_contents(
        'email_log.json', 
        json_encode($logEntry) . "\n", 
        FILE_APPEND | LOCK_EX
    );
}
```

## Security Checklist

- [ ] SMTP password stored securely (environment variables)
- [ ] Regular password rotation implemented
- [ ] Access logs monitored
- [ ] Rate limiting implemented
- [ ] Input validation on form data
- [ ] Email content sanitized
- [ ] Bounce handling configured
- [ ] Spam prevention measures in place

---

**📧 Contact for Support:**
- Email: support@coinance.co
- Technical Support: tech@coinance.co
- Phone: +1 (555) 123-4567 