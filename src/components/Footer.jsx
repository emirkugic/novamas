import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";
import "./Footer.css";

const Footer = () => {
	return (
		<footer className="footer">
			<div className="container">
				<div className="footer-grid">
					<div className="footer-about">
						<Link to="/" className="footer-logo">
							<img src="/logo.webp" alt="NovamaS" />
						</Link>
						<p className="footer-description">
							NovamaS je premium destinacija za dječiju modu i modne savjete.
							Otkrijte najnovije trendove, kolekcije i inspiraciju za vaše
							mališane.
						</p>
						<div className="social-links">
							<a
								href="https://www.facebook.com/p/Nova-maS-models-100057067287274/"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Facebook size={20} />
							</a>
							<a
								href="https://www.instagram.com/novamas_models/"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Instagram size={20} />
							</a>
						</div>
					</div>

					<div className="footer-links">
						<h3 className="footer-heading">Brzi linkovi</h3>
						<ul>
							<li>
								<Link to="/">Početna</Link>
							</li>
							<li>
								<Link to="/blogovi">Blog</Link>
							</li>
							<li>
								<Link to="/o-nama">O nama</Link>
							</li>
							<li>
								<Link to="/kontakt">Kontakt</Link>
							</li>
						</ul>
					</div>

					<div className="footer-contact">
						<h3 className="footer-heading">Kontakt</h3>
						<p>Email: alma.musliovic@gmail.com</p>
						<p>Telefon: +387 62 855 525</p>
						<p>Adresa: Sarajevo, Bosna i Hercegovina</p>
					</div>
				</div>

				<div className="footer-bottom">
					<p className="copyright">
						&copy; {new Date().getFullYear()} NovamaS. Sva prava zadržana. |
						Pravio{" "}
						<a
							href="https://araneum.ba"
							target="_blank"
							rel="noopener noreferrer"
						>
							Emir Kugić
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
