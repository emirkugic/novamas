import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import "./Navbar.css";

const Navbar = ({ currentPath }) => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const location = useLocation();

	// Determine if this is the homepage
	const isHomepage = location.pathname === "/" || !location.pathname;

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);

		// Set initial scroll state
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`header ${isScrolled ? "scrolled" : ""} ${
				!isHomepage ? "header-solid" : ""
			}`}
		>
			<div className="container">
				<nav className="navbar">
					<Link to="/" className="logo">
						<img src="/logo.webp" alt="NovamaS" />
					</Link>

					<div className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
						<Link
							to="/blogovi"
							className={`nav-link ${
								location.pathname === "/blogovi" ? "active" : ""
							}`}
						>
							Blogovi
						</Link>
						<Link
							to="/o-nama"
							className={`nav-link ${
								location.pathname === "/o-nama" ? "active" : ""
							}`}
						>
							O nama
						</Link>
						<Link
							to="/kontakt"
							className={`nav-link ${
								location.pathname === "/kontakt" ? "active" : ""
							}`}
						>
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
