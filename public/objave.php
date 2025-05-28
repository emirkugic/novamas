<?php
// objave.php - Place this in the public directory
// Get the slug from the query parameter
$slug = isset($_GET['slug']) ? $_GET['slug'] : '';

if (empty($slug)) {
    // If no slug is provided, redirect to blogs page
    header('Location: /blogovi');
    exit;
}

// Use same protocol as the current page
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https://' : 'http://';
$api_domain = 'api.novamas.ba';

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

// Make API request with the context
$response = @file_get_contents($api_url, false, stream_context_create($arrContextOptions));

if ($response === false) {
    // If HTTPS fails, try HTTP as fallback
    if ($protocol === 'https://') {
        $api_url = "http://{$api_domain}/wp-json/wp/v2/posts?slug=$slug&_embed";
        $response = @file_get_contents($api_url, false, stream_context_create($arrContextOptions));
    }

    // Still failed, show error
    if ($response === false) {
        $error = "Došlo je do greške pri učitavanju članka. Molimo pokušajte ponovo kasnije. (Error: " . error_get_last()['message'] . ")";
    }
}

if ($response !== false) {
    $post = json_decode($response, true);

    // Check if post exists
    if (empty($post) || !is_array($post) || count($post) === 0) {
        $error = "Članak nije pronađen.";
    } else {
        // Get the first (and only) post
        $post = $post[0];

        // Extract post data
        $title = $post['title']['rendered'];
        $content = $post['content']['rendered'];
        $date = date('d/m/Y', strtotime($post['date']));

        // Create excerpt from content
        $excerpt = strip_tags($post['excerpt']['rendered']);
        if (strlen($excerpt) > 160) {
            $excerpt = substr($excerpt, 0, 157) . '...';
        }

        // Get featured image if available
        $featured_image = '';
        if (isset($post['_embedded']['wp:featuredmedia']) && !empty($post['_embedded']['wp:featuredmedia'])) {
            $featured_image = $post['_embedded']['wp:featuredmedia'][0]['source_url'];

            // Check if featured image is in the content (to avoid duplication)
            if (strpos($content, $featured_image) !== false) {
                // Find and remove the first occurrence of the image in the content
                $pattern = '/<figure[^>]*>.*?<img[^>]*src="' . preg_quote($featured_image, '/') . '".*?<\/figure>/s';
                $content = preg_replace($pattern, '', $content, 1);
            }
        }

        // Estimate reading time (200 words per minute)
        $text = strip_tags($content);
        $word_count = str_word_count($text);
        $reading_time = ceil($word_count / 200);
        if ($reading_time < 1) $reading_time = 1;

        // Fetch related posts
        $related_posts = array();
        if (!empty($post['categories']) && isset($post['categories'][0])) {
            $category_id = $post['categories'][0];
            $related_api_url = "{$protocol}{$api_domain}/wp-json/wp/v2/posts?categories=$category_id&exclude={$post['id']}&per_page=3&_embed";
            $related_response = @file_get_contents($related_api_url, false, stream_context_create($arrContextOptions));
            if ($related_response !== false) {
                $related_posts = json_decode($related_response, true);
            }
        }
    }
}

// Function to get image for related posts
function get_post_image($post)
{
    global $protocol, $api_domain;

    if (isset($post['_embedded']['wp:featuredmedia']) && !empty($post['_embedded']['wp:featuredmedia'])) {
        return $post['_embedded']['wp:featuredmedia'][0]['source_url'];
    }

    // Try to extract first image from content
    $content = $post['content']['rendered'];
    preg_match('/<img[^>]+src="([^">]+)"/', $content, $imgMatches);
    if (!empty($imgMatches) && isset($imgMatches[1])) {
        $image = $imgMatches[1];
        // Make sure image URL is absolute
        if (!preg_match('/^https?:\/\//', $image)) {
            $image = $protocol . $api_domain . $image;
        }
        return $image;
    }

    // Return default image with correct protocol
    return $protocol . 'novamas.ba/SEO_cover.jpg';
}

