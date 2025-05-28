// generate-static-blog-pages.js
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

// Base URL of your WordPress API
const API_BASE_URL = "https://test.araneum.ba";
// Base URL of your frontend site (use your actual domain in production)
const SITE_URL = process.env.SITE_URL || "https://novamas.ba";

/**
 * This script generates static HTML files for each blog post
 * with proper SEO meta tags embedded directly in the HTML.
 */
async function generateStaticBlogPages() {
	console.log("Generating static HTML for blog posts...");

	try {
		// Fetch all posts from WordPress
		const postsResponse = await fetch(
			`${API_BASE_URL}/wp-json/wp/v2/posts?_embed&per_page=100`
		);

		if (!postsResponse.ok) {
			throw new Error(
				`Failed to fetch posts: ${postsResponse.status} ${postsResponse.statusText}`
			);
		}

		const posts = await postsResponse.json();
		console.log(`Found ${posts.length} posts to process`);

		// Create build/post directory if it doesn't exist
		const postDir = path.join(__dirname, "build", "post");
		if (!fs.existsSync(postDir)) {
			fs.mkdirSync(postDir, { recursive: true });
		}

		// Process each post
		for (const post of posts) {
			await generatePostHtml(post, postDir);
		}

		console.log("Static HTML generation complete!");
	} catch (error) {
		console.error("Error generating static HTML:", error);
		process.exit(1);
	}
}

/**
 * Generate HTML file for a specific post
 */
async function generatePostHtml(post, outputDir) {
	const slug = post.slug;
	console.log(`Processing post: ${slug}`);

	// Extract title, removing HTML tags
	const title = post.title.rendered.replace(/<\/?[^>]+(>|$)/g, "");

	// Extract description from excerpt
	let description = "";
	if (post.excerpt && post.excerpt.rendered) {
		description = post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "");
		if (description.length > 160) {
			description = description.substring(0, 157) + "...";
		}
	}

	// Get featured image or first image from content
	let image = `${SITE_URL}/SEO_cover.jpg`; // Default

	if (
		post._embedded &&
		post._embedded["wp:featuredmedia"] &&
		post._embedded["wp:featuredmedia"][0]
	) {
		image = post._embedded["wp:featuredmedia"][0].source_url;

		// Ensure the image URL is absolute
		if (image && !image.startsWith("http")) {
			image = `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
		}
	} else {
		// Try to extract first image from content
		const imgMatch = post.content.rendered.match(/<img[^>]+src="([^">]+)"/);
		if (imgMatch && imgMatch[1]) {
			image = imgMatch[1];
			// Make sure image URL is absolute
			if (image && !image.startsWith("http")) {
				image = `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
			}
		}
	}

	// Format date for meta tags
	const publishedTime = post.date;
	const modifiedTime = post.modified;

	// The post URL
	const postUrl = `${SITE_URL}/post/${slug}`;

	// Read the base HTML template
	const templatePath = path.join(__dirname, "build", "index.html");
	let htmlTemplate = fs.readFileSync(templatePath, "utf8");

	// Replace meta tags with post-specific ones
	htmlTemplate = htmlTemplate
		// Replace title
		.replace(/<title>.*?<\/title>/, `<title>${title} - NovamaS</title>`)
		// Replace description
		.replace(
			/<meta name="description" content=".*?"/,
			`<meta name="description" content="${description}"`
		)
		// Replace OG title
		.replace(
			/<meta property="og:title" content=".*?"/,
			`<meta property="og:title" content="${title} - NovamaS"`
		)
		// Replace OG description
		.replace(
			/<meta property="og:description" content=".*?"/,
			`<meta property="og:description" content="${description}"`
		)
		// Replace OG image
		.replace(
			/<meta property="og:image" content=".*?"/,
			`<meta property="og:image" content="${image}"`
		)
		// Replace OG URL
		.replace(
			/<meta property="og:url" content=".*?"/,
			`<meta property="og:url" content="${postUrl}"`
		)
		// Replace OG type
		.replace(
			/<meta property="og:type" content=".*?"/,
			`<meta property="og:type" content="article"`
		)
		// Add published time if not present
		.replace(
			"</head>",
			`  <meta property="article:published_time" content="${publishedTime}" />
  <meta property="article:modified_time" content="${modifiedTime}" />
</head>`
		)
		// Replace Twitter title
		.replace(
			/<meta name="twitter:title" content=".*?"/,
			`<meta name="twitter:title" content="${title} - NovamaS"`
		)
		// Replace Twitter description
		.replace(
			/<meta name="twitter:description" content=".*?"/,
			`<meta name="twitter:description" content="${description}"`
		)
		// Replace Twitter image
		.replace(
			/<meta name="twitter:image" content=".*?"/,
			`<meta name="twitter:image" content="${image}"`
		);

	// Create the output directory for this post if it doesn't exist
	const postOutputDir = path.join(outputDir, slug);
	if (!fs.existsSync(postOutputDir)) {
		fs.mkdirSync(postOutputDir, { recursive: true });
	}

	// Write the HTML file
	const outputPath = path.join(postOutputDir, "index.html");
	fs.writeFileSync(outputPath, htmlTemplate);

	console.log(`Generated HTML for ${slug} at ${outputPath}`);
}

// Run the script
generateStaticBlogPages();
