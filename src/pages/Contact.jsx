import React, { useState, useRef } from "react";
import {
	Phone,
	Mail,
	MapPin,
	Facebook,
	Instagram,
	Send,
	Clock,
	User,
	MessageSquare,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Contact.css";
import "../global.css";

const Contact = () => {
	const form = useRef();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const [formErrors, setFormErrors] = useState({});
	const [formSubmitted, setFormSubmitted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		// Clear error when user starts typing
		if (formErrors[name]) {
			setFormErrors({
				...formErrors,
				[name]: "",
			});
		}
	};

	const validateForm = () => {
		let errors = {};
		let isValid = true;

		if (!formData.name.trim()) {
			errors.name = "Molimo unesite vaše ime";
			isValid = false;
		}

		if (!formData.email.trim()) {
			errors.email = "Molimo unesite vašu email adresu";
			isValid = false;
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			errors.email = "Email adresa nije validna";
			isValid = false;
		}

		if (!formData.subject.trim()) {
			errors.subject = "Molimo unesite predmet poruke";
			isValid = false;
		}

		if (!formData.message.trim()) {
			errors.message = "Molimo unesite vašu poruku";
			isValid = false;
		}

		setFormErrors(errors);
		return isValid;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (validateForm()) {
			setIsSubmitting(true);

			// EmailJS configuration
			// Replace these with your actual EmailJS service ID, template ID, and public key
			const serviceId = "YOUR_EMAILJS_SERVICE_ID";
			const templateId = "YOUR_EMAILJS_TEMPLATE_ID";
			const publicKey = "YOUR_EMAILJS_PUBLIC_KEY";

			emailjs.sendForm(serviceId, templateId, form.current, publicKey).then(
				(result) => {
					console.log("Email successfully sent!", result.text);
					setFormSubmitted(true);
					setIsSubmitting(false);

					// Reset form
					setFormData({
						name: "",
						email: "",
						subject: "",
						message: "",
					});

					// Hide success message after 5 seconds
					setTimeout(() => {
						setFormSubmitted(false);
					}, 5000);
				},
				(error) => {
					console.error("Failed to send email:", error.text);
					setIsSubmitting(false);
					alert(
						"Došlo je do greške prilikom slanja poruke. Molimo pokušajte ponovo ili nas kontaktirajte direktno putem telefona ili emaila."
					);
				}
			);
		}
	};

	return (
		<>
			<Navbar />
			<div className="contact-page">
				<div className="contact-hero">
					<div className="container">
						<div className="contact-hero-content">
							<h1>Kontakt</h1>
							<div className="hero-line"></div>
							<p>
								Javite nam se s pitanjima, prijedlozima ili kako biste
								rezervirali termin
							</p>
						</div>
					</div>
				</div>

				<div className="contact-section">
					<div className="container">
						<div className="contact-grid">
							<div className="contact-info">
								<h2>Povežimo se</h2>
								<p className="contact-intro">
									Želite li saznati više o našim aktivnostima, prijaviti svoje
									dijete u našu modnu agenciju ili jednostavno postaviti
									pitanje? Tu smo za vas! Kontaktirajte nas putem bilo kojeg od
									navedenih kanala ili ispunite kontakt obrazac.
								</p>

								<div className="contact-card">
									<div className="contact-card-inner">
										<div className="contact-methods">
											<div className="contact-method">
												<div className="contact-icon">
													<Phone size={24} />
												</div>
												<div className="contact-details">
													<h3>Telefon</h3>
													<p>
														<a href="tel:+38762855525">+387 62 855 525</a>
													</p>
												</div>
											</div>

											<div className="contact-method">
												<div className="contact-icon">
													<Mail size={24} />
												</div>
												<div className="contact-details">
													<h3>Email</h3>
													<p>
														<a href="mailto:alma.musliovic@gmail.com">
															alma.musliovic@gmail.com
														</a>
													</p>
												</div>
											</div>

											<div className="contact-method">
												<div className="contact-icon">
													<MapPin size={24} />
												</div>
												<div className="contact-details">
													<h3>Adresa</h3>
													<p>Sarajevo, Bosna i Hercegovina</p>
												</div>
											</div>
										</div>

										<div className="contact-socials">
											<h3>Pratite nas</h3>
											<div className="social-buttons">
												<a
													href="https://www.facebook.com/p/Nova-maS-models-100057067287274/"
													target="_blank"
													rel="noopener noreferrer"
													className="social-button facebook"
												>
													<Facebook size={20} />
													<span>Facebook</span>
												</a>
												<a
													href="https://www.instagram.com/novamas_models/"
													target="_blank"
													rel="noopener noreferrer"
													className="social-button instagram"
												>
													<Instagram size={20} />
													<span>Instagram</span>
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="contact-form-container">
								<h2>Pošaljite nam poruku</h2>
								<p className="form-intro">
									Ispunite obrazac i javit ćemo vam se u najkraćem mogućem roku.
								</p>

								{formSubmitted && (
									<div className="form-success">
										<div className="success-icon">
											<Send size={24} />
										</div>
										<div className="success-message">
											<h3>Poruka uspješno poslana!</h3>
											<p>
												Hvala na vašoj poruci. Odgovorit ćemo vam u najkraćem
												mogućem roku.
											</p>
										</div>
									</div>
								)}

								<form
									className="contact-form"
									ref={form}
									onSubmit={handleSubmit}
								>
									<div className="form-group">
										<label htmlFor="name">
											<User size={16} />
											<span>Ime i prezime</span>
										</label>
										<input
											type="text"
											id="name"
											name="name"
											value={formData.name}
											onChange={handleChange}
											placeholder="Vaše ime i prezime"
											className={formErrors.name ? "input-error" : ""}
										/>
										{formErrors.name && (
											<div className="error-message">{formErrors.name}</div>
										)}
									</div>

									<div className="form-group">
										<label htmlFor="email">
											<Mail size={16} />
											<span>Email adresa</span>
										</label>
										<input
											type="email"
											id="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											placeholder="Vaša email adresa"
											className={formErrors.email ? "input-error" : ""}
										/>
										{formErrors.email && (
											<div className="error-message">{formErrors.email}</div>
										)}
									</div>

									<div className="form-group">
										<label htmlFor="subject">
											<MessageSquare size={16} />
											<span>Predmet</span>
										</label>
										<input
											type="text"
											id="subject"
											name="subject"
											value={formData.subject}
											onChange={handleChange}
											placeholder="Predmet vaše poruke"
											className={formErrors.subject ? "input-error" : ""}
										/>
										{formErrors.subject && (
											<div className="error-message">{formErrors.subject}</div>
										)}
									</div>

									<div className="form-group">
										<label htmlFor="message">
											<MessageSquare size={16} />
											<span>Poruka</span>
										</label>
										<textarea
											id="message"
											name="message"
											value={formData.message}
											onChange={handleChange}
											placeholder="Vaša poruka"
											rows="6"
											className={formErrors.message ? "input-error" : ""}
										></textarea>
										{formErrors.message && (
											<div className="error-message">{formErrors.message}</div>
										)}
									</div>

									<button
										type="submit"
										className={`btn btn-primary submit-button ${
											isSubmitting ? "submitting" : ""
										}`}
										disabled={isSubmitting}
									>
										{isSubmitting ? (
											<>
												<div className="button-spinner"></div>
												<span>Slanje...</span>
											</>
										) : (
											<>
												<Send size={18} />
												<span>Pošalji poruku</span>
											</>
										)}
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>

				<div className="contact-cta">
					<div className="container">
						<div className="cta-box">
							<h2>Pripremite svoje dijete za uspjeh</h2>
							<p>
								Kroz naše programe, djeca razvijaju samopouzdanje, držanje i
								scenski nastup - vještine koje će im koristiti cijeli život.
							</p>
							<div className="cta-buttons">
								<a href="tel:+38762855525" className="btn btn-white">
									<Phone size={18} />
									<span>Nazovite nas</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default Contact;
