import "../global.css";
import React, { useState, useEffect } from "react";
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
const Homepage = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [featuredPost, setFeaturedPost] = useState(null);

	useEffect(() => {
		// Fetch posts from WordPress backend
		fetch("https://novamasblog.com/wp-json/wp/v2/posts?per_page=7&_embed")
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
		return "https://images.unsplash.com/photo-1544476915-ed1370594142?q=80&w=1287&auto=format&fit=crop";
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
