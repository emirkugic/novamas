<?php
// objave.php - Place this in the public directory
// Get the slug from the query parameter
$slug = isset($_GET['slug']) ? $_GET['slug'] : '';

if (empty($slug)) {
    // If no slug is provided, redirect to blogs page
    header('Location: /blogovi');
    exit;
}

// WordPress API endpoint to fetch post by slug
$api_url = "https://test.araneum.ba/wp-json/wp/v2/posts?slug=$slug&_embed";

// Make API request
$response = @file_get_contents($api_url);
if ($response === false) {
    $error = "Došlo je do greške pri učitavanju članka. Molimo pokušajte ponovo kasnije.";
} else {
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
        } else {
            // Try to extract first image from content
            preg_match('/<img[^>]+src="([^">]+)"/', $content, $imgMatches);
            if (!empty($imgMatches) && isset($imgMatches[1])) {
                $featured_image = $imgMatches[1];
                // Make sure image URL is absolute
                if (!preg_match('/^https?:\/\//', $featured_image)) {
                    $featured_image = 'https://test.araneum.ba' . $featured_image;
                }
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
            $related_api_url = "https://test.araneum.ba/wp-json/wp/v2/posts?categories=$category_id&exclude={$post['id']}&per_page=3&_embed";
            $related_response = @file_get_contents($related_api_url);
            if ($related_response !== false) {
                $related_posts = json_decode($related_response, true);
            }
        }
    }
}

