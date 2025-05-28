// src/components/SEOImage.jsx
import React from "react";

const SEOImage = () => {
	const domain = process.env.REACT_APP_DOMAIN || window.location.origin;

	return (
		<div style={{ display: "none" }}>
			<img src={`${domain}/SEO_cover.jpg`} alt="NovamaS SEO" />
		</div>
	);
};

export default SEOImage;
