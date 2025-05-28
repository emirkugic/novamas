// downgrade-react.js
const fs = require("fs");
const { execSync } = require("child_process");

// Read the package.json file
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));

// Update React and React DOM versions
packageJson.dependencies.react = "^18.2.0";
packageJson.dependencies["react-dom"] = "^18.2.0";

// Update react-helmet-async to be compatible with React 18
packageJson.dependencies["react-helmet-async"] = "^1.3.0";

// Add react-snap configuration
packageJson.reactSnap = {
	include: ["/", "/o-nama", "/kontakt", "/blogovi"],
	skipThirdPartyRequests: false,
	puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
	puppeteerIgnoreHTTPSErrors: true,
	inlineCss: false,
	removeBlobs: true,
	minifyHtml: {
		collapseWhitespace: false,
		removeComments: false,
	},
	sourceMaps: false,
	fixWebpackChunksIssue: false,
	removeStyleTags: false,
	concurrency: 4,
	cacheAjaxRequests: true,
};

// Update the postbuild script
packageJson.scripts.postbuild = "react-snap";

// Write the updated package.json
fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));

console.log("Package.json has been updated. Now running npm install...");

// Run npm install with force
try {
	execSync("npm install --legacy-peer-deps", { stdio: "inherit" });
	console.log("React 18 installation complete!");

	// Now install react-snap
	console.log("Installing react-snap...");
	execSync("npm install --save react-snap --legacy-peer-deps", {
		stdio: "inherit",
	});
	console.log("react-snap installation complete!");

	console.log("\n✅ DOWNGRADE COMPLETE!");
	console.log("\nNext steps:");
	console.log(
		"1. Update your src/index.js file with the React 18 hydration code"
	);
	console.log("2. Run 'npm run build' to test the build process");
	console.log("3. Deploy your site and test the social media previews");
} catch (error) {
	console.error("Error during installation:", error);
}
