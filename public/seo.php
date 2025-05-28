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

// WordPress API endpoint to fetch post by slug
$api_url = "https://test.araneum.ba/wp-json/wp/v2/posts?slug=$slug&_embed";

// Make API request
$response = @file_get_contents($api_url);
if ($response === false) {
    $title = "NovamaS - Modna agencija za djecu i mlade";
    $description = "Ekskluzivni odabir najnovijih kolekcija, trendova i inspiracije za vaše mališane";
    $image = "https://novamas.ba/SEO_cover.jpg";
} else {
    $post = json_decode($response, true);

    // Check if post exists
    if (empty($post) || !is_array($post) || count($post) === 0) {
        $title = "NovamaS - Modna agencija za djecu i mlade";
        $description = "Ekskluzivni odabir najnovijih kolekcija, trendova i inspiracije za vaše mališane";
        $image = "https://novamas.ba/SEO_cover.jpg";
    } else {
        // Get the first (and only) post
        $post = $post[0];

        // Extract post data
        $title = strip_tags($post['title']['rendered']) . " - NovamaS";

        // Extract excerpt for description
        $description = '';
        if (isset($post['excerpt']['rendered'])) {
            $description = strip_tags($post['excerpt']['rendered']);
            if (strlen($description) > 160) {
                $description = substr($description, 0, 157) . '...';
            }
        } else {
            $description = "Ekskluzivni odabir najnovijih kolekcija, trendova i inspiracije za vaše mališane";
        }

        // Get featured image if available
        $image = 'https://novamas.ba/SEO_cover.jpg'; // Default image
        if (isset($post['_embedded']['wp:featuredmedia']) && !empty($post['_embedded']['wp:featuredmedia'])) {
            $image = $post['_embedded']['wp:featuredmedia'][0]['source_url'];
        } else {
            // Try to extract first image from content
            $content = $post['content']['rendered'];
            preg_match('/<img[^>]+src="([^">]+)"/', $content, $imgMatches);
            if (!empty($imgMatches) && isset($imgMatches[1])) {
                $image = $imgMatches[1];
                // Make sure image URL is absolute
                if (!preg_match('/^https?:\/\//', $image)) {
                    $image = 'https://test.araneum.ba' . $image;
                }
            }
        }

        // Get post date for article:published_time
        $published_time = isset($post['date']) ? $post['date'] : '';
        $modified_time = isset($post['modified']) ? $post['modified'] : '';
    }
}

// URL for canonical and og:url
$url = "https://novamas.ba/post/$slug";
?>
<!DOCTYPE html>
<html lang="en">

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
    <meta property="og:site_name" content="NovamaS" />

    <?php if (isset($published_time)): ?>
        <meta property="article:published_time" content="<?php echo htmlspecialchars($published_time); ?>" />
    <?php endif; ?>
    <?php if (isset($modified_time)): ?>
        <meta property="article:modified_time" content="<?php echo htmlspecialchars($modified_time); ?>" />
    <?php endif; ?>

    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="<?php echo htmlspecialchars($url); ?>" />
    <meta name="twitter:title" content="<?php echo htmlspecialchars($title); ?>" />
    <meta name="twitter:description" content="<?php echo htmlspecialchars($description); ?>" />
    <meta name="twitter:image" content="<?php echo htmlspecialchars($image); ?>" />
</head>

<body>
    <?php
    // Include the objave.php file directly with the slug
    $slug_param = urlencode($slug);
    include 'objave.php';
    ?>
</body>

</html>