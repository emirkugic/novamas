import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Post.css";

const Post = () => {
	const { slug } = useParams(); // Get slug from URL
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`https://novamasblog.com/wp-json/wp/v2/posts?slug=${slug}&_embed`)
			.then((res) => res.json())
			.then((data) => {
				if (data.length > 0) {
					setPost(data[0]);
				}
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching post:", error);
				setLoading(false);
			});
	}, [slug]);

	return (
		<div className="post-container">
			{loading ? (
				<p className="loading">Loading post...</p>
			) : post ? (
				<div className="post-card">
					<h1
						className="post-heading"
						dangerouslySetInnerHTML={{ __html: post.title.rendered }}
					/>
					<div
						className="post-content"
						dangerouslySetInnerHTML={{ __html: post.content.rendered }}
					/>
				</div>
			) : (
				<p className="not-found">Post not found.</p>
			)}
		</div>
	);
};

export default Post;
