<?php
// social_share.php - Create a version specifically for social media sharing

// Get the slug from query parameter
$slug = isset($_GET['slug']) ? $_GET['slug'] : '';

if (!empty($slug)) {
    // WordPress API URL
    $api_url = "https://test.araneum.ba/wp-json/wp/v2/posts?slug={$slug}&_embed";
    
    // Fetch post data from WordPress
    $response = @file_get_contents($api_url);
    
    if ($response !== false) {
        $posts = json_decode($response, true);
        
        if (!empty($posts) && isset($posts[0])) {
            $post = $posts[0];
            
            // Extract title
            $title = strip_tags($post['title']['rendered']);
            
            // Extract description
            $description = '';
            if (isset($post['excerpt']['rendered'])) {
                $description = strip_tags($post['excerpt']['rendered']);
                if (strlen($description) > 160) {
                    $description = substr($description, 0, 157) . '...';
                }
            }
            
            // Get image
            $image = 'https://novamas.ba/SEO_cover.jpg'; // Default
            
            if (isset($post['_embedded']['wp:featuredmedia'][0]['source_url'])) {
                $image = $post['_embedded']['wp:featuredmedia'][0]['source_url'];
            } else {
                // Try to find first image in content
                preg_match('/<img[^>]+src="([^">]+)"/', $post['content']['rendered'], $matches);
                if (isset($matches[1])) {
                    $image = $matches[1];
                    
                    // Make sure image URL is absolute
                    if (strpos($image, 'http') !== 0) {
                        $image = 'https://test.araneum.ba' . (strpos($image, '/') === 0 ? '' : '/') . $image;
                    }
                }
            }
            
            // Current URL (important - this matches what Facebook is crawling)
            $current_url = "https://novamas.ba/social_share.php?slug={$slug}";
            
            // Extract post content (limited to avoid large pages)
            $content = strip_tags($post['content']['rendered']);
            if (strlen($content) > 1000) {
                $content = substr($content, 0, 1000) . '...';
            }
            
            // Format the date
            $date = date('d.m.Y', strtotime($post['date']));
            
            // Output HTML without redirects
            header('Content-Type: text/html; charset=utf-8');
            
            echo '<!DOCTYPE html>
<html lang="bs">
<head>
    <meta charset="utf-8" />
    <title>' . $title . ' - NovamaS</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="' . $description . '" />
    <link rel="canonical" href="' . $current_url . '" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="' . $current_url . '" />
    <meta property="og:title" content="' . $title . ' - NovamaS" />
    <meta property="og:description" content="' . $description . '" />
    <meta property="og:image" content="' . $image . '" />
    <meta property="og:site_name" content="NovamaS" />
    <meta property="fb:app_id" content="123456789" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="' . $current_url . '" />
    <meta name="twitter:title" content="' . $title . ' - NovamaS" />
    <meta name="twitter:description" content="' . $description . '" />
    <meta name="twitter:image" content="' . $image . '" />
    
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            color: #333;
            line-height: 1.6;
        }
        h1 { 
            color: #ff1493;
            margin-bottom: 10px;
        }
        img { 
            max-width: 100%; 
            height: auto; 
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .meta { 
            color: #777;
            font-size: 0.9em;
            margin-bottom: 20px;
        }
        .content { 
            margin: 30px 0;
        }
        .cta {
            background: #ff1493;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
            font-weight: bold;
        }
        .note {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 30px 0 10px 0;
            font-size: 0.9em;
            border-left: 4px solid #ff1493;
        }
    </style>
</head>
<body>
    <h1>' . $title . '</h1>
    <div class="meta">Published on ' . $date . ' | NovamaS</div>
    
    <img src="' . $image . '" alt="' . $title . '" />
    
    <div class="content">
        <p>' . $content . '</p>
    </div>
    
    <a href="https://novamas.ba/post/' . $slug . '" class="cta">Read the full article on our website</a>
    
    <div class="note">
        <p>This is a special version of this article for social media sharing. Visit our website for the full interactive experience.</p>
    </div>
</body>
</html>';
            exit;
        }
    }
}

// If we get here, display an error
echo '<!DOCTYPE html>
<html lang="bs">
<head>
    <meta charset="utf-8" />
    <title>Post Not Found - NovamaS</title>
    <meta property="og:title" content="Post Not Found - NovamaS" />
    <meta property="og:description" content="The requested post could not be found." />
    <meta property="og:image" content="https://novamas.ba/SEO_cover.jpg" />
    <meta property="og:url" content="https://novamas.ba" />
</head>
<body>
    <h1>Post Not Found</h1>
    <p>The requested post could not be found. Please check the URL and try again.</p>
    <p><a href="https://novamas.ba">Return to NovamaS homepage</a></p>
</body>
</html>';
?>