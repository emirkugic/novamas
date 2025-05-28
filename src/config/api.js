// src/config/api.js
const API_BASE_URL = "http://api.novamas.ba";

export const WP_API = {
	// Base WordPress REST API endpoint
	base: `${API_BASE_URL}/wp-json/wp/v2`,

	// Common API endpoints
	posts: `${API_BASE_URL}/wp-json/wp/v2/posts`,
	categories: `${API_BASE_URL}/wp-json/wp/v2/categories`,

	// Helper functions for common requests
	getPostBySlug: (slug) =>
		`${API_BASE_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
	getRelatedPosts: (categoryId, excludeId) =>
		`${API_BASE_URL}/wp-json/wp/v2/posts?categories=${categoryId}&exclude=${excludeId}&per_page=3&_embed`,
	getFeaturedPosts: (count = 7) =>
		`${API_BASE_URL}/wp-json/wp/v2/posts?per_page=${count}&_embed`,
	getAllPosts: (perPage = 100) =>
		`${API_BASE_URL}/wp-json/wp/v2/posts?orderby=date&order=desc&_embed&per_page=${perPage}`,
};

export default WP_API;
