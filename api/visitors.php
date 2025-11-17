<?php
// API Endpoint to get all site visitors as JSON
// Access: GET /api/visitors.php

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
        echo json_encode([
            'error' => 'Database connection failed',
            'message' => 'Unable to connect to the database. Please check your database configuration.'
        ]);
        exit;
    }
    
    // Get optional query parameters
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100; // Limit results
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0; // Pagination offset
    $country = isset($_GET['country']) ? $_GET['country'] : null; // Filter by country
    $page = isset($_GET['page']) ? $_GET['page'] : null; // Filter by page visited
    
    // Build query
    $query = "SELECT id, ip_address, user_agent, referrer, page_visited, country, region, city, latitude, longitude, timezone, device_type, browser, os, session_id, visit_count, created_at FROM site_visits";
    $params = [];
    $where = [];
    
    if ($country) {
        $where[] = "country = :country";
        $params[':country'] = $country;
    }
    
    if ($page) {
        $where[] = "page_visited = :page";
        $params[':page'] = $page;
    }
    
    if (!empty($where)) {
        $query .= " WHERE " . implode(" AND ", $where);
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
    $visitors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get total count
    $count_query = "SELECT COUNT(*) as total FROM site_visits";
    if (!empty($where)) {
        $count_query .= " WHERE " . implode(" AND ", $where);
    }
    $count_stmt = $conn->prepare($count_query);
    if (!empty($params)) {
        foreach ($params as $key => $value) {
            $count_stmt->bindValue($key, $value);
        }
    }
    $count_stmt->execute();
    $total = $count_stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get statistics
    $stats_query = "SELECT 
        COUNT(DISTINCT ip_address) as unique_visitors,
        COUNT(*) as total_visits,
        COUNT(DISTINCT country) as countries,
        COUNT(DISTINCT DATE(created_at)) as days_active
    FROM site_visits";
    $stats_stmt = $conn->query($stats_query);
    $stats = $stats_stmt->fetch(PDO::FETCH_ASSOC);
    
    // Get top countries
    $top_countries_query = "SELECT country, COUNT(*) as visits FROM site_visits WHERE country IS NOT NULL GROUP BY country ORDER BY visits DESC LIMIT 10";
    $top_countries_stmt = $conn->query($top_countries_query);
    $top_countries = $top_countries_stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get top pages
    $top_pages_query = "SELECT page_visited, COUNT(*) as visits FROM site_visits GROUP BY page_visited ORDER BY visits DESC LIMIT 10";
    $top_pages_stmt = $conn->query($top_pages_query);
    $top_pages = $top_pages_stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Return JSON response
    echo json_encode([
        'success' => true,
        'total' => (int)$total,
        'limit' => $limit,
        'offset' => $offset,
        'statistics' => [
            'unique_visitors' => (int)$stats['unique_visitors'],
            'total_visits' => (int)$stats['total_visits'],
            'countries' => (int)$stats['countries'],
            'days_active' => (int)$stats['days_active']
        ],
        'top_countries' => $top_countries,
        'top_pages' => $top_pages,
        'data' => $visitors
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