// Function to limit excerpt for related posts
function limit_excerpt($excerpt, $limit = 120)
{
    $excerpt = strip_tags($excerpt);
    if (strlen($excerpt) <= $limit) return $excerpt;
    $excerpt = substr($excerpt, 0, $limit);
    $last_space = strrpos($excerpt, ' ');
    return substr($excerpt, 0, $last_space) . '...';
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <?php if (isset($error)): ?>
        <title>Greška - NovamaS</title>
        <meta name="description" content="Došlo je do greške pri učitavanju članka." />
    <?php else: ?>
        <!-- Basic Meta Tags -->
        <title><?php echo htmlspecialchars(strip_tags($title)); ?> - NovamaS</title>
        <meta name="description" content="<?php echo htmlspecialchars($excerpt); ?>" />
        <link rel="canonical" href="<?php echo $protocol; ?>novamas.ba/objave.php?slug=<?php echo urlencode($slug); ?>" />

        <!-- Open Graph / Facebook Meta Tags -->
        <meta property="og:type" content="article" />
        <meta property="og:url" content="<?php echo $protocol; ?>novamas.ba/objave.php?slug=<?php echo urlencode($slug); ?>" />
        <meta property="og:title" content="<?php echo htmlspecialchars(strip_tags($title)); ?> - NovamaS" />
        <meta property="og:description" content="<?php echo htmlspecialchars($excerpt); ?>" />
        <?php if (!empty($featured_image)): ?>
            <meta property="og:image" content="<?php echo htmlspecialchars($featured_image); ?>" />
        <?php else: ?>
            <meta property="og:image" content="<?php echo $protocol; ?>novamas.ba/SEO_cover.jpg" />
        <?php endif; ?>
        <meta property="og:site_name" content="NovamaS" />
        <meta property="article:published_time" content="<?php echo htmlspecialchars($post['date']); ?>" />
        <meta property="article:modified_time" content="<?php echo htmlspecialchars($post['modified']); ?>" />

        <!-- Twitter Meta Tags -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="<?php echo $protocol; ?>novamas.ba/objave.php?slug=<?php echo urlencode($slug); ?>" />
        <meta name="twitter:title" content="<?php echo htmlspecialchars(strip_tags($title)); ?> - NovamaS" />
        <meta name="twitter:description" content="<?php echo htmlspecialchars($excerpt); ?>" />
        <?php if (!empty($featured_image)): ?>
            <meta name="twitter:image" content="<?php echo htmlspecialchars($featured_image); ?>" />
        <?php else: ?>
            <meta name="twitter:image" content="<?php echo $protocol; ?>novamas.ba/SEO_cover.jpg" />
        <?php endif; ?>
    <?php endif; ?>

    <!-- Import fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Styling matching the React components -->
    <style>
        /* Variables matching global.css */
        :root {
            --primary: #ff1493;
            --primary-light: #ff77b6;
            --primary-dark: #c60071;
            --secondary: #333333;
            --text: #333333;
            --text-light: #666666;
            --background: #ffffff;
            --background-light: #f9f9f9;
            --background-pink: #fff6fa;
            --border: #eeeeee;
            --white: #ffffff;
            --black: #000000;
            --shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            --shadow-light: 0 3px 10px rgba(0, 0, 0, 0.05);
            --shadow-card: 0 10px 30px rgba(255, 20, 147, 0.15);
            --radius: 12px;
            --radius-small: 6px;
            --transition: all 0.3s ease;
            --container-width: 1200px;
            --font-primary: "Poppins", sans-serif;
            --font-display: "Playfair Display", serif;
        }

        /* Reset and Base Styles */
        *,
        *::before,
        *::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-primary);
            color: var(--text);
            line-height: 1.6;
            background-color: var(--background);
            overflow-x: hidden;
        }

        img {
            max-width: 100%;
            height: auto;
            display: block;
        }

        a {
            text-decoration: none;
            color: inherit;
            transition: var(--transition);
        }

        ul {
            list-style: none;
        }

        .container {
            width: 100%;
            max-width: var(--container-width);
            margin: 0 auto;
            padding: 0 1.5rem;
        }

        /* Button Styles */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.875rem 1.75rem;
            border-radius: 50px;
            font-weight: 500;
            font-size: 0.95rem;
            transition: var(--transition);
            cursor: pointer;
            border: none;
            outline: none;
        }

        .btn-primary {
            background-color: var(--primary);
            color: var(--white);
            box-shadow: 0 4px 15px rgba(255, 20, 147, 0.3);
        }

        .btn-primary:hover {
            background-color: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 20, 147, 0.4);
        }

        /* Header Styles */
        header {
            background-color: var(--white);
            box-shadow: var(--shadow-light);
            padding: 1rem 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
        }

        .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo img {
            height: 38px;
        }

        .nav-links {
            display: flex;
            gap: 2.5rem;
        }

        .nav-link {
            color: var(--secondary);
            font-weight: 500;
        }

        .nav-link:hover {
            color: var(--primary);
        }

        /* Post Page Styles - exactly matching Post.css */
        .post-page {
            min-height: 100vh;
            padding-top: 80px;
            /* Space for fixed navbar */
        }

        .post-content-wrapper {
            background-color: var(--white);
            position: relative;
            padding: 3rem 0 5rem;
        }

        .post-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 3rem;
            max-width: 800px;
            margin: 0 auto;
        }

        .post-main {
            background-color: var(--white);
            border-radius: var(--radius);
            overflow: hidden;
            box-shadow: var(--shadow-light);
        }

        /* Post Header */
        .post-header {
            padding: 2rem 2rem 0;
        }

        .post-categories {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }

        .post-category {
            background-color: var(--primary);
            color: var(--white);
            padding: 0.35rem 1rem;
            border-radius: 50px;
            font-size: 0.85rem;
            font-weight: 500;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            animation: fadeIn 0.6s ease;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .post-title {
            font-family: var(--font-display);
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 1.5rem;
            color: var(--secondary);
            animation: fadeIn 0.8s ease;
        }

        .post-meta-details {
            display: flex;
            align-items: center;
            gap: 2rem;
            font-size: 0.95rem;
            margin-bottom: 2rem;
            color: var(--text-light);
        }

        .post-date,
        .post-reading-time {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .post-featured-image {
            margin-bottom: 2rem;
            border-radius: var(--radius);
            overflow: hidden;
            box-shadow: var(--shadow-card);
        }

        .post-featured-image img {
            width: 100%;
            height: auto;
            display: block;
            transition: transform 0.5s ease;
        }

        .post-featured-image:hover img {
            transform: scale(1.02);
        }

        /* Post Content */
        .post-content {
            padding: 0 2rem 2rem;
            line-height: 1.8;
            font-size: 1.1rem;
            color: var(--text);
            overflow-wrap: break-word;
        }

        .post-content h1,
        .post-content h2,
        .post-content h3,
        .post-content h4,
        .post-content h5 {
            font-family: var(--font-display);
            color: var(--secondary);
            margin: 2rem 0 1rem;
            line-height: 1.3;
        }

        .post-content h2 {
            font-size: 1.8rem;
            border-bottom: 2px solid rgba(255, 20, 147, 0.1);
            padding-bottom: 0.5rem;
        }

        .post-content h3 {
            font-size: 1.5rem;
        }

        .post-content p {
            margin-bottom: 1.5rem;
        }

        .post-content img {
            max-width: 100%;
            height: auto;
            border-radius: var(--radius);
            margin: 2rem 0;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .post-content img:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .post-content a {
            color: var(--primary);
            transition: color 0.3s ease;
            text-decoration: underline;
            text-decoration-color: rgba(255, 20, 147, 0.3);
            text-decoration-thickness: 1px;
            text-underline-offset: 3px;
        }

        .post-content a:hover {
            color: var(--primary-dark);
            text-decoration-color: var(--primary);
        }

        .post-content blockquote {
            border-left: 4px solid var(--primary);
            padding: 1rem 2rem;
            margin: 2rem 0;
            background-color: rgba(255, 20, 147, 0.05);
            border-radius: 0 var(--radius) var(--radius) 0;
            font-style: italic;
            color: var(--text-light);
        }

        .post-content ul,
        .post-content ol {
            margin: 1.5rem 0;
            padding-left: 2rem;
        }

        .post-content li {
            margin-bottom: 0.5rem;
        }

        /* Gallery Styling - Matching the React styling exactly */
        .post-content .wp-block-gallery,
        .post-content .blocks-gallery-grid,
        .post-content ul.wp-block-gallery.columns-3,
        .post-content figure.wp-block-gallery.has-nested-images {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
            gap: 1rem !important;
            margin: 2rem 0 !important;
            padding: 0 !important;
            list-style: none !important;
            width: 100% !important;
        }

        /* Handle gallery items */
        .post-content .wp-block-gallery .wp-block-image,
        .post-content .wp-block-gallery figure,
        .post-content .wp-block-gallery .blocks-gallery-item,
        .post-content figure.wp-block-gallery.has-nested-images figure.wp-block-image {
            margin: 0 !important;
            overflow: hidden !important;
            border-radius: var(--radius-small) !important;
            box-shadow: var(--shadow-light) !important;
            transition: transform 0.3s ease, box-shadow 0.3s ease !important;
            height: 100% !important;
            width: 100% !important;
        }

        .post-content .wp-block-gallery .wp-block-image:hover,
        .post-content .wp-block-gallery figure:hover,
        .post-content .wp-block-gallery .blocks-gallery-item:hover,
        .post-content figure.wp-block-gallery.has-nested-images figure.wp-block-image:hover {
            transform: translateY(-5px) !important;
            box-shadow: var(--shadow-card) !important;
        }

        /* Handle gallery images */
        .post-content .wp-block-gallery .wp-block-image img,
        .post-content .wp-block-gallery figure img,
        .post-content .wp-block-gallery .blocks-gallery-item img,
        .post-content figure.wp-block-gallery.has-nested-images figure.wp-block-image img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            margin: 0 !important;
            box-shadow: none !important;
        }

        /* Fix for old gallery markup */
        .post-content .gallery {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
            gap: 1rem !important;
            margin: 2rem 0 !important;
        }

        .post-content .gallery .gallery-item {
            margin: 0 !important;
            padding: 0 !important;
        }

        .post-content .gallery .gallery-icon {
            overflow: hidden !important;
            border-radius: var(--radius-small) !important;
            box-shadow: var(--shadow-light) !important;
            transition: transform 0.3s ease, box-shadow 0.3s ease !important;
        }

        .post-content .gallery .gallery-icon:hover {
            transform: translateY(-5px) !important;
            box-shadow: var(--shadow-card) !important;
        }

        .post-content .gallery img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            margin: 0 !important;
            box-shadow: none !important;
        }

        /* Override WordPress default gallery styles */
        .post-content .wp-block-gallery.columns-3 .blocks-gallery-image,
        .post-content .wp-block-gallery.columns-3 .blocks-gallery-item,
        .post-content .wp-block-gallery.columns-default .blocks-gallery-image,
        .post-content .wp-block-gallery.columns-default .blocks-gallery-item {
            width: 100% !important;
            margin-right: 0 !important;
        }

        /* Fix figcaptions in galleries */
        .post-content .wp-block-gallery .blocks-gallery-caption,
        .post-content .wp-block-gallery figcaption {
            text-align: center;
            width: 100%;
            padding: 0.5rem;
            margin-top: 0.5rem;
            font-size: 0.9rem;
            color: var(--text-light);
        }

        /* Post Navigation */
        .post-navigation {
            display: flex;
            justify-content: space-between;
            padding: 2rem;
            border-top: 1px solid var(--border);
            gap: 1rem;
        }

        .nav-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.25rem;
            background-color: var(--background-light);
            border: 1px solid var(--border);
            border-radius: 50px;
            color: var(--text);
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .nav-button.prev {
            padding-left: 1rem;
        }

        .nav-button.next {
            padding-right: 1rem;
        }

        .nav-button.all {
            background-color: var(--white);
            border-color: var(--primary);
            color: var(--primary);
        }

        .nav-button:hover:not(.disabled) {
            background-color: var(--primary);
            color: var(--white);
            border-color: var(--primary);
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(255, 20, 147, 0.2);
        }

        .nav-button.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Related Posts Section */
        .related-posts-section {
            padding: 5rem 0;
            background-color: var(--background-light);
        }

        .section-header {
            text-align: center;
            margin-bottom: 3rem;
            position: relative;
        }

        .section-title {
            font-family: var(--font-display);
            font-size: 2.25rem;
            font-weight: 600;
            color: var(--secondary);
            margin-bottom: 1rem;
        }

        .section-line {
            height: 3px;
            width: 80px;
            background-color: var(--primary);
            margin: 0 auto;
        }

        .related-posts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .related-post-card {
            background-color: var(--white);
            border-radius: var(--radius);
            overflow: hidden;
            box-shadow: var(--shadow-light);
            transition: all 0.3s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
            border: 1px solid rgba(255, 20, 147, 0.05);
        }

        .related-post-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-card);
            border-color: rgba(255, 20, 147, 0.1);
        }

        .related-post-image {
            height: 200px;
            position: relative;
            overflow: hidden;
        }

        .related-post-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .related-post-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom,
                    rgba(0, 0, 0, 0) 70%,
                    rgba(0, 0, 0, 0.2) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .related-post-card:hover .related-post-image img {
            transform: scale(1.1);
        }

        .related-post-card:hover .related-post-overlay {
            opacity: 1;
        }

        .related-post-content {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }

        .related-post-title {
            font-family: var(--font-display);
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--secondary);
            margin-bottom: 1rem;
            line-height: 1.4;
            transition: color 0.3s ease;
        }

        .related-post-card:hover .related-post-title {
            color: var(--primary);
        }

        .related-post-excerpt {
            color: var(--text-light);
            line-height: 1.6;
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
            flex-grow: 1;
        }

        .related-post-meta {
            display: flex;
            justify-content: space-between;
            font-size: 0.85rem;
            color: var(--text-light);
        }

        /* Error message */
        .error-message {
            text-align: center;
            padding: 3rem;
        }

        .error-message h2 {
            font-family: var(--font-display);
            font-size: 2rem;
            color: var(--primary);
            margin-bottom: 1rem;
        }

        /* Footer */
        footer {
            background-color: var(--secondary);
            padding: 6rem 0 2rem;
            color: var(--white);
        }

        .footer-container {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 3rem;
            margin-bottom: 3rem;
        }

        .footer-logo img {
            height: 40px;
            filter: brightness(0) invert(1);
            margin-bottom: 1.5rem;
        }

        .footer-description {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 1.5rem;
        }

        .footer-heading {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            position: relative;
            padding-bottom: 0.75rem;
        }

        .footer-heading::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 40px;
            height: 2px;
            background-color: var(--primary);
        }

        .footer-links {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .footer-link {
            color: rgba(255, 255, 255, 0.7);
        }

        .footer-link:hover {
            color: var(--primary);
        }

        .footer-contact p {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 0.75rem;
        }

        .footer-bottom {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.5);
        }

        /* Special image handling - force all figures to display properly */
        .post-content figure {
            margin: 2rem 0;
            max-width: 100%;
        }

        .post-content figure img {
            margin: 0;
        }

        .post-content figure figcaption {
            text-align: center;
            font-size: 0.9rem;
            color: var(--text-light);
            padding: 0.5rem 0;
        }

        /* Fix for WordPress alignments */
        .post-content .aligncenter {
            display: block;
            margin: 1.5rem auto;
            text-align: center;
        }

        .post-content .alignleft {
            float: left;
            margin: 1rem 1.5rem 1rem 0;
        }

        .post-content .alignright {
            float: right;
            margin: 1rem 0 1rem 1.5rem;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
            .post-title {
                font-size: 2.2rem;
            }

            .post-cta-content h2 {
                font-size: 1.8rem;
            }

            .section-title {
                font-size: 2rem;
            }
        }

        @media (max-width: 768px) {
            .post-title {
                font-size: 1.8rem;
            }

            .post-meta-details {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.75rem;
            }

            .post-content {
                padding: 0 1.5rem 1.5rem;
                font-size: 1rem;
            }

            .post-header {
                padding: 1.5rem 1.5rem 0;
            }

            .post-navigation {
                flex-direction: column;
                gap: 1rem;
            }

            .nav-button {
                width: 100%;
                justify-content: center;
            }

            .footer-container {
                grid-template-columns: 1fr;
            }

            .related-posts-grid {
                grid-template-columns: 1fr;
            }

            .section-title {
                font-size: 1.8rem;
            }
        }

        @media (max-width: 576px) {
            .post-title {
                font-size: 1.6rem;
            }

            .post-content h2 {
                font-size: 1.5rem;
            }

            .post-content h3 {
                font-size: 1.3rem;
            }

            .section-title {
                font-size: 1.6rem;
            }
        }
    </style>
