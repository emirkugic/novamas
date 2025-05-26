import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
	return (
		<section className="hero">
			<div className="hero-image">
				<img src="/cover.jpg" alt="NovamaS dječija moda" />
			</div>
			<div className="container">
				<div className="hero-content">
					<h1>
						<span className="hero-brand">NovamaS</span>
						<span className="hero-tagline">Svijet dječije mode</span>
					</h1>
					<p className="hero-description">
						Ekskluzivni odabir najnovijih kolekcija, trendova i inspiracije za
						vaše mališane
					</p>
					<div className="hero-buttons">
						<Link to="/blogs" className="btn btn-primary">
							Istraži blog
						</Link>
						<Link to="/kategorije" className="btn btn-outline">
							Kategorije
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
