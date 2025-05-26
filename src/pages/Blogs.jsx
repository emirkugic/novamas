import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Blogs.css";

const Blogs = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(
			"https://novamasblog.com/wp-json/wp/v2/posts?orderby=date&order=desc&_embed"
		)
			.then((res) => res.json())
			.then((data) => {
				setPosts(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching blog posts:", error);
				setLoading(false);
			});
	}, []);

	const getImageForPost = (post) => {
		// Check for featured image
		const featured = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
		if (featured) return featured;

		// Otherwise, get first image from content
		const content = post.content?.rendered;
		if (content) {
			const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
			if (imgMatch) {
				return imgMatch[1];
			}
		}
		return null;
	};

	return (
		<div className="blogs-container">
			<h1 className="blogs-title">Latest Blogs</h1>
			{loading ? (
				<div className="loader">Loading blogs...</div>
			) : posts.length > 0 ? (
				<div className="blogs-list">
					{posts.map((post) => {
						const imageUrl = getImageForPost(post);
						return (
							<Link
								to={`/post/${post.slug}`}
								key={post.id}
								className="blog-card"
							>
								{imageUrl && (
									<img
										src={imageUrl}
										alt={post.title.rendered}
										className="blog-image"
									/>
								)}
								<div className="blog-content">
									<h2
										className="blog-title"
										dangerouslySetInnerHTML={{ __html: post.title.rendered }}
									/>
									<p
										className="blog-excerpt"
										dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
									/>
								</div>
							</Link>
						);
					})}
				</div>
			) : (
				<p className="not-found">No blog posts found.</p>
			)}
		</div>
	);
};

export default Blogs;