// Function to get image for related posts
function get_post_image($post)
{
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
            $image = 'https://test.araneum.ba' . $image;
        }
        return $image;
    }

    return 'https://novamas.ba/SEO_cover.jpg';
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
        <link rel="canonical" href="https://novamas.ba/objave.php?slug=<?php echo urlencode($slug); ?>" />

        <!-- Open Graph / Facebook Meta Tags -->
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://novamas.ba/objave.php?slug=<?php echo urlencode($slug); ?>" />
        <meta property="og:title" content="<?php echo htmlspecialchars(strip_tags($title)); ?> - NovamaS" />
        <meta property="og:description" content="<?php echo htmlspecialchars($excerpt); ?>" />
        <?php if (!empty($featured_image)): ?>
            <meta property="og:image" content="<?php echo htmlspecialchars($featured_image); ?>" />
        <?php else: ?>
            <meta property="og:image" content="https://novamas.ba/SEO_cover.jpg" />
        <?php endif; ?>
        <meta property="og:site_name" content="NovamaS" />
        <meta property="article:published_time" content="<?php echo htmlspecialchars($post['date']); ?>" />
        <meta property="article:modified_time" content="<?php echo htmlspecialchars($post['modified']); ?>" />

        <!-- Twitter Meta Tags -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://novamas.ba/objave.php?slug=<?php echo urlencode($slug); ?>" />
        <meta name="twitter:title" content="<?php echo htmlspecialchars(strip_tags($title)); ?> - NovamaS" />
        <meta name="twitter:description" content="<?php echo htmlspecialchars($excerpt); ?>" />
        <?php if (!empty($featured_image)): ?>
            <meta name="twitter:image" content="<?php echo htmlspecialchars($featured_image); ?>" />
        <?php else: ?>
            <meta name="twitter:image" content="https://novamas.ba/SEO_cover.jpg" />
        <?php endif; ?>
    <?php endif; ?>

    <!-- Import fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Basic styling - you can expand this later -->
    <style>
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
            --shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            --shadow-light: 0 3px 10px rgba(0, 0, 0, 0.05);
            --shadow-card: 0 10px 30px rgba(255, 20, 147, 0.15);
            --radius: 12px;
            --font-primary: "Poppins", sans-serif;
            --font-display: "Playfair Display", serif;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-primary);
            color: var(--text);
            line-height: 1.6;
            background-color: var(--background);
        }

        a {
            text-decoration: none;
            color: inherit;
            transition: all 0.3s ease;
        }

        img {
            max-width: 100%;
            height: auto;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }

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

        .post-page {
            padding-top: 80px;
            min-height: 100vh;
        }

        .post-container {
            max-width: 800px;
            margin: 3rem auto;
            background: white;
            border-radius: var(--radius);
            box-shadow: var(--shadow-light);
            overflow: hidden;
        }

        .post-header {
            padding: 2rem 2rem 0;
        }

        .post-title {
            font-family: var(--font-display);
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            color: var(--secondary);
        }

        .post-meta {
            display: flex;
            gap: 2rem;
            color: var(--text-light);
            margin-bottom: 2rem;
            font-size: 0.95rem;
        }

        .post-image {
            width: 100%;
            margin-bottom: 2rem;
            border-radius: var(--radius);
            overflow: hidden;
        }

        .post-image img {
            width: 100%;
            display: block;
        }

        .post-content {
            padding: 0 2rem 2rem;
            line-height: 1.8;
            font-size: 1.1rem;
        }

        .post-content p {
            margin-bottom: 1.5rem;
        }

        .post-content img {
            max-width: 100%;
            height: auto;
            margin: 1.5rem 0;
            border-radius: var(--radius);
        }

        .post-content h2 {
            font-family: var(--font-display);
            font-size: 1.8rem;
            margin: 2rem 0 1rem;
            color: var(--secondary);
        }

        .post-content h3 {
            font-family: var(--font-display);
            font-size: 1.5rem;
            margin: 1.5rem 0 1rem;
            color: var(--secondary);
        }

        .post-navigation {
            display: flex;
            justify-content: space-between;
            padding: 2rem;
            border-top: 1px solid var(--border);
        }

        .nav-button {
            display: inline-flex;
            align-items: center;
            padding: 0.75rem 1.5rem;
            background-color: var(--background-light);
            border-radius: 50px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-button:hover {
            background-color: var(--primary);
            color: var(--white);
            transform: translateY(-3px);
        }

        .related-posts {
            padding: 5rem 0;
            background-color: var(--background-light);
        }

        .section-header {
            text-align: center;
            margin-bottom: 3rem;
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
        }

        .related-post-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-card);
        }

        .related-post-image {
            height: 200px;
            overflow: hidden;
        }

        .related-post-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .related-post-card:hover .related-post-image img {
            transform: scale(1.1);
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
        }

        .related-post-excerpt {
            color: var(--text-light);
            line-height: 1.6;
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
            flex-grow: 1;
        }

        .related-post-meta {
            font-size: 0.85rem;
            color: var(--text-light);
        }

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

        .btn {
            display: inline-flex;
            align-items: center;
            padding: 0.875rem 1.75rem;
            border-radius: 50px;
            font-weight: 500;
            background-color: var(--primary);
            color: var(--white);
            margin-top: 1.5rem;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn:hover {
            background-color: var(--primary-dark);
            transform: translateY(-3px);
        }

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

        /* Responsive styles */
        @media (max-width: 768px) {
            .post-title {
                font-size: 2rem;
            }

            .footer-container {
                grid-template-columns: 1fr;
            }

            .related-posts-grid {
                grid-template-columns: 1fr;
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
                    <a href="/blogovi" class="btn">Povratak na blogove</a>
                </div>
            </div>
        <?php else: ?>
            <div class="container">
                <div class="post-container">
                    <div class="post-header">
                        <h1 class="post-title"><?php echo $title; ?></h1>
                        <div class="post-meta">
                            <div class="post-date">
                                <span>📅 <?php echo htmlspecialchars($date); ?></span>
                            </div>
                            <div class="post-reading-time">
                                <span>⏱️ <?php echo htmlspecialchars($reading_time); ?> min čitanja</span>
                            </div>
                        </div>

                        <?php if (!empty($featured_image)): ?>
                            <div class="post-image">
                                <img src="<?php echo htmlspecialchars($featured_image); ?>" alt="<?php echo htmlspecialchars(strip_tags($title)); ?>" />
                            </div>
                        <?php endif; ?>
                    </div>

                    <div class="post-content"><?php echo $content; ?></div>

                    <div class="post-navigation">
                        <a href="/blogovi" class="nav-button">← Nazad na blogove</a>
                        <a href="/" class="nav-button">Početna</a>
                    </div>
                </div>
            </div>

            <?php if (!empty($related_posts)): ?>
                <div class="related-posts">
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
                                    </div>
                                    <div class="related-post-content">
                                        <h3 class="related-post-title"><?php echo $related_post['title']['rendered']; ?></h3>
                                        <p class="related-post-excerpt"><?php echo limit_excerpt($related_post['excerpt']['rendered']); ?></p>
                                        <div class="related-post-meta">
                                            <span><?php echo date('d/m/Y', strtotime($related_post['date'])); ?></span>
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