</head>

<body>
    <header>
        <div class="container header-container">
            <a href="/" class="logo">
                <img src="/logo.webp" alt="NovamaS" />
            </a>
            <div class="nav-links">
                <a href="/blogovi" class="nav-link">Blogovi</a>
                <a href="/o-nama" class="nav-link">O nama</a>
                <a href="/kontakt" class="nav-link">Kontakt</a>
            </div>
        </div>
    </header>

    <div class="post-page">
        <?php if (isset($error)): ?>
            <div class="container">
                <div class="error-message">
                    <h2>Greška</h2>
                    <p><?php echo htmlspecialchars($error); ?></p>
                    <a href="/blogovi" class="btn btn-primary">Povratak na blogove</a>
                </div>
            </div>
        <?php else: ?>
            <div class="post-content-wrapper">
                <div class="container">
                    <div class="post-grid">
                        <article class="post-main">
                            <div class="post-header">
                                <h1 class="post-title"><?php echo $title; ?></h1>
                                <div class="post-meta-details">
                                    <div class="post-date">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        <span><?php echo htmlspecialchars($date); ?></span>
                                    </div>
                                    <div class="post-reading-time">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                        <span><?php echo htmlspecialchars($reading_time); ?> min čitanja</span>
                                    </div>
                                </div>

                                <?php if (!empty($featured_image)): ?>
                                    <div class="post-featured-image">
                                        <img src="<?php echo htmlspecialchars($featured_image); ?>" alt="<?php echo htmlspecialchars(strip_tags($title)); ?>" />
                                    </div>
                                <?php endif; ?>
                            </div>

                            <div class="post-content"><?php echo $content; ?></div>

                            <div class="post-navigation">
                                <a href="/blogovi" class="nav-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="19" y1="12" x2="5" y2="12"></line>
                                        <polyline points="12 19 5 12 12 5"></polyline>
                                    </svg>
                                    <span>Nazad na blogove</span>
                                </a>
                                <a href="/" class="nav-button all">
                                    <span>Početna</span>
                                </a>
                            </div>
                        </article>
                    </div>
                </div>
            </div>

            <?php if (!empty($related_posts)): ?>
                <div class="related-posts-section">
                    <div class="container">
                        <div class="section-header">
                            <h2 class="section-title">Povezani članci</h2>
                            <div class="section-line"></div>
                        </div>

                        <div class="related-posts-grid">
                            <?php foreach ($related_posts as $related_post): ?>
                                <a href="/objave.php?slug=<?php echo urlencode($related_post['slug']); ?>" class="related-post-card">
                                    <div class="related-post-image">
                                        <img src="<?php echo htmlspecialchars(get_post_image($related_post)); ?>" alt="<?php echo htmlspecialchars(strip_tags($related_post['title']['rendered'])); ?>" />
                                        <div class="related-post-overlay"></div>
                                    </div>
                                    <div class="related-post-content">
                                        <h3 class="related-post-title"><?php echo $related_post['title']['rendered']; ?></h3>
                                        <p class="related-post-excerpt"><?php echo limit_excerpt($related_post['excerpt']['rendered']); ?></p>
                                        <div class="related-post-meta">
                                            <span class="related-post-date"><?php echo date('d/m/Y', strtotime($related_post['date'])); ?></span>
                                        </div>
                                    </div>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
        <?php endif; ?>
    </div>

    <footer>
        <div class="container">
            <div class="footer-container">
                <div class="footer-about">
                    <a href="/" class="footer-logo">
                        <img src="/logo.webp" alt="NovamaS" />
                    </a>
                    <p class="footer-description">
                        NovamaS je premium destinacija za dječiju modu i modne savjete.
                        Otkrijte najnovije trendove, kolekcije i inspiraciju za vaše mališane.
                    </p>
                </div>

                <div class="footer-links">
                    <h3 class="footer-heading">Brzi linkovi</h3>
                    <a href="/" class="footer-link">Početna</a>
                    <a href="/blogovi" class="footer-link">Blog</a>
                    <a href="/o-nama" class="footer-link">O nama</a>
                    <a href="/kontakt" class="footer-link">Kontakt</a>
                </div>

                <div class="footer-contact">
                    <h3 class="footer-heading">Kontakt</h3>
                    <p>Email: alma.musliovic@gmail.com</p>
                    <p>Telefon: +387 62 855 525</p>
                    <p>Adresa: Sarajevo, Bosna i Hercegovina</p>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; <?php echo date('Y'); ?> NovamaS. Sva prava zadržana.</p>
            </div>
        </div>
    </footer>
</body>

</html>