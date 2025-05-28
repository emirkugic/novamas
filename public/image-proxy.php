<?php
// image-proxy.php - Place this in the public directory
// This script downloads and serves images from the WordPress API
// so Facebook can access them from the same domain

// Prevent direct access without an image parameter
if (!isset($_GET['url']) || empty($_GET['url'])) {
    header('HTTP/1.1 400 Bad Request');
    echo 'Missing image URL parameter';
    exit;
}

// Get the image URL from the request
$imageUrl = urldecode($_GET['url']);

// Basic security check - only allow images from trusted domains
$allowedDomains = ['api.novamas.ba', 'novamas.ba', 'www.novamas.ba'];
$parsedUrl = parse_url($imageUrl);
$domain = isset($parsedUrl['host']) ? $parsedUrl['host'] : '';

$isAllowed = false;
foreach ($allowedDomains as $allowedDomain) {
    if (strpos($domain, $allowedDomain) !== false) {
        $isAllowed = true;
        break;
    }
}

if (!$isAllowed) {
    header('HTTP/1.1 403 Forbidden');
    echo 'Domain not allowed';
    exit;
}

// Create a stream context that disables SSL verification if needed
$arrContextOptions = [
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false,
    ],
    'http' => [
        'timeout' => 30, // Increase timeout to 30 seconds
        'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', // Use a standard user agent
    ]
];

// Fetch the image
$imageContent = @file_get_contents($imageUrl, false, stream_context_create($arrContextOptions));

if ($imageContent === false) {
    header('HTTP/1.1 404 Not Found');
    echo 'Could not fetch image';
    exit;
}

// Get file extension from the URL or default to jpg
$extension = pathinfo(parse_url($imageUrl, PHP_URL_PATH), PATHINFO_EXTENSION);
if (empty($extension)) {
    $extension = 'jpg';
}

// Set the appropriate content type
switch (strtolower($extension)) {
    case 'jpg':
    case 'jpeg':
        header('Content-Type: image/jpeg');
        break;
    case 'png':
        header('Content-Type: image/png');
        break;
    case 'gif':
        header('Content-Type: image/gif');
        break;
    case 'webp':
        header('Content-Type: image/webp');
        break;
    default:
        header('Content-Type: image/jpeg');
}

// Add caching headers
header('Cache-Control: public, max-age=86400'); // Cache for 1 day
header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + 86400));

// Output the image
echo $imageContent;
