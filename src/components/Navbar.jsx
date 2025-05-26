import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
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
						<Link to="/blogovi" className="nav-link">
							Blogovi
						</Link>
						<Link to="/o-nama" className="nav-link">
							O nama
						</Link>
						<Link to="/kontakt" className="nav-link">
							Kontakt
						</Link>
					</div>

					<div className="nav-right">
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
	);
};

export default Navbar;
