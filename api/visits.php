<?php
// Simple API Endpoint to get all site visits as JSON
// Access: GET /api/visits.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../config.php';

try {
    $conn = getDBConnection();
    
    if (!$conn) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit;
    }
    
    // Get optional query parameters
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 1000;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    
    // Get all visits
    $query = "SELECT * FROM site_visits ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
    $stmt = $conn->prepare($query);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $visits = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get total count
    $count_stmt = $conn->query("SELECT COUNT(*) as total FROM site_visits");
    $total = $count_stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Return JSON response
    echo json_encode([
        'success' => true,
        'total' => (int)$total,
        'count' => count($visits),
        'visits' => $visits
    ], JSON_PRETTY_PRINT);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error',
        'message' => $e->getMessage()
    ]);
}
?>

