// src/index.js
import React from "react";
import { hydrate, render } from "react-dom";
import "./index.css";
import "./global.css";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";

const rootElement = document.getElementById("root");

// Handle both CSR and SSR/prerendered cases
if (rootElement.hasChildNodes()) {
	// We're hydrating a server-rendered app
	hydrate(
		<React.StrictMode>
			<HelmetProvider>
				<App />
			</HelmetProvider>
		</React.StrictMode>,
		rootElement
	);
} else {
	// We're rendering a client-side only app
	render(
		<React.StrictMode>
			<HelmetProvider>
				<App />
			</HelmetProvider>
		</React.StrictMode>,
		rootElement
	);
}

// This is used by react-snap for prerendering
export default App;
