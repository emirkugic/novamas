// src/components/SEO.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
	title,
	description,
	image,
	url,
	type = "website",
	publishedTime,
	modifiedTime,
}) => {
	// Default values
	const defaultTitle = "NovamaS - Modna agencija za djecu i mlade";
	const defaultDescription =
		"Ekskluzivni odabir najnovijih kolekcija, trendova i inspiracije za vaše mališane";
	const defaultImage = `${window.location.origin}/SEO_cover.jpg`;
	const siteUrl = window.location.origin;

	// Use provided values or defaults
	const seoTitle = title || defaultTitle;
	const seoDescription = description || defaultDescription;
	const seoImage = image || defaultImage;
	const seoUrl = url || window.location.href;

	// Make sure image URL is absolute
	const absoluteImageUrl = seoImage.startsWith("http")
		? seoImage
		: `${siteUrl}${seoImage.startsWith("/") ? "" : "/"}${seoImage}`;

	// Add a meta tag to signal to our static generator which post this is
	// This will be useful for our static HTML generator script
	const isPostPage = window.location.pathname.startsWith("/post/");
	const postSlug = isPostPage
		? window.location.pathname.split("/post/")[1]
		: "";

	return (
		<Helmet prioritizeSeoTags>
			{/* Basic Meta Tags */}
			<title>{seoTitle}</title>
			<meta name="description" content={seoDescription} />
			<link rel="canonical" href={seoUrl} />

			{/* Post identifier for our static generator */}
			{isPostPage && <meta name="post-slug" content={postSlug} />}

			{/* Open Graph Meta Tags (Facebook, LinkedIn, etc) */}
			<meta property="og:site_name" content="NovamaS" />
			<meta property="og:url" content={seoUrl} />
			<meta property="og:title" content={seoTitle} />
			<meta property="og:description" content={seoDescription} />
			<meta property="og:image" content={absoluteImageUrl} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:type" content={type} />
			{publishedTime && (
				<meta property="article:published_time" content={publishedTime} />
			)}
			{modifiedTime && (
				<meta property="article:modified_time" content={modifiedTime} />
			)}

			{/* Twitter Meta Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={seoTitle} />
			<meta name="twitter:description" content={seoDescription} />
			<meta name="twitter:image" content={absoluteImageUrl} />

			{/* Facebook App ID - Add your own Facebook App ID here if you have one */}
			<meta property="fb:app_id" content="your-facebook-app-id" />
		</Helmet>
	);
};

export default SEO;
