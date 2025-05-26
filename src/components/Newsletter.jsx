import React from "react";
import "./Newsletter.css";

const Newsletter = () => {
	return (
		<section className="newsletter-section">
			<div className="container">
				<div className="newsletter-container">
					<div className="newsletter-content">
						<h2 className="newsletter-title">Pridružite se našoj zajednici</h2>
						<p className="newsletter-description">
							Pretplatite se na naš newsletter i budite prvi koji će saznati za
							nove trendove, savjete i ekskluzivne sadržaje.
						</p>
					</div>

					<form className="newsletter-form">
						<input
							type="email"
							placeholder="Unesite vašu email adresu"
							className="newsletter-input"
							required
						/>
						<button type="submit" className="btn btn-primary">
							Pretplatite se
						</button>
					</form>
				</div>
			</div>
		</section>
	);
};

export default Newsletter;
