<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'pwrfomdyed_folio');
define('DB_USER', 'pwrfomdyed_playwithpdf');
define('DB_PASS', 'jksdhfk54sf');

// Contact Email
define('CONTACT_EMAIL', 'rahulkushwaha14949@gmail.com');

// reCAPTCHA Configuration (if you want to enable it)
define('RECAPTCHA_SECRET_KEY', '6Lc7uGQsAAAAAH0Rao7f321MqxqT9_Ujuow3o_U-'); // Add your secret key here
define('RECAPTCHA_SITE_KEY', '6Lc7uGQsAAAAABDWnqqgamFgKJqV7zkIXMTkAiMa');

// Database Connection Function
function getDBConnection() {
    try {
        $conn = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_TIMEOUT => 5
            ]
        );
        return $conn;
    } catch(PDOException $e) {
        // Log detailed error for debugging
        $error_msg = "Database connection failed: " . $e->getMessage();
        error_log($error_msg);
        
        // In development, you can see the error (remove in production)
        if (defined('DEBUG_MODE') && DEBUG_MODE) {
            error_log("DB_HOST: " . DB_HOST);
            error_log("DB_NAME: " . DB_NAME);
            error_log("DB_USER: " . DB_USER);
        }
        
        return null;
    }
}
?>

