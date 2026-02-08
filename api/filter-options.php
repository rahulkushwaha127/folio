<?php
// API Endpoint to get filter options (countries, regions) for visits
// Access: GET /api/filter-options.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once '../config.php';

try {
    $conn = getDBConnection();
    
    if (!$conn) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit;
    }
    
    $country_filter = isset($_GET['country']) ? trim($_GET['country']) : null;
    
    // Get distinct countries
    $countries_query = "SELECT DISTINCT country FROM site_visits WHERE country IS NOT NULL AND country != '' ORDER BY country ASC";
    $countries_stmt = $conn->query($countries_query);
    $countries = $countries_stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Get distinct regions (optionally filtered by country)
    $regions_query = "SELECT DISTINCT region FROM site_visits WHERE region IS NOT NULL AND region != ''";
    $regions_params = [];
    if ($country_filter) {
        $regions_query .= " AND country = :country";
        $regions_params[':country'] = $country_filter;
    }
    $regions_query .= " ORDER BY region ASC";
    $regions_stmt = $conn->prepare($regions_query);
    foreach ($regions_params as $key => $value) {
        $regions_stmt->bindValue($key, $value);
    }
    $regions_stmt->execute();
    $regions = $regions_stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo json_encode([
        'success' => true,
        'countries' => array_values($countries),
        'regions' => array_values($regions)
    ], JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error',
        'message' => $e->getMessage()
    ]);
}
