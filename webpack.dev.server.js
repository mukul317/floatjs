var path = require("path");

module.exports = {
	mode: "development",
	entry: {
		main: "./src/main.ts",
	},
	output: {
		filename: "[name].bundle.js",
		path: path.join(__dirname, "public"),
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	devServer: {
		contentBase: path.join(__dirname, "public"),
		compress: false,
		port: 8000,
		open: true
	}
};
