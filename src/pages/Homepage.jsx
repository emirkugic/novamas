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
		fetch("https://novamasblog.com/wp-json/wp/v2/posts?per_page=6&_embed")
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

	const getImageUrl = (post) => {
		if (
			post._embedded &&
			post._embedded["wp:featuredmedia"] &&
			post._embedded["wp:featuredmedia"][0]
		) {
			return post._embedded["wp:featuredmedia"][0].source_url;
		}
		return "https://images.unsplash.com/photo-1544476915-ed1370594142?q=80&w=1287&auto=format&fit=crop";
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
							<h2 className="section-title">Izdvojeni članak</h2>
							<div className="section-line"></div>
						</div>
						<div className="featured-card">
							<div className="featured-image">
								<img
									src={getImageUrl(featuredPost)}
									alt={featuredPost.title.rendered}
								/>
							</div>
							<div className="featured-content">
								<div className="post-category">Novi trend</div>
								<h3
									className="featured-title"
									dangerouslySetInnerHTML={{
										__html: featuredPost.title.rendered,
									}}
								/>
								<div
									className="featured-excerpt"
									dangerouslySetInnerHTML={{
										__html: featuredPost.excerpt.rendered,
									}}
								/>
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
										<img src={getImageUrl(post)} alt={post.title.rendered} />
									</div>
									<div className="post-content">
										<h3
											className="post-title"
											dangerouslySetInnerHTML={{ __html: post.title.rendered }}
										/>
										<div
											className="post-excerpt"
											dangerouslySetInnerHTML={{
												__html: post.excerpt.rendered,
											}}
										/>
										<div className="post-meta">
											<span className="post-date">
												{new Date(post.date).toLocaleDateString("bs-BA", {
													day: "numeric",
													month: "long",
													year: "numeric",
												})}
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

			{/* Categories Section */}
			<section className="categories-section">
				<div className="container">
					<div className="section-header">
						<h2 className="section-title">Kategorije</h2>
						<div className="section-line"></div>
					</div>

					<div className="categories-grid">
						<Link to="/kategorije/modni-trendovi" className="category-card">
							<div className="category-image">
								<img
									src="https://images.unsplash.com/photo-1611042553484-d61f84e2424d?q=80&w=1170&auto=format&fit=crop"
									alt="Modni trendovi"
								/>
							</div>
							<h3 className="category-title">Modni trendovi</h3>
						</Link>

						<Link to="/kategorije/stylish-bebe" className="category-card">
							<div className="category-image">
								<img
									src="https://images.unsplash.com/photo-1540479859555-17af45c78602?q=80&w=1170&auto=format&fit=crop"
									alt="Stylish bebe"
								/>
							</div>
							<h3 className="category-title">Stylish bebe</h3>
						</Link>

						<Link to="/kategorije/djecja-odjeca" className="category-card">
							<div className="category-image">
								<img
									src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1172&auto=format&fit=crop"
									alt="Dječja odjeća"
								/>
							</div>
							<h3 className="category-title">Dječja odjeća</h3>
						</Link>

						<Link to="/kategorije/modna-inspiracija" className="category-card">
							<div className="category-image">
								<img
									src="https://images.unsplash.com/photo-1506919258185-6078bba55d2a?q=80&w=1115&auto=format&fit=crop"
									alt="Modna inspiracija"
								/>
							</div>
							<h3 className="category-title">Modna inspiracija</h3>
						</Link>
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
								href="https://instagram.com/novamas"
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
						href="https://instagram.com/novamas"
						target="_blank"
						rel="noopener noreferrer"
						className="instagram-link"
					>
						<Instagram size={18} />
						<span>@novamas_kids</span>
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
									href="https://facebook.com/novamas"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Facebook size={20} />
								</a>
								<a
									href="https://instagram.com/novamas"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Instagram size={20} />
								</a>
								<a
									href="https://twitter.com/novamas"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Twitter size={20} />
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
									<Link to="/kategorije">Kategorije</Link>
								</li>
								<li>
									<Link to="/o-nama">O nama</Link>
								</li>
								<li>
									<Link to="/kontakt">Kontakt</Link>
								</li>
							</ul>
						</div>

						<div className="footer-categories">
							<h3 className="footer-heading">Kategorije</h3>
							<ul>
								<li>
									<Link to="/kategorije/modni-trendovi">Modni trendovi</Link>
								</li>
								<li>
									<Link to="/kategorije/stylish-bebe">Stylish bebe</Link>
								</li>
								<li>
									<Link to="/kategorije/djecja-odjeca">Dječja odjeća</Link>
								</li>
								<li>
									<Link to="/kategorije/modna-inspiracija">
										Modna inspiracija
									</Link>
								</li>
								<li>
									<Link to="/kategorije/savjeti">Savjeti</Link>
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
