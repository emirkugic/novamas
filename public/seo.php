<?php
// seo.php - Place this in the public directory
// Get the slug from the URL
$request_uri = $_SERVER['REQUEST_URI'];
preg_match('/\/post\/([^\/]+)\/?/', $request_uri, $matches);

if (empty($matches) || !isset($matches[1])) {
    // If no post slug found, redirect to homepage
    header('Location: /');
    exit;
}

$slug = $matches[1];

// Use same protocol as the current page
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https://' : 'http://';
$api_domain = 'api.novamas.ba';

// Current domain name without protocol
$current_domain = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'novamas.ba';

// WordPress API endpoint to fetch post by slug
$api_url = "{$protocol}{$api_domain}/wp-json/wp/v2/posts?slug=$slug&_embed";

// Create a stream context that disables SSL verification if needed
$arrContextOptions = [
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false,
    ],
    'http' => [
        'timeout' => 30 // Increase timeout to 30 seconds
    ]
];

// SEO metadata defaults
$title = "NovamaS - Modna agencija za djecu i mlade";
$description = "Ekskluzivni odabir najnovijih kolekcija, trendova i inspiracije za vaše mališane";
$image = "{$protocol}{$current_domain}/SEO_cover.jpg";
$image_width = 1200;
$image_height = 630;
$url = "{$protocol}{$current_domain}/post/{$slug}";
$published_time = "";
$modified_time = "";

// Make API request with the context
$response = @file_get_contents($api_url, false, stream_context_create($arrContextOptions));

if ($response === false) {
    // If HTTPS fails, try HTTP as fallback
    if ($protocol === 'https://') {
        $api_url = "http://{$api_domain}/wp-json/wp/v2/posts?slug=$slug&_embed";
        $response = @file_get_contents($api_url, false, stream_context_create($arrContextOptions));
    }
}

if ($response !== false) {
    $post = json_decode($response, true);

    // Check if post exists
    if (!empty($post) && is_array($post) && count($post) > 0) {
        // Get the first (and only) post
        $post = $post[0];

        // Extract post data
        $title = strip_tags($post['title']['rendered']) . " - NovamaS";

        // Extract excerpt for description
        if (isset($post['excerpt']['rendered'])) {
            $description = strip_tags($post['excerpt']['rendered']);
            if (strlen($description) > 160) {
                $description = substr($description, 0, 157) . '...';
            }
        }

        // Find image from multiple possible sources
        $image_found = false;
        $original_image = '';

        // 1. Try featured image first
        if (isset($post['_embedded']['wp:featuredmedia']) && !empty($post['_embedded']['wp:featuredmedia'])) {
            $original_image = $post['_embedded']['wp:featuredmedia'][0]['source_url'];
            $image_found = true;

            // Try to get image dimensions if available
            if (isset($post['_embedded']['wp:featuredmedia'][0]['media_details']['width'])) {
                $image_width = $post['_embedded']['wp:featuredmedia'][0]['media_details']['width'];
            }
            if (isset($post['_embedded']['wp:featuredmedia'][0]['media_details']['height'])) {
                $image_height = $post['_embedded']['wp:featuredmedia'][0]['media_details']['height'];
            }
        }

        // 2. If no featured image, try to extract any image from content
        if (!$image_found) {
            $content = $post['content']['rendered'];
            if (preg_match_all('/<img[^>]+src=([\'"])(.*?)\1[^>]*>/i', $content, $matches)) {
                if (!empty($matches[2][0])) {
                    $image_url = $matches[2][0];

                    // Make sure image URL is absolute
                    if (!preg_match('/^https?:\/\//', $image_url)) {
                        if (strpos($image_url, '/') === 0) {
                            // URL starts with slash
                            $image_url = $protocol . $api_domain . $image_url;
                        } else {
                            // URL is relative
                            $image_url = $protocol . $api_domain . '/' . $image_url;
                        }
                    }

                    $original_image = $image_url;
                    $image_found = true;
                }
            }
        }

        // 3. If still no image, try to find a gallery image
        if (!$image_found) {
            if (preg_match('/<figure[^>]*class="[^"]*wp-block-gallery[^"]*"[^>]*>.*?<img[^>]+src=([\'"])(.*?)\1[^>]*>/is', $content, $galleryMatches)) {
                if (!empty($galleryMatches[2])) {
                    $image_url = $galleryMatches[2];

                    // Make sure image URL is absolute
                    if (!preg_match('/^https?:\/\//', $image_url)) {
                        if (strpos($image_url, '/') === 0) {
                            // URL starts with slash
                            $image_url = $protocol . $api_domain . $image_url;
                        } else {
                            // URL is relative
                            $image_url = $protocol . $api_domain . '/' . $image_url;
                        }
                    }

                    $original_image = $image_url;
                    $image_found = true;
                }
            }
        }

        // Use the proxy for the image to avoid Facebook cross-domain issues
        if ($image_found && !empty($original_image)) {
            $image = "{$protocol}{$current_domain}/image-proxy.php?url=" . urlencode($original_image);
        }

        // Get post date for article:published_time
        $published_time = isset($post['date']) ? $post['date'] : '';
        $modified_time = isset($post['modified']) ? $post['modified'] : '';
    }
}

