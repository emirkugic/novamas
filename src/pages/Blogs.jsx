// src/pages/Blogs.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
	Search,
	Filter,
	Calendar,
	X,
	ArrowRight,
	ChevronLeft,
	ChevronRight,
	BookOpen,
} from "lucide-react";
import SEO from "../components/SEO"; // Import SEO component
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Blogs.css";
import "../global.css";

const Blogs = () => {
	const [posts, setPosts] = useState([]);
	const [filteredPosts, setFilteredPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortOption, setSortOption] = useState("newest");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const postsPerPage = 9;
	const location = useLocation();

	// Fetch posts and categories from WordPress
	useEffect(() => {
		setLoading(true);

		// Fetch posts
		fetch(
			"https://api.novamas.ba/wp-json/wp/v2/posts?orderby=date&order=desc&_embed&per_page=100"
		)
			.then((res) => res.json())
			.then((data) => {
				setPosts(data);
				setFilteredPosts(data);
				setTotalPages(Math.ceil(data.length / postsPerPage));

				// Fetch categories
				fetch("https://api.novamas.ba/wp-json/wp/v2/categories")
					.then((res) => res.json())
					.then((categoriesData) => {
						setCategories(categoriesData);
						setLoading(false);
					})
					.catch((error) => {
						console.error("Error fetching categories:", error);
						setLoading(false);
					});
			})
			.catch((error) => {
				console.error("Error fetching blog posts:", error);
				setLoading(false);
			});
	}, []);

	// Filter and sort posts when search query, sort option, or category changes
	useEffect(() => {
		if (posts.length > 0) {
			let results = [...posts];

			// Apply search filter if query exists
			if (searchQuery.trim()) {
				results = results.filter((post) =>
					post.title.rendered.toLowerCase().includes(searchQuery.toLowerCase())
				);
			}

			// Apply category filter
			if (selectedCategory !== "all") {
				results = results.filter((post) =>
					post.categories.includes(parseInt(selectedCategory))
				);
			}

			// Apply sorting
			switch (sortOption) {
				case "newest":
					results.sort((a, b) => new Date(b.date) - new Date(a.date));
					break;
				case "oldest":
					results.sort((a, b) => new Date(a.date) - new Date(b.date));
					break;
				case "a-z":
					results.sort((a, b) => {
						const titleA = a.title.rendered.replace(/<\/?[^>]+(>|$)/g, "");
						const titleB = b.title.rendered.replace(/<\/?[^>]+(>|$)/g, "");
						return titleA.localeCompare(titleB);
					});
					break;
				case "z-a":
					results.sort((a, b) => {
						const titleA = a.title.rendered.replace(/<\/?[^>]+(>|$)/g, "");
						const titleB = b.title.rendered.replace(/<\/?[^>]+(>|$)/g, "");
						return titleB.localeCompare(titleA);
					});
					break;
				default:
					break;
			}

			setFilteredPosts(results);
			setTotalPages(Math.ceil(results.length / postsPerPage));
			setCurrentPage(1); // Reset to first page when filters change
		}
	}, [searchQuery, sortOption, selectedCategory, posts]);

	// Get image for post (featured image or first image in content)
	const getImageForPost = (post) => {
		// Check for featured image
		const featured = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
		if (featured) return featured;

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

	// Format date
	const formatDate = (dateString) => {
		return new Date(dateString)
			.toLocaleDateString("bs-BA", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			})
			.replace(/\./g, "/");
	};

	// Limit excerpt text
	const limitExcerpt = (excerpt, limit = 160) => {
		if (!excerpt) return "";

		// Remove HTML tags
		const textOnly = excerpt.replace(/<\/?[^>]+(>|$)/g, "");

		if (textOnly.length <= limit) return textOnly;

		// Find the last space before the limit
		const trimmed = textOnly.substr(0, limit);
		const lastSpace = trimmed.lastIndexOf(" ");

		// Return trimmed text with ellipsis
		return textOnly.substr(0, lastSpace) + "...";
	};

	// Handle page changes
	const paginate = (pageNumber) => {
		setCurrentPage(pageNumber);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Clear search query
	const clearSearch = () => {
		setSearchQuery("");
	};

	// Clear all filters
	const clearAllFilters = () => {
		setSearchQuery("");
		setSortOption("newest");
		setSelectedCategory("all");
	};

	// Get current posts for pagination
	const getCurrentPosts = () => {
		const indexOfLastPost = currentPage * postsPerPage;
		const indexOfFirstPost = indexOfLastPost - postsPerPage;
		return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
	};

	// Get category name by ID
	const getCategoryName = (categoryId) => {
		const category = categories.find((cat) => cat.id === categoryId);
		return category ? category.name : "";
	};

	// Get reading time (approx 200 words per minute)
	const getReadingTime = (content) => {
		const text = content.replace(/<\/?[^>]+(>|$)/g, "");
		const wordCount = text.split(/\s+/).length;
		const readingTime = Math.ceil(wordCount / 200);
		return readingTime > 0 ? readingTime : 1;
	};

	return (
		<>
			{/* Add SEO component with values for Blogs page */}
			<SEO
				title="Blogovi - NovamaS Modna Agencija"
				description="Istražite naše blogove o dječijoj modi, trendovima i savjetima. Pronađite inspiraciju i korisne informacije za odijevanje vaših mališana."
			/>

			<Navbar />
			<div className="blogs-page">
				<div className="blogs-container">
					<div className="container">
						<div className="blogs-filters-section">
							<div className="blogs-filters-top">
								<div className="search-box">
									<Search size={20} className="search-icon" />
									<input
										type="text"
										placeholder="Pretraži blogove..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="search-input"
									/>
									{searchQuery && (
										<button className="clear-search" onClick={clearSearch}>
											<X size={18} />
										</button>
									)}
								</div>

								<div className="sort-box">
									<Filter size={18} className="sort-icon" />
									<select
										value={sortOption}
										onChange={(e) => setSortOption(e.target.value)}
										className="sort-select"
									>
										<option value="newest">Najnovije prvo</option>
										<option value="oldest">Najstarije prvo</option>
										<option value="a-z">A-Z</option>
										<option value="z-a">Z-A</option>
									</select>
								</div>
							</div>

							{/* Active Filters */}
							{(searchQuery ||
								selectedCategory !== "all" ||
								sortOption !== "newest") && (
								<div className="active-filters">
									<div className="active-filters-label">Aktivni filteri:</div>
									<div className="active-filters-tags">
										{searchQuery && (
											<div className="filter-tag">
												<span>Pretraga: {searchQuery}</span>
												<button onClick={clearSearch}>
													<X size={14} />
												</button>
											</div>
										)}
										{selectedCategory !== "all" && (
											<div className="filter-tag">
												<span>
													Kategorija:{" "}
													{getCategoryName(parseInt(selectedCategory))}
												</span>
												<button onClick={() => setSelectedCategory("all")}>
													<X size={14} />
												</button>
											</div>
										)}
										{sortOption !== "newest" && (
											<div className="filter-tag">
												<span>
													Sortiranje:{" "}
													{sortOption === "oldest"
														? "Najstarije prvo"
														: sortOption === "a-z"
														? "A-Z"
														: sortOption === "z-a"
														? "Z-A"
														: ""}
												</span>
												<button onClick={() => setSortOption("newest")}>
													<X size={14} />
												</button>
											</div>
										)}
									</div>
									<button
										className="clear-all-filters"
										onClick={clearAllFilters}
									>
										Očisti sve filtere
									</button>
								</div>
							)}

							{/* Results Count */}
							{!loading && (
								<div className="results-count">
									Pronađeno <span>{filteredPosts.length}</span>{" "}
									{filteredPosts.length === 1
										? "članak"
										: filteredPosts.length >= 2 && filteredPosts.length <= 4
										? "članka"
										: "članaka"}
								</div>
							)}
						</div>

						{loading ? (
							<div className="blogs-loading">
								<div className="spinner"></div>
								<p>Učitavanje blogova...</p>
							</div>
						) : filteredPosts.length > 0 ? (
							<>
								<div className="blogs-grid">
									{getCurrentPosts().map((post) => (
										<Link
											to={`/post/${post.slug}`}
											key={post.id}
											className="blog-card"
										>
											<div className="blog-image-container">
												<img
													src={getImageForPost(post)}
													alt={post.title.rendered.replace(
														/<\/?[^>]+(>|$)/g,
														""
													)}
													className="blog-image"
												/>
												<div className="blog-overlay"></div>
											</div>
											<div className="blog-content">
												<div className="blog-meta">
													<div className="blog-date">
														<Calendar size={14} />
														<span>{formatDate(post.date)}</span>
													</div>
													<div className="blog-reading-time">
														<BookOpen size={14} />
														<span>
															{getReadingTime(post.content.rendered)} min
														</span>
													</div>
												</div>
												<h2
													className="blog-title"
													dangerouslySetInnerHTML={{
														__html: post.title.rendered,
													}}
												/>
												<p className="blog-excerpt">
													{limitExcerpt(post.excerpt.rendered)}
												</p>
												<div className="blog-read-more">
													<span>Pročitaj više</span>
													<ArrowRight size={16} />
												</div>
											</div>
										</Link>
									))}
								</div>

								{totalPages > 1 && (
									<div className="pagination">
										<button
											className={`pagination-button ${
												currentPage === 1 ? "disabled" : ""
											}`}
											onClick={() =>
												currentPage > 1 && paginate(currentPage - 1)
											}
											disabled={currentPage === 1}
										>
											<ChevronLeft size={18} />
										</button>

										{Array.from({ length: totalPages }, (_, i) => {
											// Show first page, last page, and pages around current page
											if (
												i === 0 ||
												i === totalPages - 1 ||
												(i >= currentPage - 2 && i <= currentPage + 1)
											) {
												return (
													<button
														key={i + 1}
														onClick={() => paginate(i + 1)}
														className={`pagination-button ${
															currentPage === i + 1 ? "active" : ""
														}`}
													>
														{i + 1}
													</button>
												);
											} else if (
												(i === 1 && currentPage > 3) ||
												(i === totalPages - 2 && currentPage < totalPages - 3)
											) {
												return (
													<span key={i} className="pagination-ellipsis">
														...
													</span>
												);
											}
											return null;
										})}

										<button
											className={`pagination-button ${
												currentPage === totalPages ? "disabled" : ""
											}`}
											onClick={() =>
												currentPage < totalPages && paginate(currentPage + 1)
											}
											disabled={currentPage === totalPages}
										>
											<ChevronRight size={18} />
										</button>
									</div>
								)}
							</>
						) : (
							<div className="no-results">
								<div className="no-results-icon">
									<Search size={48} />
								</div>
								<h2>Nema pronađenih blogova</h2>
								<p>
									{searchQuery
										? `Nismo mogli pronaći blogove koji odgovaraju vašoj pretrazi "${searchQuery}".`
										: selectedCategory !== "all"
										? `Nismo mogli pronaći blogove u odabranoj kategoriji.`
										: "Trenutno nema dostupnih blogova."}
									<br />
									Pokušajte sa drugačijim filterima ili pogledajte sve naše
									blogove.
								</p>
								<button className="btn btn-primary" onClick={clearAllFilters}>
									Prikaži sve blogove
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default Blogs;
