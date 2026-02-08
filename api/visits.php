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
    $country = isset($_GET['country']) ? trim($_GET['country']) : null;
    $region = isset($_GET['region']) ? trim($_GET['region']) : null;
    $date_from = isset($_GET['date_from']) ? trim($_GET['date_from']) : null;
    $date_to = isset($_GET['date_to']) ? trim($_GET['date_to']) : null;
    
    // Build query with filters
    $query = "SELECT * FROM site_visits";
    $count_query = "SELECT COUNT(*) as total FROM site_visits";
    $where = [];
    $params = [];
    
    if ($country) {
        $where[] = "country = :country";
        $params[':country'] = $country;
    }
    if ($region) {
        $where[] = "region = :region";
        $params[':region'] = $region;
    }
    if ($date_from) {
        $where[] = "DATE(created_at) >= :date_from";
        $params[':date_from'] = $date_from;
    }
    if ($date_to) {
        $where[] = "DATE(created_at) <= :date_to";
        $params[':date_to'] = $date_to;
    }
    
    if (!empty($where)) {
        $query .= " WHERE " . implode(" AND ", $where);
        $count_query .= " WHERE " . implode(" AND ", $where);
    }
    
    $query .= " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
    
    $stmt = $conn->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $visits = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $count_stmt = $conn->prepare($count_query);
    foreach ($params as $key => $value) {
        $count_stmt->bindValue($key, $value);
    }
    $count_stmt->execute();
    $total = $count_stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Return JSON response
    $response = [
        'success' => true,
        'total' => (int)$total,
        'count' => count($visits),
        'visits' => $visits
    ];
    if ($country || $region || $date_from || $date_to) {
        $response['filters'] = array_filter([
            'country' => $country,
            'region' => $region,
            'date_from' => $date_from,
            'date_to' => $date_to
        ]);
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error',
        'message' => $e->getMessage()
    ]);
}
?>

