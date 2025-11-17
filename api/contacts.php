<?php
// API Endpoint to get all contacts as JSON
// Access: GET /api/contacts.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config.php';

// Optional: Add API key authentication for security
// $api_key = isset($_GET['api_key']) ? $_GET['api_key'] : '';
// $valid_api_key = 'YOUR_SECRET_API_KEY'; // Set your API key here
// 
// if ($api_key !== $valid_api_key) {
//     http_response_code(401);
//     echo json_encode(['error' => 'Unauthorized - Invalid API key']);
//     exit;
// }

try {
    $conn = getDBConnection();
    
    if (!$conn) {
        http_response_code(500);
        // Check error log for detailed error message
        $error_details = [
            'error' => 'Database connection failed',
            'message' => 'Unable to connect to the database. Please check:',
            'checks' => [
                '1. MySQL service is running',
                '2. Database credentials are correct in config.php',
                '3. Database exists: ' . DB_NAME,
                '4. User has proper permissions',
                '5. Check PHP error logs for detailed error message'
            ]
        ];
        echo json_encode($error_details, JSON_PRETTY_PRINT);
        exit;
    }
    
    // Get optional query parameters
    $status = isset($_GET['status']) ? $_GET['status'] : null; // 'new', 'read', 'replied', or null for all
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100; // Limit results
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0; // Pagination offset
    
    // Build query
    $query = "SELECT id, name, email, message, ip_address, user_agent, created_at, status FROM folio_contacts";
    $params = [];
    
    if ($status && in_array($status, ['new', 'read', 'replied'])) {
        $query .= " WHERE status = :status";
        $params[':status'] = $status;
    }
    
    $query .= " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
    
    $stmt = $conn->prepare($query);
    
    // Bind parameters
    if (!empty($params)) {
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get total count
    $count_query = "SELECT COUNT(*) as total FROM folio_contacts";
    if ($status && in_array($status, ['new', 'read', 'replied'])) {
        $count_query .= " WHERE status = :status";
    }
    $count_stmt = $conn->prepare($count_query);
    if ($status && in_array($status, ['new', 'read', 'replied'])) {
        $count_stmt->bindValue(':status', $status);
    }
    $count_stmt->execute();
    $total = $count_stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Return JSON response
    echo json_encode([
        'success' => true,
        'total' => (int)$total,
        'limit' => $limit,
        'offset' => $offset,
        'data' => $contacts
    ], JSON_PRETTY_PRINT);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error',
        'message' => $e->getMessage()
    ]);
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Server error',
        'message' => $e->getMessage()
    ]);
}
?>

