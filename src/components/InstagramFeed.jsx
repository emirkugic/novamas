import React from "react";
import { Instagram } from "lucide-react";
import "./InstagramFeed.css";

const InstagramFeed = () => {
	const instagramImages = [
		"https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=1169&auto=format&fit=crop",
		"https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?q=80&w=1287&auto=format&fit=crop",
		"https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1228&auto=format&fit=crop",
		"https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=1285&auto=format&fit=crop",
		"https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1228&auto=format&fit=crop",
		"https://images.unsplash.com/photo-1626251376234-ad378500148a?q=80&w=1287&auto=format&fit=crop",
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
