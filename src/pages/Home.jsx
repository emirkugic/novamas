import React, { useState, useEffect } from "react";
import "./Homepage.css";

const Homepage = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await fetch(
					"https://novamasblog.com/wp-json/wp/v2/posts?_embed&per_page=6"
				);
				if (!response.ok) {
					throw new Error("Mrežni odgovor nije bio u redu");
				}
				const data = await response.json();
				setPosts(data);
				setLoading(false);
			} catch (error) {
				setError("Nije moguće učitati objave: " + error.message);
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	return (
		<div className="homepage-container">
			<header className="header">
				<div className="header-content">
					<h1 className="logo">NovamaS</h1>
					<nav className="main-nav">
						<ul>
							<li>
								<a href="/">Početna</a>
							</li>
							<li>
								<a href="/o-nama">O Nama</a>
							</li>
							<li>
								<a href="/modeli">Naši Modeli</a>
							</li>
							<li>
								<a href="/galerija">Galerija</a>
							</li>
							<li>
								<a href="/blog">Blog</a>
							</li>
							<li>
								<a href="/kontakt">Kontakt</a>
							</li>
						</ul>
					</nav>
				</div>
			</header>

			<section className="hero-section">
				<div className="hero-content">
					<h2>Dobrodošli u NovamaS</h2>
					<h3>Dječija i tinejdžerska modelna agencija</h3>
					<p>Otkrijte zvijezdu u vašem djetetu</p>
					<button className="cta-button">Saznaj Više</button>
				</div>
			</section>

			<section className="about-section">
				<div className="about-content">
					<h2>O Našoj Agenciji</h2>
					<p>
						NovamaS je vodeća agencija za dječije i tinejdžerske modele u Bosni
						i Hercegovini. Mi otkrivamo i razvijamo talente od 3 do 18 godina,
						stvarajući prilike za modne revije, reklamne kampanje i medijske
						nastupe.
					</p>
					<div className="stats-container">
						<div className="stat-box">
							<h3>500+</h3>
							<p>Modela</p>
						</div>
						<div className="stat-box">
							<h3>250+</h3>
							<p>Zadovoljnih klijenata</p>
						</div>
						<div className="stat-box">
							<h3>100+</h3>
							<p>Modnih revija</p>
						</div>
					</div>
				</div>
			</section>

			<section className="services-section">
				<h2>Naše Usluge</h2>
				<div className="services-grid">
					<div className="service-card">
						<img
							src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
							alt="Modne revije"
						/>
						<h3>Modne Revije</h3>
						<p>Profesionalne modne revije za vodeće brendove i dizajnere.</p>
					</div>
					<div className="service-card">
						<img
							src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
							alt="Fotografisanje"
						/>
						<h3>Fotografisanje</h3>
						<p>
							Profesionalno fotografisanje za kataloge, reklame i portfolio.
						</p>
					</div>
					<div className="service-card">
						<img
							src="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
							alt="TV Reklame"
						/>
						<h3>TV Reklame</h3>
						<p>Prilike za nastupe u televizijskim i online reklamama.</p>
					</div>
					<div className="service-card">
						<img
							src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
							alt="Obuka"
						/>
						<h3>Obuka</h3>
						<p>
							Profesionalna obuka za modno hodanje, poziranje i samopouzdanje.
						</p>
					</div>
				</div>
			</section>

			<section className="models-section">
				<h2>Istaknuti Modeli</h2>
				<div className="models-grid">
					<div className="model-card">
						<img
							src="https://images.unsplash.com/photo-1618142081758-8ef99201f5d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
							alt="Model 1"
						/>
						<h3>Amina H.</h3>
						<p>14 godina</p>
					</div>
					<div className="model-card">
						<img
							src="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
							alt="Model 2"
						/>
						<h3>Tarik M.</h3>
						<p>12 godina</p>
					</div>
					<div className="model-card">
						<img
							src="https://images.unsplash.com/photo-1628610580109-a2f90e8e63d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
							alt="Model 3"
						/>
						<h3>Emina S.</h3>
						<p>15 godina</p>
					</div>
					<div className="model-card">
						<img
							src="https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
							alt="Model 4"
						/>
						<h3>Dino K.</h3>
						<p>9 godina</p>
					</div>
				</div>
			</section>

			<section className="blog-section">
				<h2>Novosti i Blog</h2>
				{loading ? (
					<p>Učitavanje...</p>
				) : error ? (
					<p>{error}</p>
				) : (
					<div className="blog-grid">
						{posts.map((post) => (
							<div className="blog-card" key={post.id}>
								<div className="blog-image">
									{post._embedded && post._embedded["wp:featuredmedia"] ? (
										<img
											src={post._embedded["wp:featuredmedia"][0].source_url}
											alt={post.title.rendered}
										/>
									) : (
										<img
											src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
											alt={post.title.rendered}
										/>
									)}
								</div>
								<div className="blog-content">
									<h3
										dangerouslySetInnerHTML={{ __html: post.title.rendered }}
									/>
									<div
										className="blog-excerpt"
										dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
									/>
									<a href={`/blog/${post.slug}`} className="read-more">
										Pročitaj više
									</a>
								</div>
							</div>
						))}
					</div>
				)}
				<div className="blog-cta">
					<a href="/blog" className="view-all-button">
						Pogledaj sve članke
					</a>
				</div>
			</section>

			<section className="testimonials-section">
				<h2>Šta Kažu Naši Klijenti</h2>
				<div className="testimonials-container">
					<div className="testimonial">
						<div className="testimonial-text">
							<p>
								"NovamaS je pružio našoj kćerki nevjerovatne prilike da razvije
								samopouzdanje i uživa u modelingu. Profesionalan tim koji brine
								o djeci!"
							</p>
						</div>
						<div className="testimonial-author">
							<img
								src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60"
								alt="Amina Hodžić"
							/>
							<div>
								<h4>Amina Hodžić</h4>
								<p>Majka modela</p>
							</div>
						</div>
					</div>

					<div className="testimonial">
						<div className="testimonial-text">
							<p>
								"Sarađujemo sa NovamaS agencijom već tri godine i uvijek
								dostavljaju profesionalne i pouzdane mlade modele za naše
								kampanje."
							</p>
						</div>
						<div className="testimonial-author">
							<img
								src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60"
								alt="Emir Begić"
							/>
							<div>
								<h4>Emir Begić</h4>
								<p>Marketing direktor, Modna Kuća Sara</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="contact-section">
				<div className="contact-content">
					<h2>Kontaktirajte Nas</h2>
					<p>
						Želite li saznati više o našim uslugama ili prijaviti svoje dijete?
					</p>
					<form className="contact-form">
						<div className="form-group">
							<input type="text" placeholder="Ime i prezime" required />
						</div>
						<div className="form-group">
							<input type="email" placeholder="Email adresa" required />
						</div>
						<div className="form-group">
							<input type="tel" placeholder="Telefon" />
						</div>
						<div className="form-group">
							<textarea placeholder="Vaša poruka" rows="4" required></textarea>
						</div>
						<button type="submit" className="submit-button">
							Pošalji Poruku
						</button>
					</form>
				</div>
				<div className="contact-info">
					<h3>Informacije</h3>
					<p>
						<strong>Adresa:</strong> Zmaja od Bosne 45, Sarajevo
					</p>
					<p>
						<strong>Telefon:</strong> +387 33 123 456
					</p>
					<p>
						<strong>Email:</strong> info@novamas.ba
					</p>
					<p>
						<strong>Radno vrijeme:</strong> Pon-Pet: 9:00 - 17:00
					</p>
					<div className="social-links">
						<a href="https://facebook.com" className="social-icon">
							Facebook
						</a>
						<a href="https://instagram.com" className="social-icon">
							Instagram
						</a>
						<a href="https://tiktok.com" className="social-icon">
							TikTok
						</a>
					</div>
				</div>
			</section>

			<footer className="footer">
				<div className="footer-content">
					<div className="footer-logo">
						<h2>NovamaS</h2>
						<p>Dječija i tinejdžerska modelna agencija</p>
					</div>
					<div className="footer-links">
						<h3>Brzi Linkovi</h3>
						<ul>
							<li>
								<a href="/">Početna</a>
							</li>
							<li>
								<a href="/o-nama">O Nama</a>
							</li>
							<li>
								<a href="/modeli">Naši Modeli</a>
							</li>
							<li>
								<a href="/galerija">Galerija</a>
							</li>
							<li>
								<a href="/blog">Blog</a>
							</li>
							<li>
								<a href="/kontakt">Kontakt</a>
							</li>
						</ul>
					</div>
					<div className="footer-newsletter">
						<h3>Pretplatite se na Newsletter</h3>
						<p>Ostanite u toku s našim novostima</p>
						<div className="newsletter-form">
							<input type="email" placeholder="Vaša email adresa" />
							<button type="submit">Pretplati se</button>
						</div>
					</div>
				</div>
				<div className="footer-bottom">
					<p>&copy; {new Date().getFullYear()} NovamaS. Sva prava zadržana.</p>
				</div>
			</footer>
		</div>
	);
};

export default Homepage;
