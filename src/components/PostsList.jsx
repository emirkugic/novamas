import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./PostsList.css";

const PostsList = ({ posts, loading, limitExcerpt, getImageForPost }) => {
	return (
		<section className="latest-posts">
			<div className="container">
				<div className="section-header">
					<h2 className="section-title">Najnoviji članci</h2>
					<div className="section-line"></div>
				</div>

				{loading ? (
					<div className="loading-spinner">
						<div className="spinner"></div>
						<p>Učitavanje...</p>
					</div>
				) : (
					<div className="posts-grid">
						{posts.map((post) => (
							<Link
								to={`/post/${post.slug}`}
								className="post-card"
								key={post.id}
							>
								<div className="post-image">
									<img src={getImageForPost(post)} alt={post.title.rendered} />
								</div>
								<div className="post-content">
									<h3
										className="post-title"
										dangerouslySetInnerHTML={{ __html: post.title.rendered }}
									/>
									<div className="post-excerpt">
										<p>{limitExcerpt(post.excerpt.rendered, 100)}</p>
									</div>
									<div className="post-meta">
										<span className="post-date">
											{new Date(post.date)
												.toLocaleDateString("bs-BA", {
													day: "2-digit",
													month: "2-digit",
													year: "numeric",
												})
												.replace(/\./g, "/")}
										</span>
										<span className="read-more">
											Pročitaj više <ArrowRight size={14} />
										</span>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}

				<div className="view-all-container">
					<Link to="/blogs" className="btn btn-primary">
						Svi članci
					</Link>
				</div>
			</div>
		</section>
	);
};

export default PostsList;
