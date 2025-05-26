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

	return (
		<div className="blogs-container">
			<h1 className="blogs-title">Latest Blogs</h1>
			{loading ? (
				<div className="loader">Loading blogs...</div>
			) : posts.length > 0 ? (
				<div className="blogs-list">
					{posts.map((post) => (
						<Link to={`/post/${post.slug}`} key={post.id} className="blog-card">
							<h2
								className="blog-title"
								dangerouslySetInnerHTML={{ __html: post.title.rendered }}
							/>
							<p
								className="blog-excerpt"
								dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
							/>
						</Link>
					))}
				</div>
			) : (
				<p className="not-found">No blog posts found.</p>
			)}
		</div>
	);
};

export default Blogs;
