// src/index.js
import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";

const rootElement = document.getElementById("root");

// Handle both CSR and SSR/prerendered cases
if (rootElement.hasChildNodes()) {
	hydrateRoot(
		rootElement,
		<React.StrictMode>
			<HelmetProvider>
				<App />
			</HelmetProvider>
		</React.StrictMode>
	);
} else {
	const root = createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<HelmetProvider>
				<App />
			</HelmetProvider>
		</React.StrictMode>
	);
}
