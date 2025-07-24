<?php
/**
 * Coinance Contact Form Handler
 * Processes contact form submissions and sends emails via SMTP
 * 
 * Security: Uses environment variables for SMTP credentials
 * Features: Input validation, spam protection, email templates
 */

// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Configuration
$config = [
    'smtp_host' => 'smtp.hostinger.com',
    'smtp_port' => 587,
    'smtp_username' => 'support@coinance.co',
    'smtp_password' => getenv('SMTP_PASSWORD') ?: 'Zoja25##', // Use environment variable or fallback
    'smtp_secure' => 'tls',
    'to_email' => 'support@coinance.co',
    'to_name' => 'Coinance Support Team',
    'from_name' => 'Coinance Website'
];

// Rate limiting (simple implementation)
session_start();
$last_submission = $_SESSION['last_submission'] ?? 0;
$min_interval = 60; // 1 minute between submissions

if (time() - $last_submission < $min_interval) {
    http_response_code(429);
    echo json_encode([
        'success' => false, 
        'message' => 'Please wait before submitting another request.'
    ]);
    exit;
}

try {
    // Get and validate form data
    $formData = validateFormData($_POST);
    
    // Check for spam indicators
    if (isSpam($formData)) {
        throw new Exception('Submission blocked due to spam indicators');
    }
    
    // Send email
    $emailSent = sendEmail($formData, $config);
    
    if ($emailSent) {
        // Update rate limiting
        $_SESSION['last_submission'] = time();
        
        // Log successful submission
        logSubmission($formData, true);
        
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for your message! We\'ll get back to you within 24 hours.'
        ]);
    } else {
        throw new Exception('Failed to send email');
    }
    
} catch (Exception $e) {
    // Log error
    error_log("Contact form error: " . $e->getMessage());
    logSubmission($_POST, false, $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error sending your message. Please try again or contact us directly.'
    ]);
}

/**
 * Validate and sanitize form data
 */
function validateFormData($data) {
    $errors = [];
    $clean = [];
    
    // Required fields
    $required = ['name', 'email', 'phone', 'company', 'service'];
    
    foreach ($required as $field) {
        if (empty($data[$field])) {
            $errors[] = ucfirst($field) . " is required";
        }
    }
    
    // Name validation
    if (!empty($data['name'])) {
        $clean['name'] = trim(strip_tags($data['name']));
        if (strlen($clean['name']) < 2 || strlen($clean['name']) > 100) {
            $errors[] = "Name must be between 2 and 100 characters";
        }
    }
    
    // Email validation
    if (!empty($data['email'])) {
        $clean['email'] = trim(strtolower($data['email']));
        if (!filter_var($clean['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Please enter a valid email address";
        }
    }
    
    // Phone validation
    if (!empty($data['phone'])) {
        $clean['phone'] = preg_replace('/[^\d\+\-\(\)\s]/', '', $data['phone']);
        if (strlen(preg_replace('/[^\d]/', '', $clean['phone'])) < 10) {
            $errors[] = "Please enter a valid phone number";
        }
    }
    
    // Company validation
    if (!empty($data['company'])) {
        $clean['company'] = trim(strip_tags($data['company']));
        if (strlen($clean['company']) > 200) {
            $errors[] = "Company name too long";
        }
    }
    
    // Service validation
    $validServices = ['inbound', 'outbound', 'livechat', 'customer', 'sales', 'technical', 'all'];
    if (!empty($data['service']) && in_array($data['service'], $validServices)) {
        $clean['service'] = $data['service'];
    } else {
        $errors[] = "Please select a valid service";
    }
    
    // Message (optional)
    $clean['message'] = !empty($data['message']) ? trim(strip_tags($data['message'])) : '';
    if (strlen($clean['message']) > 1000) {
        $errors[] = "Message too long (max 1000 characters)";
    }
    
    if (!empty($errors)) {
        throw new Exception(implode(', ', $errors));
    }
    
    return $clean;
}

/**
 * Simple spam detection
 */
function isSpam($data) {
    $spamWords = ['viagra', 'casino', 'lottery', 'winner', 'urgent', 'click here', 'act now'];
    $content = strtolower($data['name'] . ' ' . $data['company'] . ' ' . $data['message']);
    
    foreach ($spamWords as $word) {
        if (strpos($content, $word) !== false) {
            return true;
        }
    }
    
    // Check for excessive URLs
    if (preg_match_all('/https?:\/\//', $content) > 2) {
        return true;
    }
    
    // Check for repeated characters
    if (preg_match('/(.)\1{4,}/', $content)) {
        return true;
    }
    
    return false;
}

/**
 * Send email using SMTP
 */
function sendEmail($formData, $config) {
    // Check if PHPMailer is available
    if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        return sendEmailWithPHPMailer($formData, $config);
    } else {
        return sendEmailWithMailFunction($formData, $config);
    }
}

/**
 * Send email using PHPMailer (preferred method)
 */
function sendEmailWithPHPMailer($formData, $config) {
    if (file_exists('vendor/autoload.php')) {
        require_once 'vendor/autoload.php'; // Composer autoloader
    }
    
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = $config['smtp_host'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp_username'];
        $mail->Password = $config['smtp_password'];
        $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $config['smtp_port'];
        
        // Recipients
        $mail->setFrom($config['smtp_username'], $config['from_name']);
        $mail->addAddress($config['to_email'], $config['to_name']);
        $mail->addReplyTo($formData['email'], $formData['name']);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'New Lead from Coinance Website - ' . $formData['name'];
        $mail->Body = generateEmailHTML($formData);
        $mail->AltBody = generateEmailText($formData);
        
        $mail->send();
        
        // Send auto-response to customer
        sendAutoResponse($formData, $config, $mail);
        
        return true;
        
    } catch (\PHPMailer\PHPMailer\Exception $e) {
        error_log("PHPMailer Error: {$mail->ErrorInfo}");
        return false;
    } catch (Exception $e) {
        error_log("PHPMailer Error: " . $e->getMessage());
        return false;
    }
}

/**
 * Fallback email sending using mail() function
 */
function sendEmailWithMailFunction($formData, $config) {
    $to = $config['to_email'];
    $subject = 'New Lead from Coinance Website - ' . $formData['name'];
    $message = generateEmailHTML($formData);
    
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . $config['from_name'] . ' <' . $config['smtp_username'] . '>',
        'Reply-To: ' . $formData['email'],
        'X-Mailer: PHP/' . phpversion()
    ];
    
    return mail($to, $subject, $message, implode("\r\n", $headers));
}

