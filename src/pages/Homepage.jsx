import React, { useState, useEffect } from "react";
import "./Homepage.css";

const Homepage = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		// Simulacija učitavanja blogova - kasnije će se povezati sa WordPress API
		setTimeout(() => {
			setPosts([
				{
					id: 1,
					title: "Proljetni trendovi za mališane",
					excerpt:
						"Otkrijte najnovije modne trendove za djecu ove sezone. Šarene boje, udobni materijali i praktični komadi.",
					image:
						"https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800",
					date: "15. maj 2024",
					category: "Moda",
				},
				{
					id: 2,
					title: "Kako fotografisati djecu kao profesionalac",
					excerpt:
						"Savjeti i trikovi za savršene fotografije vaših mališana. Od osvjetljenja do poziranja.",
					image:
						"https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800",
					date: "12. maj 2024",
					category: "Fotografija",
				},
				{
					id: 3,
					title: "Ljetna kolekcija 2024",
					excerpt:
						"Ekskluzivan pregled najnovije ljetne kolekcije. Lagani materijali, veseli printovi i udobnost na prvom mjestu.",
					image:
						"https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800",
					date: "10. maj 2024",
					category: "Kolekcija",
				},
			]);
			setLoading(false);
		}, 1000);
	}, []);

	return (
		<div className="homepage">
			{/* Navigation */}
			<nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
				<div className="nav-container">
					<div className="logo">NovamaS</div>
					<ul className="nav-menu">
						<li>
							<a href="/">Početna</a>
						</li>
						<li>
							<a href="/o-nama">O nama</a>
						</li>
						<li>
							<a href="/modeli">Modeli</a>
						</li>
						<li>
							<a href="/blog">Blog</a>
						</li>
						<li>
							<a href="/kontakt">Kontakt</a>
						</li>
					</ul>
					<div className="menu-toggle">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="hero">
				<div className="hero-image">
					<img src="/cover.jpg" alt="NovamaS Kids Fashion" />
					<div className="hero-overlay"></div>
				</div>
				<div className="hero-content">
					<h1 className="hero-title">NovamaS</h1>
					<p className="hero-subtitle">Gdje moda susreće maštu</p>
					<p className="hero-description">
						Otkrijte svijet dječije mode kroz naš blog. Inspiracija, savjeti i
						najnoviji trendovi za vaše mališane.
					</p>
					<button className="hero-button">Istražite kolekciju</button>
				</div>
			</section>

			{/* Introduction */}
			<section className="intro">
				<div className="container">
					<h2 className="section-title">Dobrodošli u svijet NovamaS</h2>
					<p className="intro-text">
						NovamaS je više od bloga - mi smo zajednica koja slavi dječiju modu,
						kreativnost i bezbrižnost. Pratite nas na putovanju kroz najnovije
						trendove, praktične savjete i inspirativne priče.
					</p>
				</div>
			</section>

			{/* Latest Posts */}
			<section className="latest-posts">
				<div className="container">
					<h2 className="section-title">Najnoviji članci</h2>
					{loading ? (
						<div className="loading">
							<div className="spinner"></div>
							<p>Učitavanje...</p>
						</div>
					) : (
						<div className="posts-grid">
							{posts.map((post) => (
								<article key={post.id} className="post-card">
									<div className="post-image">
										<img src={post.image} alt={post.title} />
										<div className="post-category">{post.category}</div>
									</div>
									<div className="post-content">
										<h3 className="post-title">{post.title}</h3>
										<p className="post-excerpt">{post.excerpt}</p>
										<div className="post-meta">
											<span className="post-date">{post.date}</span>
											<a href={`/post/${post.id}`} className="read-more">
												Pročitaj više →
											</a>
										</div>
									</div>
								</article>
							))}
						</div>
					)}
				</div>
			</section>

			{/* Features */}
			<section className="features">
				<div className="container">
					<h2 className="section-title">Zašto NovamaS?</h2>
					<div className="features-grid">
						<div className="feature">
							<div className="feature-icon">👗</div>
							<h3>Najnoviji trendovi</h3>
							<p>
								Budite u toku sa najnovijim modnim trendovima za djecu iz
								cijelog svijeta.
							</p>
						</div>
						<div className="feature">
							<div className="feature-icon">📸</div>
							<h3>Profesionalne fotografije</h3>
							<p>
								Visokokvalitetne fotografije koje inspirišu i pokazuju modu u
								najljepšem svjetlu.
							</p>
						</div>
						<div className="feature">
							<div className="feature-icon">💡</div>
							<h3>Korisni savjeti</h3>
							<p>
								Praktični savjeti za roditelje o odijevanju, kombinovanju i
								održavanju garderobe.
							</p>
						</div>
						<div className="feature">
							<div className="feature-icon">🌈</div>
							<h3>Kreativnost i mašta</h3>
							<p>
								Podsticanje dječije kreativnosti kroz modu i samopouzdano
								izražavanje.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Instagram Feed */}
			<section className="instagram">
				<div className="container">
					<h2 className="section-title">Pratite nas na Instagramu</h2>
					<div className="instagram-grid">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div key={i} className="instagram-item">
								<img
									src={`https://images.unsplash.com/photo-${
										1500000000000 + i * 1000
									}?w=400&h=400&fit=crop`}
									alt={`Instagram ${i}`}
								/>
								<div className="instagram-overlay">
									<span>❤️ {Math.floor(Math.random() * 500) + 100}</span>
								</div>
							</div>
						))}
					</div>
					<a href="https://instagram.com/novamas" className="instagram-link">
						@novamas_kids
					</a>
				</div>
			</section>

			{/* Newsletter */}
			<section className="newsletter">
				<div className="container">
					<div className="newsletter-content">
						<h2>Prijavite se na naš newsletter</h2>
						<p>
							Budite prvi koji će saznati za nove kolekcije, ekskluzivne ponude
							i modne savjete.
						</p>
						<div className="newsletter-form">
							<input type="email" placeholder="Vaša email adresa" required />
							<button type="button">Prijavite se</button>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="footer">
				<div className="container">
					<div className="footer-content">
						<div className="footer-section">
							<h3>NovamaS</h3>
							<p>
								Gdje moda susreće maštu. Vaš pouzdani izvor za dječiju modu i
								inspiraciju.
							</p>
							<div className="social-links">
								<a href="#" aria-label="Facebook">
									f
								</a>
								<a href="#" aria-label="Instagram">
									i
								</a>
								<a href="#" aria-label="Pinterest">
									p
								</a>
							</div>
						</div>
						<div className="footer-section">
							<h4>Brzi linkovi</h4>
							<ul>
								<li>
									<a href="/o-nama">O nama</a>
								</li>
								<li>
									<a href="/modeli">Naši modeli</a>
								</li>
								<li>
									<a href="/blog">Blog</a>
								</li>
								<li>
									<a href="/kontakt">Kontakt</a>
								</li>
							</ul>
						</div>
						<div className="footer-section">
							<h4>Kategorije</h4>
							<ul>
								<li>
									<a href="/kategorija/moda">Moda</a>
								</li>
								<li>
									<a href="/kategorija/savjeti">Savjeti</a>
								</li>
								<li>
									<a href="/kategorija/kolekcije">Kolekcije</a>
								</li>
								<li>
									<a href="/kategorija/trendovi">Trendovi</a>
								</li>
							</ul>
						</div>
						<div className="footer-section">
							<h4>Kontakt</h4>
							<p>Email: info@novamas.ba</p>
							<p>Telefon: +387 33 123 456</p>
							<p>Adresa: Sarajevo, BiH</p>
						</div>
					</div>
					<div className="footer-bottom">
						<p>&copy; 2024 NovamaS. Sva prava zadržana.</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Homepage;
