<?php
// Visitor Tracking Script
// This file tracks all visitors to the site
// Include this file in your pages to track visits

require_once 'config.php';

// Function to get visitor's IP address
function getVisitorIP() {
    $ip_keys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR'];
    
    foreach ($ip_keys as $key) {
        if (array_key_exists($key, $_SERVER) === true) {
            foreach (explode(',', $_SERVER[$key]) as $ip) {
                $ip = trim($ip);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                    return $ip;
                }
            }
        }
    }
    
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

// Function to get location from IP (using free IP geolocation API)
function getLocationFromIP($ip) {
    // Skip localhost/private IPs
    if ($ip === '127.0.0.1' || $ip === '::1' || strpos($ip, '192.168.') === 0 || strpos($ip, '10.') === 0) {
        return [
            'country' => 'Local',
            'region' => 'Development',
            'city' => 'Localhost',
            'latitude' => null,
            'longitude' => null,
            'timezone' => null
        ];
    }
    
    // Use ip-api.com (free, no API key required, 45 requests/minute)
    $url = "http://ip-api.com/json/{$ip}?fields=status,message,country,regionName,city,lat,lon,timezone";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 2); // 2 second timeout
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
    $response = @curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200 && $response) {
        $data = json_decode($response, true);
        if ($data && isset($data['status']) && $data['status'] === 'success') {
            return [
                'country' => $data['country'] ?? null,
                'region' => $data['regionName'] ?? null,
                'city' => $data['city'] ?? null,
                'latitude' => $data['lat'] ?? null,
                'longitude' => $data['lon'] ?? null,
                'timezone' => $data['timezone'] ?? null
            ];
        }
    }
    
    return [
        'country' => null,
        'region' => null,
        'city' => null,
        'latitude' => null,
        'longitude' => null,
        'timezone' => null
    ];
}

// Function to detect device type
function getDeviceType($user_agent) {
    if (preg_match('/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i', $user_agent)) {
        return 'Mobile';
    } elseif (preg_match('/tablet|ipad|playbook|silk/i', $user_agent)) {
        return 'Tablet';
    }
    return 'Desktop';
}

// Function to get browser name
function getBrowser($user_agent) {
    if (preg_match('/MSIE|Trident/i', $user_agent)) {
        return 'Internet Explorer';
    } elseif (preg_match('/Edge/i', $user_agent)) {
        return 'Edge';
    } elseif (preg_match('/Chrome/i', $user_agent)) {
        return 'Chrome';
    } elseif (preg_match('/Safari/i', $user_agent)) {
        return 'Safari';
    } elseif (preg_match('/Firefox/i', $user_agent)) {
        return 'Firefox';
    } elseif (preg_match('/Opera|OPR/i', $user_agent)) {
        return 'Opera';
    }
    return 'Unknown';
}

// Function to get OS
function getOS($user_agent) {
    if (preg_match('/windows|win32|win64/i', $user_agent)) {
        return 'Windows';
    } elseif (preg_match('/macintosh|mac os x/i', $user_agent)) {
        return 'Mac OS';
    } elseif (preg_match('/linux/i', $user_agent)) {
        return 'Linux';
    } elseif (preg_match('/android/i', $user_agent)) {
        return 'Android';
    } elseif (preg_match('/iphone|ipad|ipod/i', $user_agent)) {
        return 'iOS';
    }
    return 'Unknown';
}

// Track visitor (run in background, don't block page load)
function trackVisitor() {
    // Start session if not started (only if headers not sent)
    if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
        @session_start();
    }
    
    // If session couldn't be started, generate a temporary session ID
    if (session_status() === PHP_SESSION_NONE) {
        $session_id = md5($_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT'] . time());
    } else {
        $session_id = session_id();
    }
    
    // Get visitor data
    $ip_address = getVisitorIP();
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? null;
    $referrer = $_SERVER['HTTP_REFERER'] ?? null;
    $page_visited = $_SERVER['REQUEST_URI'] ?? '/';
    
    // Get location (with timeout to not slow down page)
    $location = getLocationFromIP($ip_address);
    
    // Get device info
    $device_type = getDeviceType($user_agent);
    $browser = getBrowser($user_agent);
    $os = getOS($user_agent);
    
    // Connect to database
    $conn = getDBConnection();
    if (!$conn) {
        return; // Silently fail if DB connection fails
    }
    
    try {
        // Check if this IP visited in the last hour (to avoid duplicate entries for same session)
        $stmt = $conn->prepare("SELECT id, visit_count FROM site_visits WHERE ip_address = :ip AND session_id = :session_id AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR) ORDER BY created_at DESC LIMIT 1");
        $stmt->execute([
            ':ip' => $ip_address,
            ':session_id' => $session_id
        ]);
        $existing = $stmt->fetch();
        
        if ($existing) {
            // Update visit count for existing visit
            $stmt = $conn->prepare("UPDATE site_visits SET visit_count = visit_count + 1, page_visited = :page WHERE id = :id");
            $stmt->execute([
                ':page' => $page_visited,
                ':id' => $existing['id']
            ]);
        } else {
            // Insert new visit
            $stmt = $conn->prepare("INSERT INTO site_visits (ip_address, user_agent, referrer, page_visited, country, region, city, latitude, longitude, timezone, device_type, browser, os, session_id) VALUES (:ip_address, :user_agent, :referrer, :page_visited, :country, :region, :city, :latitude, :longitude, :timezone, :device_type, :browser, :os, :session_id)");
            $stmt->execute([
                ':ip_address' => $ip_address,
                ':user_agent' => $user_agent,
                ':referrer' => $referrer,
                ':page_visited' => $page_visited,
                ':country' => $location['country'],
                ':region' => $location['region'],
                ':city' => $location['city'],
                ':latitude' => $location['latitude'],
                ':longitude' => $location['longitude'],
                ':timezone' => $location['timezone'],
                ':device_type' => $device_type,
                ':browser' => $browser,
                ':os' => $os,
                ':session_id' => $session_id
            ]);
        }
    } catch(PDOException $e) {
        // Silently log error, don't break the page
        error_log("Visitor tracking error: " . $e->getMessage());
    }
}

// Track visitor (non-blocking)
// Run tracking in background to not slow down page load
// For FastCGI servers, we can finish the request first
if (function_exists('fastcgi_finish_request')) {
    // Finish sending response to browser first
    fastcgi_finish_request();
    // Then track visitor
    trackVisitor();
} else {
    // For regular PHP - track immediately (but try to be fast)
    // Use output buffering to send response first
    if (ob_get_level() > 0) {
        ob_end_flush();
    }
    trackVisitor();
}
?>

