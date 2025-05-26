import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./FeaturedPost.css";

const FeaturedPost = ({ post, limitExcerpt, getImageForPost }) => {
	if (!post) return null;

	return (
		<section className="featured-post">
			<div className="container">
				<div className="section-header">
					<h2 className="section-title">Najnoviji članak</h2>
					<div className="section-line"></div>
				</div>
				<div className="featured-card">
					<div className="featured-image">
						<img src={getImageForPost(post)} alt={post.title.rendered} />
					</div>
					<div className="featured-content">
						<h3
							className="featured-title"
							dangerouslySetInnerHTML={{ __html: post.title.rendered }}
						/>
						<div className="featured-excerpt">
							<p>{limitExcerpt(post.excerpt.rendered, 180)}</p>
						</div>
						<Link to={`/post/${post.slug}`} className="btn btn-text">
							Pročitaj više <ArrowRight size={16} />
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

export default FeaturedPost;
