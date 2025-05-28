// src/pages/Post.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
	Calendar,
	Clock,
	ArrowLeft,
	ArrowRight,
	Share2,
	Facebook,
	Instagram,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Post.css";
import "../global.css";

const Post = () => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [relatedPosts, setRelatedPosts] = useState([]);
	const [error, setError] = useState(null);
	// SEO metadata state
	const [seoData, setSeoData] = useState({
		title: "NovamaS - Modna agencija za djecu i mlade",
		description:
			"Ekskluzivni odabir najnovijih kolekcija, trendova i inspiracije za vaše mališane",
		image: `${window.location.origin}/SEO_cover.jpg`,
		url: window.location.href,
		type: "website",
	});

	useEffect(() => {
		// Reset scroll position when post changes
		window.scrollTo(0, 0);

		setLoading(true);

		// Fetch the post by slug with embedded media
		fetch(`http://api.novamas.ba/wp-json/wp/v2/posts?slug=${slug}&_embed`)
			.then((res) => {
				if (!res.ok) {
					throw new Error("Failed to fetch post");
				}
				return res.json();
			})
			.then((data) => {
				if (data.length > 0) {
					const postData = data[0];
					setPost(postData);
					console.log("Post Data:", postData); // Debug log

					// Check if the post has SEO metadata from our plugin
					if (postData.seo_metadata) {
						console.log("SEO Metadata from API:", postData.seo_metadata); // Debug log

						// Use the SEO metadata from the plugin
						setSeoData({
							title:
								postData.seo_metadata.title ||
								"NovamaS - " +
									postData.title.rendered.replace(/<\/?[^>]+(>|$)/g, ""),
							description: postData.seo_metadata.description || "",
							image:
								postData.seo_metadata.image ||
								`${window.location.origin}/SEO_cover.jpg`,
							url: `${window.location.origin}/post/${slug}`,
							type: "article",
							publishedTime: postData.date,
							modifiedTime: postData.modified,
						});
					} else {
						// Fallback: Extract SEO data manually
						const title = postData.title.rendered.replace(
							/<\/?[^>]+(>|$)/g,
							""
						);
						let description = "";
						if (postData.excerpt && postData.excerpt.rendered) {
							description = postData.excerpt.rendered.replace(
								/<\/?[^>]+(>|$)/g,
								""
							);
							if (description.length > 160) {
								description = description.substring(0, 157) + "...";
							}
						}

						// Get image (featured image or first content image)
						let image = `${window.location.origin}/SEO_cover.jpg`; // Default

						if (
							postData._embedded &&
							postData._embedded["wp:featuredmedia"] &&
							postData._embedded["wp:featuredmedia"][0]
						) {
							image = postData._embedded["wp:featuredmedia"][0].source_url;
						} else {
							// Try to extract first image from content
							const imgMatch = postData.content.rendered.match(
								/<img[^>]+src="([^">]+)"/
							);
							if (imgMatch && imgMatch[1]) {
								image = imgMatch[1];
								// Make sure image URL is absolute
								if (image && !image.startsWith("http")) {
									image = `http://api.novamas.ba${image}`;
								}
							}
						}

						// Update SEO data
						setSeoData({
							title,
							description,
							image,
							url: `${window.location.origin}/post/${slug}`,
							type: "article",
							publishedTime: postData.date,
							modifiedTime: postData.modified,
						});
					}

					// After getting the post, fetch related posts from same category
					if (postData.categories && postData.categories.length > 0) {
						fetchRelatedPosts(postData.categories[0], postData.id);
					}
				} else {
					setError("Blog nije pronađen.");
				}
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching post:", error);
				setError("Failed to load post. Please try again later.");
				setLoading(false);
			});
	}, [slug]);

	// Log SEO data for debugging
	useEffect(() => {
		console.log("Final SEO Data:", seoData);
	}, [seoData]);

	const fetchRelatedPosts = (categoryId, currentPostId) => {
		fetch(
			`http://api.novamas.ba/wp-json/wp/v2/posts?categories=${categoryId}&exclude=${currentPostId}&per_page=3&_embed`
		)
			.then((res) => res.json())
			.then((data) => {
				setRelatedPosts(data);
			})
			.catch((error) => {
				console.error("Error fetching related posts:", error);
			});
	};

	// Extract featured image or first image from content
	const getPostImage = (post) => {
		// Check for featured image
		if (
			post._embedded &&
			post._embedded["wp:featuredmedia"] &&
			post._embedded["wp:featuredmedia"][0]
		) {
			return post._embedded["wp:featuredmedia"][0].source_url;
		}

		// Try to find first image in content
		const content = post.content?.rendered;
		if (content) {
			const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
			if (imgMatch) {
				let imageUrl = imgMatch[1];
				// Make sure image URL is absolute
				if (imageUrl && !imageUrl.startsWith("http")) {
					imageUrl = `http://api.novamas.ba${imageUrl}`;
				}
				return imageUrl;
			}
		}

		return `${window.location.origin}/SEO_cover.jpg`;
	};

	// Format date
	const formatDate = (dateString) => {
		return new Date(dateString)
			.toLocaleDateString("bs-BA", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			})
			.replace(/\./g, "/");
	};

	// Estimate reading time (200 words per minute)
	const getReadingTime = (content) => {
		const text = content.replace(/<\/?[^>]+(>|$)/g, "");
		const wordCount = text.split(/\s+/).length;
		const readingTime = Math.ceil(wordCount / 200);
		return readingTime > 0 ? readingTime : 1;
	};

	// Handle navigation to previous or next post
	const handleNavigation = (direction) => {
		if (relatedPosts.length > 0) {
			const targetPost =
				relatedPosts[direction === "next" ? 0 : relatedPosts.length - 1];
			navigate(`/post/${targetPost.slug}`);
		}
	};

	// Limit excerpt text for related posts
	const limitExcerpt = (excerpt, limit = 120) => {
		if (!excerpt) return "";
		const textOnly = excerpt.replace(/<\/?[^>]+(>|$)/g, "");
		if (textOnly.length <= limit) return textOnly;
		const trimmed = textOnly.substr(0, limit);
		const lastSpace = trimmed.lastIndexOf(" ");
		return textOnly.substr(0, lastSpace) + "...";
	};

	return (
		<>
			{/* SEO metadata - This is what social media crawlers will see */}
			<Helmet>
				<title>{seoData.title}</title>
				<meta name="description" content={seoData.description} />
				<link rel="canonical" href={seoData.url} />

				{/* Open Graph / Facebook */}
				<meta property="og:type" content={seoData.type} />
				<meta property="og:url" content={seoData.url} />
				<meta property="og:title" content={seoData.title} />
				<meta property="og:description" content={seoData.description} />
				<meta property="og:image" content={seoData.image} />
				<meta property="og:site_name" content="NovamaS" />
				{seoData.publishedTime && (
					<meta
						property="article:published_time"
						content={seoData.publishedTime}
					/>
				)}
				{seoData.modifiedTime && (
					<meta
						property="article:modified_time"
						content={seoData.modifiedTime}
					/>
				)}

				{/* Twitter */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:url" content={seoData.url} />
				<meta name="twitter:title" content={seoData.title} />
				<meta name="twitter:description" content={seoData.description} />
				<meta name="twitter:image" content={seoData.image} />
			</Helmet>

			<Navbar />
			<div className="post-page">
				{loading ? (
					<div className="post-loading">
						<div className="spinner"></div>
						<p>Učitavanje članka...</p>
					</div>
				) : error ? (
					<div className="post-error">
						<h2>Greška</h2>
						<p>{error}</p>
						<Link to="/blogovi" className="btn btn-primary">
							Povratak na blogove
						</Link>
					</div>
				) : post ? (
					<>
						<div className="post-content-wrapper">
							<div className="container">
								<div className="post-grid">
									<article className="post-main">
										<div className="post-header">
											<h1
												className="post-title"
												dangerouslySetInnerHTML={{
													__html: post.title.rendered,
												}}
											/>
											<div className="post-meta-details">
												<div className="post-date">
													<Calendar size={16} />
													<span>{formatDate(post.date)}</span>
												</div>
												<div className="post-reading-time">
													<Clock size={16} />
													<span>
														{getReadingTime(post.content.rendered)} min čitanja
													</span>
												</div>
											</div>

											{post._embedded &&
												post._embedded["wp:featuredmedia"] &&
												post._embedded["wp:featuredmedia"][0] && (
													<div className="post-featured-image">
														<img
															src={
																post._embedded["wp:featuredmedia"][0].source_url
															}
															alt={post.title.rendered.replace(
																/<\/?[^>]+(>|$)/g,
																""
															)}
														/>
													</div>
												)}
										</div>

										<div
											className="post-content"
											dangerouslySetInnerHTML={{
												__html: post.content.rendered,
											}}
										/>

										<div className="post-share">
											<h4>Podijelite članak</h4>
											<div className="post-share-buttons">
												<a
													href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
													target="_blank"
													rel="noopener noreferrer"
													className="share-button facebook"
												>
													<Facebook size={18} />
													<span>Facebook</span>
												</a>
												<a
													href={`https://www.instagram.com/`}
													target="_blank"
													rel="noopener noreferrer"
													className="share-button instagram"
												>
													<Instagram size={18} />
													<span>Instagram</span>
												</a>
												<button
													className="share-button share"
													onClick={() =>
														navigator.clipboard.writeText(window.location.href)
													}
												>
													<Share2 size={18} />
													<span>Kopiraj link</span>
												</button>
											</div>
										</div>

										<div className="post-navigation">
											<button
												className={`nav-button prev ${
													!relatedPosts.length ? "disabled" : ""
												}`}
												onClick={() => handleNavigation("prev")}
												disabled={!relatedPosts.length}
											>
												<ArrowLeft size={20} />
												<span>Prethodni članak</span>
											</button>
											<Link to="/blogovi" className="nav-button all">
												<span>Svi članci</span>
											</Link>
											<button
												className={`nav-button next ${
													!relatedPosts.length ? "disabled" : ""
												}`}
												onClick={() => handleNavigation("next")}
												disabled={!relatedPosts.length}
											>
												<span>Sljedeći članak</span>
												<ArrowRight size={20} />
											</button>
										</div>
									</article>
								</div>
							</div>
						</div>

						{relatedPosts.length > 0 && (
							<div className="related-posts-section">
								<div className="container">
									<div className="section-header">
										<h2 className="section-title">Povezani članci</h2>
										<div className="section-line"></div>
									</div>

									<div className="related-posts-grid">
										{relatedPosts.map((relatedPost) => (
											<Link
												to={`/post/${relatedPost.slug}`}
												className="related-post-card"
												key={relatedPost.id}
											>
												<div className="related-post-image">
													<img
														src={getPostImage(relatedPost)}
														alt={relatedPost.title.rendered}
													/>
													<div className="related-post-overlay"></div>
												</div>
												<div className="related-post-content">
													<h3
														className="related-post-title"
														dangerouslySetInnerHTML={{
															__html: relatedPost.title.rendered,
														}}
													/>
													<p className="related-post-excerpt">
														{limitExcerpt(relatedPost.excerpt.rendered)}
													</p>
													<div className="related-post-meta">
														<span className="related-post-date">
															{formatDate(relatedPost.date)}
														</span>
													</div>
												</div>
											</Link>
										))}
									</div>
								</div>
							</div>
						)}

						<div className="post-cta-section">
							<div className="container">
								<div className="post-cta-container">
									<div className="post-cta-content">
										<h2>Želite li saznati više o dječijoj modi?</h2>
										<p>
											Pretplatite se na naš newsletter i budite u toku s
											najnovijim trendovima, savjetima i ekskluzivnim
											sadržajima.
										</p>
									</div>
									<form className="post-cta-form">
										<input
											type="email"
											placeholder="Vaša email adresa"
											required
										/>
										<button type="submit" className="btn btn-primary">
											Pretplatite se
										</button>
									</form>
								</div>
							</div>
						</div>
					</>
				) : null}
			</div>
			<Footer />
		</>
	);
};

export default Post;
