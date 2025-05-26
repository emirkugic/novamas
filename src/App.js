import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Post from "./pages/Post";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/post/:slug" element={<Post />} />
				<Route path="/blogovi" element={<Blogs />} />
				<Route path="/o-nama" element={<About />} />
				<Route path="/kontakt" element={<Contact />} />
			</Routes>
		</Router>
	);
}

export default App;
