// src/pages/Homepage.jsx
import "../global.css";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedPost from "../components/FeaturedPost";
import PostsList from "../components/PostsList";
import KnowledgeSuccess from "../components/KnowledgeSuccess";
import NovamasHistory from "../components/NovamasHistory";
import FashionSpotlight from "../components/FashionSpotlight";
import InstagramFeed from "../components/InstagramFeed";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import SEOImage from "../components/SEOImage";

const Homepage = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [featuredPost, setFeaturedPost] = useState(null);

	// Get domain for absolute URLs
	const domain = process.env.REACT_APP_DOMAIN || window.location.origin;

	useEffect(() => {
		// Fetch posts from WordPress backend
		fetch("https://api.novamas.ba/wp-json/wp/v2/posts?per_page=7&_embed")
			.then((res) => res.json())
			.then((data) => {
				if (data && data.length > 0) {
					setFeaturedPost(data[0]);
					setPosts(data.slice(1));
				}
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching blog posts:", error);
				setLoading(false);
			});
	}, []);

	const getImageForPost = (post) => {
		// Check for featured image
		if (
			post._embedded &&
			post._embedded["wp:featuredmedia"] &&
			post._embedded["wp:featuredmedia"][0]
		) {
			return post._embedded["wp:featuredmedia"][0].source_url;
		}

		// Otherwise, get first image from content
		const content = post.content?.rendered;
		if (content) {
			const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
			if (imgMatch) {
				return imgMatch[1];
			}
		}

		// Default image if none found
		return `${domain}/SEO_cover.jpg`;
	};

	// Limit excerpt text to a specific character count
	const limitExcerpt = (excerpt, limit = 120) => {
		if (!excerpt) return "";

		// Remove HTML tags
		const textOnly = excerpt.replace(/<\/?[^>]+(>|$)/g, "");

		if (textOnly.length <= limit) return excerpt;

		// Find the last space before the limit
		const trimmed = textOnly.substr(0, limit);
		const lastSpace = trimmed.lastIndexOf(" ");

		// Return trimmed text with ellipsis
		return textOnly.substr(0, lastSpace) + "...";
	};

	return (
		<div className="homepage">
			{/* Add SEO meta tags */}
			<Helmet>
				<title>NovamaS - Svijet dječije mode</title>
				<meta
					name="description"
					content="Ekskluzivni odabir najnovijih kolekcija, trendova i inspiracije za vaše mališane. NovamaS je premium destinacija za dječiju modu i modne savjete."
				/>
				<link rel="canonical" href={domain} />

				{/* Open Graph / Facebook */}
				<meta property="og:type" content="website" />
				<meta property="og:url" content={domain} />
				<meta property="og:title" content="NovamaS - Svijet dječije mode" />
				<meta
					property="og:description"
					content="Ekskluzivni odabir najnovijih kolekcija, trendova i inspiracije za vaše mališane. NovamaS je premium destinacija za dječiju modu i modne savjete."
				/>
				<meta property="og:image" content={`${domain}/SEO_cover.jpg`} />
				<meta property="og:site_name" content="NovamaS" />

				{/* Twitter */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:url" content={domain} />
				<meta name="twitter:title" content="NovamaS - Svijet dječije mode" />
				<meta
					name="twitter:description"
					content="Ekskluzivni odabir najnovijih kolekcija, trendova i inspiracije za vaše mališane. NovamaS je premium destinacija za dječiju modu i modne savjete."
				/>
				<meta name="twitter:image" content={`${domain}/SEO_cover.jpg`} />
			</Helmet>

			{/* Include SEO Image component to make sure image is loaded */}
			<SEOImage />

			<Navbar />
			<Hero />

			{!loading && featuredPost && (
				<FeaturedPost
					post={featuredPost}
					limitExcerpt={limitExcerpt}
					getImageForPost={getImageForPost}
				/>
			)}

			<PostsList
				posts={posts}
				loading={loading}
				limitExcerpt={limitExcerpt}
				getImageForPost={getImageForPost}
			/>

			<KnowledgeSuccess />
			<NovamasHistory />
			<FashionSpotlight />
			<InstagramFeed />
			<Newsletter />
			<Footer />
		</div>
	);
};

export default Homepage;