// For debugging (remove in production)
$debug = false;
?>
<!DOCTYPE html>
<html lang="en" prefix="og: http://ogp.me/ns#">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- Basic Meta Tags -->
    <title><?php echo htmlspecialchars($title); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($description); ?>" />
    <link rel="canonical" href="<?php echo htmlspecialchars($url); ?>" />

    <!-- Open Graph / Facebook Meta Tags -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="<?php echo htmlspecialchars($url); ?>" />
    <meta property="og:title" content="<?php echo htmlspecialchars($title); ?>" />
    <meta property="og:description" content="<?php echo htmlspecialchars($description); ?>" />
    <meta property="og:image" content="<?php echo htmlspecialchars($image); ?>" />
    <meta property="og:image:width" content="<?php echo htmlspecialchars($image_width); ?>" />
    <meta property="og:image:height" content="<?php echo htmlspecialchars($image_height); ?>" />
    <meta property="og:image:alt" content="<?php echo htmlspecialchars($title); ?>" />
    <meta property="og:site_name" content="NovamaS" />

    <?php if (!empty($published_time)): ?>
        <meta property="article:published_time" content="<?php echo htmlspecialchars($published_time); ?>" />
    <?php endif; ?>
    <?php if (!empty($modified_time)): ?>
        <meta property="article:modified_time" content="<?php echo htmlspecialchars($modified_time); ?>" />
    <?php endif; ?>

    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="<?php echo htmlspecialchars($url); ?>" />
    <meta name="twitter:title" content="<?php echo htmlspecialchars($title); ?>" />
    <meta name="twitter:description" content="<?php echo htmlspecialchars($description); ?>" />
    <meta name="twitter:image" content="<?php echo htmlspecialchars($image); ?>" />

    <!-- Force the browser to refresh OpenGraph data -->
    <meta property="og:image:secure_url" content="<?php echo htmlspecialchars($image); ?>" />
    <meta property="og:image:type" content="image/jpeg" />
</head>

<body>
    <?php if ($debug): ?>
        <div style="background:#f5f5f5; padding:20px; margin:20px; border:1px solid #ddd;">
            <h1>SEO Debug Info</h1>
            <p><strong>Title:</strong> <?php echo htmlspecialchars($title); ?></p>
            <p><strong>Description:</strong> <?php echo htmlspecialchars($description); ?></p>
            <p><strong>URL:</strong> <?php echo htmlspecialchars($url); ?></p>
            <p><strong>Original Image:</strong> <?php echo isset($original_image) ? htmlspecialchars($original_image) : 'None'; ?></p>
            <p><strong>Proxied Image:</strong> <?php echo htmlspecialchars($image); ?></p>
            <p><strong>Type:</strong> article</p>
            <p><strong>Published:</strong> <?php echo htmlspecialchars($published_time); ?></p>
            <p><strong>Modified:</strong> <?php echo htmlspecialchars($modified_time); ?></p>
            <p><strong>Image Size:</strong> <?php echo $image_width; ?> x <?php echo $image_height; ?></p>
            <hr>
            <h3>Image Preview:</h3>
            <img src="<?php echo htmlspecialchars($image); ?>" style="max-width:600px; margin-top:20px;" />
        </div>
    <?php else: ?>
        <?php
        // For regular users, redirect to the objave.php page
        header("Location: /objave.php?slug=" . urlencode($slug));
        exit;
        ?>
    <?php endif; ?>
</body>

</html>