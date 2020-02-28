var path = require("path");

module.exports = {
	mode: "development",
	entry: {
		main: "./lib/main.js",
	},
	output: {
		filename: "[name].bundle.js",
		path: path.join(__dirname, "dist"),
	},
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		compress: false,
		port: 8000
	}
};
