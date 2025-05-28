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

	return (
		<Helmet>
			{/* Basic Meta Tags */}
			<title>{seoTitle}</title>
			<meta name="description" content={seoDescription} />
			<link rel="canonical" href={seoUrl} />

			{/* Open Graph Meta Tags (Facebook, LinkedIn, etc) */}
			<meta property="og:site_name" content="NovamaS" />
			<meta property="og:url" content={seoUrl} />
			<meta property="og:title" content={seoTitle} />
			<meta property="og:description" content={seoDescription} />
			<meta property="og:image" content={seoImage} />
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
			<meta name="twitter:image" content={seoImage} />
		</Helmet>
	);
};

export default SEO;
