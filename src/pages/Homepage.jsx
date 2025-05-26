import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	Menu,
	X,
	Search,
	Instagram,
	Facebook,
	Twitter,
	ArrowRight,
	ChevronDown,
} from "lucide-react";
import "./Homepage.css";

const Homepage = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [featuredPost, setFeaturedPost] = useState(null);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		// Fetch posts from WordPress backend
		fetch("https://novamasblog.com/wp-json/wp/v2/posts?per_page=7&_embed")
			.then((res) => res.json())
			.then((data) => {
				if (data && data.length > 0) {
					setFeaturedPost(data[0]);
					setPosts(data.slice(1));
				}
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching blog posts:", error);
				setLoading(false);
			});
	}, []);

	const getImageForPost = (post) => {
		// Check for featured image
		if (
			post._embedded &&
			post._embedded["wp:featuredmedia"] &&
			post._embedded["wp:featuredmedia"][0]
		) {
			return post._embedded["wp:featuredmedia"][0].source_url;
		}

		// Otherwise, get first image from content
		const content = post.content?.rendered;
		if (content) {
			const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
			if (imgMatch) {
				return imgMatch[1];
			}
		}

		// Default image if none found
		return "https://images.unsplash.com/photo-1544476915-ed1370594142?q=80&w=1287&auto=format&fit=crop";
	};

	// Limit excerpt text to a specific character count
	const limitExcerpt = (excerpt, limit = 120) => {
		if (!excerpt) return "";

		// Remove HTML tags
		const textOnly = excerpt.replace(/<\/?[^>]+(>|$)/g, "");

		if (textOnly.length <= limit) return excerpt;

		// Find the last space before the limit
		const trimmed = textOnly.substr(0, limit);
		const lastSpace = trimmed.lastIndexOf(" ");

		// Return trimmed text with ellipsis
		return textOnly.substr(0, lastSpace) + "...";
	};

	return (
		<div className="homepage">
			{/* Navigation */}
			<header className={`header ${isScrolled ? "scrolled" : ""}`}>
				<div className="container">
					<nav className="navbar">
						<Link to="/" className="logo">
							<img src="/logo.webp" alt="NovamaS" />
						</Link>

						<div className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
							<Link to="/" className="nav-link">
								Početna
							</Link>
							<Link to="/kategorije" className="nav-link">
								Kategorije <ChevronDown size={16} />
							</Link>
							<Link to="/blogs" className="nav-link">
								Blog
							</Link>
							<Link to="/o-nama" className="nav-link">
								O nama
							</Link>
							<Link to="/kontakt" className="nav-link">
								Kontakt
							</Link>
						</div>

						<div className="nav-right">
							<button className="search-btn" aria-label="Pretraži">
								<Search size={20} />
							</button>
							<button
								className="menu-toggle"
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								aria-label={mobileMenuOpen ? "Zatvori meni" : "Otvori meni"}
							>
								{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
							</button>
						</div>
					</nav>
				</div>
			</header>

			{/* Hero Section */}
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

			{/* Featured Post */}
			{!loading && featuredPost && (
				<section className="featured-post">
					<div className="container">
						<div className="section-header">
							<h2 className="section-title">Najnoviji članak</h2>
							<div className="section-line"></div>
						</div>
						<div className="featured-card">
							<div className="featured-image">
								<img
									src={getImageForPost(featuredPost)}
									alt={featuredPost.title.rendered}
								/>
							</div>
							<div className="featured-content">
								<h3
									className="featured-title"
									dangerouslySetInnerHTML={{
										__html: featuredPost.title.rendered,
									}}
								/>
								<div className="featured-excerpt">
									<p>{limitExcerpt(featuredPost.excerpt.rendered, 180)}</p>
								</div>
								<Link
									to={`/post/${featuredPost.slug}`}
									className="btn btn-text"
								>
									Pročitaj više <ArrowRight size={16} />
								</Link>
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Latest Posts */}
			<section className="latest-posts">
				<div className="container">
					<div className="section-header">
						<h2 className="section-title">Najnoviji članci</h2>
						<div className="section-line"></div>
					</div>

					{loading ? (
						<div className="loading-spinner">
							<div className="spinner"></div>
							<p>Učitavanje...</p>
						</div>
					) : (
						<div className="posts-grid">
							{posts.map((post) => (
								<Link
									to={`/post/${post.slug}`}
									className="post-card"
									key={post.id}
								>
									<div className="post-image">
										<img
											src={getImageForPost(post)}
											alt={post.title.rendered}
										/>
									</div>
									<div className="post-content">
										<h3
											className="post-title"
											dangerouslySetInnerHTML={{ __html: post.title.rendered }}
										/>
										<div className="post-excerpt">
											<p>{limitExcerpt(post.excerpt.rendered, 100)}</p>
										</div>
										<div className="post-meta">
											<span className="post-date">
												{new Date(post.date)
													.toLocaleDateString("bs-BA", {
														day: "2-digit",
														month: "2-digit",
														year: "numeric",
													})
													.replace(/\./g, "/")}
											</span>
											<span className="read-more">
												Pročitaj više <ArrowRight size={14} />
											</span>
										</div>
									</div>
								</Link>
							))}
						</div>
					)}

					<div className="view-all-container">
						<Link to="/blogs" className="btn btn-primary">
							Svi članci
						</Link>
					</div>
				</div>
			</section>

			{/* Znanje za uspjeh Section */}
			<section className="inspiration-section">
				<div className="container">
					<div className="section-header">
						<h2 className="section-title">Znanje za uspjeh</h2>
						<div className="section-line"></div>
					</div>

					<div className="inspiration-grid">
						<div className="inspiration-item">
							<div className="inspiration-icon">
								<img
									src="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1974&auto=format&fit=crop"
									alt="Znanje"
								/>
							</div>
							<h3>Znanje za uspjeh</h3>
							<p>
								U pozitivnom okruženju, igri, prijateljstvu i ljubavi stvaramo
								dobre šanse i mogućnosti da svi zajedno budemo bolji, sretniji i
								zdraviji.
							</p>
						</div>

						<div className="inspiration-item">
							<div className="inspiration-icon">
								<img
									src="https://images.unsplash.com/photo-1519225056414-b7d77258fde9?q=80&w=1974&auto=format&fit=crop"
									alt="Stav"
								/>
							</div>
							<h3>Stav za uspjeh</h3>
							<p>
								Želimo biti moderni u drugom smislu – da su naša djeca zdrava,
								vesela i kreativna, sa znanjem i mogućnostima koje
								predstavljamo.
							</p>
						</div>

						<div className="inspiration-item">
							<div className="inspiration-icon">
								<img
									src="https://images.unsplash.com/photo-1531073149697-2c1945b4fc8e?q=80&w=1974&auto=format&fit=crop"
									alt="Pokret"
								/>
							</div>
							<h3>Pokret za uspjeh</h3>
							<p>
								Djeca zaslužuju najbolje. Kroz naš rad potičemo zdravlje,
								veselje i kreativnost, kao temelje za budućnost.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* NovamaS kroz generacije Section */}
			<section className="fashion-tips-section">
				<div className="container">
					<div className="tips-container">
						<div className="tips-content">
							<h2 className="tips-title">NovamaS kroz generacije</h2>
							<div className="tips-list">
								<div className="tip-item">
									<div className="tip-number">25+</div>
									<div className="tip-text">
										<h3>Godina iskustva</h3>
										<p>
											Modna agencija NovamaS djeluje od 1997. godine.
											Organizovali smo niz prepoznatljivih projekata iz oblasti
											kulture, modne prezentacije za djecu i odrasle.
										</p>
									</div>
								</div>

								<div className="tip-item">
									<div className="tip-number">10+</div>
									<div className="tip-text">
										<h3>Modnih projekata</h3>
										<p>
											BH Fashion Week, Hajde budi mi drug, Baščaršijske noći,
											Kupovina sa razlogom, Proljeće u dječijem domu, Dress to
											impress, i mnogi drugi.
										</p>
									</div>
								</div>

								<div className="tip-item">
									<div className="tip-number">∞</div>
									<div className="tip-text">
										<h3>Inspiracija za mališane</h3>
										<p>
											Ispravlja dječije hodanje, oslobađa djecu straha od javnog
											nastupa, uči ih scenskom pokretu, plesu i lijepom
											ophođenju.
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="tips-image">
							<img
								src="https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=1169&auto=format&fit=crop"
								alt="NovamaS kroz generacije"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Fashion Spotlight Section */}
			<section className="stats-section">
				<div className="container">
					<div className="divonette-container">
						<h2 className="divonette-title">Moda za sve generacije</h2>
						<p className="divonette-text">
							Otkrijte raznovrsne kolekcije odjeće za djevojčice i dječake svih
							uzrasta. Nudimo kombinacije za svakodnevne aktivnosti, školske
							dane ili posebne prilike. U našem asortimanu možete pronaći sve od
							udobnih majica i hlača do elegantnih outfita za svečane događaje.
						</p>
						<div className="divonette-cta">
							<p>
								Posjetite nas i pronađite savršene komade koji će vašim
								mališanima pružiti udobnost i stil.
							</p>
							<button className="btn btn-white">Istraži kolekcije</button>
						</div>
					</div>
				</div>
			</section>

			{/* Instagram Feed */}
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
						{[
							"https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=1169&auto=format&fit=crop",
							"https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?q=80&w=1287&auto=format&fit=crop",
							"https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1228&auto=format&fit=crop",
							"https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=1285&auto=format&fit=crop",
							"https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1228&auto=format&fit=crop",
							"https://images.unsplash.com/photo-1626251376234-ad378500148a?q=80&w=1287&auto=format&fit=crop",
						].map((url, index) => (
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

			{/* Newsletter Section */}
			<section className="newsletter-section">
				<div className="container">
					<div className="newsletter-container">
						<div className="newsletter-content">
							<h2 className="newsletter-title">
								Pridružite se našoj zajednici
							</h2>
							<p className="newsletter-description">
								Pretplatite se na naš newsletter i budite prvi koji će saznati
								za nove trendove, savjete i ekskluzivne sadržaje.
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

			{/* Footer */}
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
									<Link to="/blogs">Blog</Link>
								</li>
								<li>
									<Link to="/o-nama">O nama</Link>
								</li>
								<li>
									<Link to="/kontakt">Kontakt</Link>
								</li>
								<li>
									<Link to="/projekti">Projekti</Link>
								</li>
								<li>
									<Link to="/galerija">Galerija</Link>
								</li>
							</ul>
						</div>

						<div className="footer-contact">
							<h3 className="footer-heading">Kontakt</h3>
							<p>Email: info@novamas.ba</p>
							<p>Telefon: +387 33 123 456</p>
							<p>Adresa: Sarajevo, Bosna i Hercegovina</p>
						</div>
					</div>

					<div className="footer-bottom">
						<p className="copyright">
							&copy; {new Date().getFullYear()} NovamaS. Sva prava zadržana.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Homepage;
