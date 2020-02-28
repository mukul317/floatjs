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
				use: ["ts-loader", "eslint-loader"],
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	devServer: {
		contentBase: path.join(__dirname, "public"),
		compress: true,
		port: 8000,
		open: true,
		before: function (app, server, compiler) {
			app.get('/#about', function (req, res) {
				res.json({ custom: 'response' });
			});
		}
	}
};
