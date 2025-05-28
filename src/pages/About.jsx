// src/pages/About.jsx
import React from "react";
import { Camera, Calendar, Heart, Star, Users, Award } from "lucide-react";
import SEO from "../components/SEO"; // Import SEO component
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Newsletter from "../components/Newsletter";
import "./About.css";
import "../global.css";

const About = () => {
	return (
		<>
			<SEO
				title="O nama - NovamaS Modna Agencija"
				description="Upoznajte NovamaS - Vašeg pouzdanog partnera u svijetu dječije mode već preko 25 godina. Otkrijte našu misiju, vrijednosti i projekte."
			/>

			<Navbar />
			<div className="about-page">
				<div className="about-hero">
					<div className="container">
						<div className="about-hero-content">
							<h1>O nama</h1>
							<div className="hero-line"></div>
							<p>
								Upoznajte NovamaS - Vašeg pouzdanog partnera u svijetu dječije
								mode već preko 25 godina
							</p>
						</div>
					</div>
				</div>

				<div className="about-section">
					<div className="container">
						<div className="about-intro">
							<div className="about-intro-content">
								<h2>Modna agencija sa tradicijom</h2>
								<p>
									NovamaS je nastao iz ljubavi prema djeci i modi, s misijom da
									inspirira i razvija samopouzdanje najmlađih kroz kreativno
									izražavanje. Već više od 25 godina, naša modna agencija
									njeguje talente djece i mladih, pomažući im da razviju
									samopouzdanje, držanje i scenski nastup.
								</p>
								<p>
									Počeli smo skromno, ali s velikom vizijom - stvoriti mjesto
									gdje će se djeca osjećati sigurno, gdje će moći razvijati
									svoje talente i gdje će moda biti više od odjeće - bit će
									način izražavanja i razvoja osobnosti.
								</p>
							</div>
							<div className="about-intro-image">
								<img src="/o-nama1.jpg" alt="NovamaS dječija moda" />
							</div>
						</div>
					</div>
				</div>

				{/* Rest of the component remains the same */}
				<div className="about-values">
					<div className="container">
						<div className="section-header">
							<h2 className="section-title">Naše vrijednosti</h2>
							<div className="section-line"></div>
						</div>
						<div className="values-grid">
							<div className="value-card">
								<div className="value-icon">
									<Heart size={32} />
								</div>
								<h3>Ljubav prema djeci</h3>
								<p>
									Briga o dobrobiti i zdravom razvoju djece je u srcu svega što
									radimo. Stvaramo sigurno i poticajno okruženje u kojem se
									svako dijete osjeća prihvaćeno.
								</p>
							</div>

							<div className="value-card">
								<div className="value-icon">
									<Star size={32} />
								</div>
								<h3>Kreativnost</h3>
								<p>
									Potičemo kreativno izražavanje i jedinstvenost svakog djeteta,
									vjerujući da moda može biti snažan alat za izgradnju
									samopouzdanja i identiteta.
								</p>
							</div>

							<div className="value-card">
								<div className="value-icon">
									<Users size={32} />
								</div>
								<h3>Zajednica</h3>
								<p>
									Gradimo povezanu zajednicu djece, roditelja i mentora koji
									zajedno stvaraju nezaboravna iskustva i podržavaju međusobni
									razvoj.
								</p>
							</div>

							<div className="value-card">
								<div className="value-icon">
									<Award size={32} />
								</div>
								<h3>Profesionalnost</h3>
								<p>
									Posvećeni smo najvišim standardima u radu s djecom, pružajući
									im profesionalno vodstvo koje im pomaže da izgrade vještine za
									cijeli život.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="about-team">
					<div className="container">
						<div className="section-header">
							<h2 className="section-title">Naš tim</h2>
							<div className="section-line"></div>
						</div>
						<div className="team-content">
							<div className="team-image">
								<img src="/o-nama2.webp" alt="NovamaS tim" />
							</div>
							<div className="team-description">
								<p>
									Iza NovamaS-a stoji stručni tim modnih profesionalaca,
									pedagoga i kreativaca koji s ljubavlju i predanošću rade s
									djecom svih uzrasta. Naš tim kombinira dugogodišnje iskustvo i
									moderan pristup, stvarajući jedinstveni program koji djeci
									pruža ne samo modne vještine, već i životne lekcije o
									samopouzdanju, timskom radu i kreativnom izražavanju.
								</p>
								<p>
									Vjerujemo da svako dijete ima jedinstveni potencijal koji
									zaslužuje biti prepoznat i njegovan. Naša misija je otkriti
									taj potencijal i pomoći mu da zablista u punom sjaju.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="about-achievements">
					<div className="container">
						<div className="section-header">
							<h2 className="section-title">Naši projekti</h2>
							<div className="section-line"></div>
						</div>
						<div className="achievements-grid">
							<div className="achievement-card">
								<div className="achievement-icon">
									<Camera size={24} />
								</div>
								<h3>BH Fashion Week</h3>
								<p>
									Ponosni smo organizatori dječijeg programa na BH Fashion
									Week-u, gdje naši mladi modeli predstavljaju najnovije
									trendove u dječijoj modi.
								</p>
							</div>

							<div className="achievement-card">
								<div className="achievement-icon">
									<Heart size={24} />
								</div>
								<h3>Hajde budi mi drug</h3>
								<p>
									Humanitarni projekat koji povezuje djecu različitih pozadina
									kroz modu i kreativnost, promovirajući inkluziju i
									prijateljstvo.
								</p>
							</div>

							<div className="achievement-card">
								<div className="achievement-icon">
									<Calendar size={24} />
								</div>
								<h3>Baščaršijske noći</h3>
								<p>
									Tradicionalno učestvujemo u ovoj kulturnoj manifestaciji,
									predstavljajući modne revije koje spajaju tradiciju i moderne
									trendove.
								</p>
							</div>

							<div className="achievement-card">
								<div className="achievement-icon">
									<Award size={24} />
								</div>
								<h3>Dress to impress</h3>
								<p>
									Edukativni program za tinejdžere koji kroz modu uče o
									profesionalnom predstavljanju i izgradnji osobnog stila.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="about-benefits">
					<div className="container">
						<div className="benefits-content">
							<h2>Šta djeca dobijaju kod nas?</h2>
							<ul className="benefits-list">
								<li>
									<span className="benefit-check">✓</span>
									<div className="benefit-text">
										<h4>Pravilno držanje i hod</h4>
										<p>
											Ispravlja dječije hodanje, držanje tijela i pomaže razvoju
											motoričkih vještina
										</p>
									</div>
								</li>
								<li>
									<span className="benefit-check">✓</span>
									<div className="benefit-text">
										<h4>Samopouzdanje</h4>
										<p>
											Oslobađa djecu straha od javnog nastupa i pomaže im da
											razviju samopouzdanje
										</p>
									</div>
								</li>
								<li>
									<span className="benefit-check">✓</span>
									<div className="benefit-text">
										<h4>Scenski pokret</h4>
										<p>
											Uči djecu scenskom pokretu i elegantnom predstavljanju
											pred publikom
										</p>
									</div>
								</li>
								<li>
									<span className="benefit-check">✓</span>
									<div className="benefit-text">
										<h4>Timski rad</h4>
										<p>
											Razvija sposobnost rada u grupi, poštovanje i podršku
											prema drugima
										</p>
									</div>
								</li>
								<li>
									<span className="benefit-check">✓</span>
									<div className="benefit-text">
										<h4>Kreativno izražavanje</h4>
										<p>
											Potiče kreativnost i vlastiti izraz kroz modu, pokret i
											nastup
										</p>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="about-cta">
					<div className="container">
						<div className="cta-content">
							<h2>Postanite dio NovamaS porodice</h2>
							<p>
								Pozivamo vas da se pridružite našoj zajednici i otkrijete sve
								što NovamaS može ponuditi vašem djetetu. Bez obzira da li vaše
								dijete sanja o modnim pistama ili jednostavno želi steći
								samopouzdanje i nove prijatelje, kod nas će pronaći sigurno i
								inspirativno okruženje za rast.
							</p>
							<div className="cta-buttons">
								<a href="/kontakt" className="btn btn-primary">
									Kontaktirajte nas
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Newsletter />
			<Footer />
		</>
	);
};

export default About;
