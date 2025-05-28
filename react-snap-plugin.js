// react-snap-plugin.js
const fs = require("fs");
const path = require("path");

/**
 * Custom plugin to make react-snap work with React 19
 * This patches some compatibility issues and ensures proper handling of meta tags
 */
module.exports = async function (config) {
	console.log("Running custom react-snap plugin for React 19...");

	// Ensure we have a config object
	config = config || {};

	// Add special handling for React 19
	config.fixWebpackChunksIssue = false;
	config.removeStyleTags = false;
	config.inlineCss = false;

	// Never remove meta tags
	config.removeMetaTags = false;

	// Keep our Helmet-generated meta tags
	config.keepHelmetTags = true;

	// Add dynamic routes for blog posts
	try {
		// Try to fetch a list of actual blog posts from the API
		// This is a simplified version - in production you'd want to fetch all blog slugs
		const apiBaseUrl =
			process.env.REACT_APP_API_BASE_URL || "https://test.araneum.ba";
		const response = await fetch(
			`${apiBaseUrl}/wp-json/wp/v2/posts?_fields=slug&per_page=100`
		);

		if (response.ok) {
			const posts = await response.json();

			// Add each blog post URL to the include list
			posts.forEach((post) => {
				config.include.push(`/post/${post.slug}`);
			});

			console.log(
				`Added ${posts.length} blog post routes to react-snap config`
			);
		}
	} catch (error) {
		console.warn("Could not fetch blog posts for prerendering:", error);
		console.log("Will use default blog post route handling");

		// Fallback approach: just add a couple of common routes
		config.include.push("/post/*");
	}

	console.log("Final react-snap config:", config);
	return config;
};
