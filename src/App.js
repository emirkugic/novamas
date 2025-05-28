// src/App.js
import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Homepage from "./pages/Homepage";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/post/:slug" element={<BlogPostRedirect />} />
				<Route path="/blogovi" element={<Blogs />} />
				<Route path="/o-nama" element={<About />} />
				<Route path="/kontakt" element={<Contact />} />
			</Routes>
		</Router>
	);
}

function BlogPostRedirect() {
	const params = new URLSearchParams(window.location.search);
	const slug = window.location.pathname.split("/post/")[1];

	React.useEffect(() => {
		window.location.href = `/objave.php?slug=${slug}`;
	}, [slug]);

	return <div>Loading post...</div>;
}

export default App;