/**
 * Generate HTML email body
 */
function generateEmailHTML($data) {
    $serviceNames = [
        'inbound' => 'Inbound Calling',
        'outbound' => 'Outbound Calling', 
        'livechat' => 'Live Chat Support',
        'customer' => 'Customer Support',
        'sales' => 'Sales Support',
        'technical' => 'Technical Support',
        'all' => 'All Services'
    ];
    
    $serviceName = $serviceNames[$data['service']] ?? $data['service'];
    
    return '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>New Lead - Coinance</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; }
            .header { background: #0066cc; color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px 20px; }
            .field { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; }
            .label { font-weight: bold; color: #0066cc; display: block; margin-bottom: 5px; }
            .value { color: #333; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
            .urgent { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎯 New Lead from Coinance Website</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">Submitted on ' . date('F j, Y \a\t g:i A') . '</p>
            </div>
            
            <div class="content">
                <div class="urgent">
                    <strong>⚡ Priority:</strong> New website lead - Follow up within 24 hours
                </div>
                
                <div class="field">
                    <span class="label">👤 Contact Name:</span>
                    <span class="value">' . htmlspecialchars($data['name']) . '</span>
                </div>
                
                <div class="field">
                    <span class="label">📧 Email Address:</span>
                    <span class="value"><a href="mailto:' . htmlspecialchars($data['email']) . '">' . htmlspecialchars($data['email']) . '</a></span>
                </div>
                
                <div class="field">
                    <span class="label">📞 Phone Number:</span>
                    <span class="value"><a href="tel:' . htmlspecialchars($data['phone']) . '">' . htmlspecialchars($data['phone']) . '</a></span>
                </div>
                
                <div class="field">
                    <span class="label">🏢 Company:</span>
                    <span class="value">' . htmlspecialchars($data['company']) . '</span>
                </div>
                
                <div class="field">
                    <span class="label">🎯 Service Interest:</span>
                    <span class="value">' . htmlspecialchars($serviceName) . '</span>
                </div>
                
                ' . ($data['message'] ? '
                <div class="field">
                    <span class="label">💬 Message:</span>
                    <div class="value" style="margin-top: 10px; white-space: pre-wrap;">' . htmlspecialchars($data['message']) . '</div>
                </div>
                ' : '') . '
                
                <div class="field">
                    <span class="label">🌐 Source:</span>
                    <span class="value">coinance.co contact form</span>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Next Steps:</strong></p>
                <p>1. Review lead information above<br>
                2. Contact within 24 hours<br>
                3. Log interaction in CRM<br>
                4. Schedule follow-up if needed</p>
                
                <p style="margin-top: 20px;">
                    <a href="mailto:' . htmlspecialchars($data['email']) . '?subject=Re: Your Coinance Inquiry" 
                       style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                       Reply to Customer
                    </a>
                </p>
            </div>
        </div>
    </body>
    </html>';
}

/**
 * Generate plain text email body
 */
function generateEmailText($data) {
    $serviceNames = [
        'inbound' => 'Inbound Calling',
        'outbound' => 'Outbound Calling', 
        'livechat' => 'Live Chat Support',
        'customer' => 'Customer Support',
        'sales' => 'Sales Support',
        'technical' => 'Technical Support',
        'all' => 'All Services'
    ];
    
    $serviceName = $serviceNames[$data['service']] ?? $data['service'];
    
    return "NEW LEAD FROM COINANCE WEBSITE\n" .
           "================================\n\n" .
           "Contact Name: " . $data['name'] . "\n" .
           "Email: " . $data['email'] . "\n" .
           "Phone: " . $data['phone'] . "\n" .
           "Company: " . $data['company'] . "\n" .
           "Service Interest: " . $serviceName . "\n" .
           ($data['message'] ? "\nMessage:\n" . $data['message'] . "\n" : "") .
           "\nSubmitted: " . date('Y-m-d H:i:s') . "\n" .
           "Source: coinance.co contact form\n\n" .
           "FOLLOW UP WITHIN 24 HOURS";
}

/**
 * Send auto-response to customer
 */
function sendAutoResponse($formData, $config, $mail = null) {
    if ($mail) {
        // Use existing PHPMailer instance
        try {
            $mail->clearAddresses();
            $mail->clearReplyTos();
            
            $mail->setFrom($config['smtp_username'], 'Coinance Support Team');
            $mail->addAddress($formData['email'], $formData['name']);
            $mail->addReplyTo($config['to_email'], 'Coinance Support');
            
            $mail->Subject = 'Thank you for contacting Coinance - We\'ll be in touch soon!';
            $mail->Body = generateAutoResponseHTML($formData);
            $mail->AltBody = generateAutoResponseText($formData);
            
            $mail->send();
        } catch (\PHPMailer\PHPMailer\Exception $e) {
            error_log("Auto-response failed: {$mail->ErrorInfo}");
        } catch (Exception $e) {
            error_log("Auto-response failed: " . $e->getMessage());
        }
    }
}

/**
 * Generate auto-response HTML
 */
function generateAutoResponseHTML($data) {
    return '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; }
            .header { background: #0066cc; color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .steps { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .step { margin-bottom: 15px; }
            .contact-info { background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Thank You, ' . htmlspecialchars($data['name']) . '!</h1>
                <p>We\'ve received your inquiry about our call center services</p>
            </div>
            
            <div class="content">
                <p>Thank you for your interest in Coinance call center services! We\'re excited to help you improve your customer experience.</p>
                
                <div class="steps">
                    <h3>What happens next:</h3>
                    <div class="step">✅ <strong>Your inquiry has been received</strong> and assigned to a specialist</div>
                    <div class="step">📞 <strong>We\'ll contact you within 24 hours</strong> to discuss your needs</div>
                    <div class="step">💼 <strong>We\'ll create a customized solution</strong> for your business</div>
                    <div class="step">📋 <strong>You\'ll receive a detailed proposal</strong> with pricing and timeline</div>
                </div>
                
                <div class="contact-info">
                    <h3>Need immediate assistance?</h3>
                    <p><strong>Phone:</strong> +1 (555) 123-4567<br>
                    <strong>Email:</strong> support@coinance.co<br>
                    <strong>Hours:</strong> 24/7 support available</p>
                </div>
                
                <p>We appreciate your business and look forward to serving you!</p>
                
                <p>Best regards,<br>
                <strong>The Coinance Team</strong></p>
            </div>
        </div>
    </body>
    </html>';
}

/**
 * Generate auto-response plain text
 */
function generateAutoResponseText($data) {
    return "Dear " . $data['name'] . ",\n\n" .
           "Thank you for your interest in Coinance call center services!\n\n" .
           "We've received your inquiry and one of our specialists will contact you within 24 hours.\n\n" .
           "What happens next:\n" .
           "1. Your inquiry has been received and assigned to a specialist\n" .
           "2. We'll call or email you within 24 hours\n" .
           "3. We'll discuss your specific requirements\n" .
           "4. We'll provide a customized quote and proposal\n\n" .
           "For immediate assistance:\n" .
           "Phone: +1 (555) 123-4567\n" .
           "Email: support@coinance.co\n\n" .
           "Best regards,\n" .
           "The Coinance Team\n\n" .
           "---\n" .
           "This is an automated message. For immediate assistance, contact support@coinance.co";
}

/**
 * Log form submissions
 */
function logSubmission($data, $success, $error = null) {
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'success' => $success,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'data' => [
            'name' => $data['name'] ?? '',
            'email' => $data['email'] ?? '',
            'company' => $data['company'] ?? '',
            'service' => $data['service'] ?? ''
        ],
        'error' => $error
    ];
    
    $logFile = 'logs/contact_submissions.log';
    
    // Create logs directory if it doesn't exist
    if (!is_dir('logs')) {
        mkdir('logs', 0755, true);
    }
    
    file_put_contents(
        $logFile, 
        json_encode($logEntry) . "\n", 
        FILE_APPEND | LOCK_EX
    );
}
?> 