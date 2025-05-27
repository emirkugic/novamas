import React from "react";
import { Instagram } from "lucide-react";
import "./InstagramFeed.css";

const InstagramFeed = () => {
	const instagramImages = [
		"/instagram1.jpg",
		"/instagram2.jpg",
		"/instagram3.jpg",
		"/instagram4.jpg",
		"/instagram5.jpg",
		"/instagram6.jpg",
	];

	return (
		<section className="instagram-section">
			<div className="container">
				<div className="section-header instagram-header">
					<h2 className="section-title">Instagram</h2>
					<div className="section-line"></div>
					<p className="instagram-tagline">
						Pratite nas za više modne inspiracije
					</p>
				</div>

				<div className="instagram-grid">
					{instagramImages.map((url, index) => (
						<a
							href="https://www.instagram.com/novamas_models/"
							target="_blank"
							rel="noopener noreferrer"
							className="instagram-item"
							key={index}
						>
							<img src={url} alt={`Instagram ${index + 1}`} />
							<div className="instagram-overlay">
								<Instagram size={24} />
							</div>
						</a>
					))}
				</div>

				<a
					href="https://www.instagram.com/novamas_models/"
					target="_blank"
					rel="noopener noreferrer"
					className="instagram-link"
				>
					<Instagram size={18} />
					<span>@novamas_models</span>
				</a>
			</div>
		</section>
	);
};

export default InstagramFeed;
