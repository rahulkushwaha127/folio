<?php
// Contact Form Handler
// This file processes the contact form submissions and saves to database

require_once 'config.php';

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Get form data
    $name = isset($_POST['Name']) ? trim($_POST['Name']) : '';
    $email = isset($_POST['Email']) ? trim($_POST['Email']) : '';
    $message = isset($_POST['Message']) ? trim($_POST['Message']) : '';
    $recaptcha_response = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '';
    
    // Get user info
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? null;
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? null;
    
    // Validate inputs
    $errors = [];
    
    if (empty($name)) {
        $errors[] = "Name is required";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    if (empty($message)) {
        $errors[] = "Message is required";
    }
    
    // Verify reCAPTCHA (optional - uncomment if you want to enable it)
    // if (!empty($recaptcha_response)) {
    //     $recaptcha_verify = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=" . RECAPTCHA_SECRET_KEY . "&response={$recaptcha_response}");
    //     $recaptcha_data = json_decode($recaptcha_verify);
    //     if (!$recaptcha_data->success) {
    //         $errors[] = "reCAPTCHA verification failed";
    //     }
    // }
    
    // If no errors, save to database and send email
    if (empty($errors)) {
        $conn = getDBConnection();
        
        if ($conn) {
            try {
                // Save to database
                $stmt = $conn->prepare("INSERT INTO folio_contacts (name, email, message, ip_address, user_agent, status) VALUES (:name, :email, :message, :ip_address, :user_agent, 'new')");
                $stmt->execute([
                    ':name' => $name,
                    ':email' => $email,
                    ':message' => $message,
                    ':ip_address' => $ip_address,
                    ':user_agent' => $user_agent
                ]);
                
                // Send email notification
                $to = CONTACT_EMAIL;
                $subject = "New Contact Form Submission from " . $name;
                $email_message = "Name: " . $name . "\n";
                $email_message .= "Email: " . $email . "\n\n";
                $email_message .= "Message:\n" . $message . "\n";
                
                $headers = "From: " . $email . "\r\n";
                $headers .= "Reply-To: " . $email . "\r\n";
                $headers .= "X-Mailer: PHP/" . phpversion();
                
                // Try to send email (don't fail if email fails, since we saved to DB)
                @mail($to, $subject, $email_message, $headers);
                
                $success = true;
            } catch(PDOException $e) {
                error_log("Database error: " . $e->getMessage());
                $errors[] = "Sorry, there was an error saving your message. Please try again later.";
            }
        } else {
            $errors[] = "Database connection failed. Please try again later.";
        }
    }
}

// Redirect back to contact page with message
$redirect_url = "/contact";
if (isset($success)) {
    $redirect_url .= "?success=1";
} elseif (!empty($errors)) {
    $redirect_url .= "?error=" . urlencode(implode(", ", $errors));
}
header("Location: " . $redirect_url);
exit();
?>

