const mysql = require("mysql");
const http = require("http");
const fs = require("fs");
const { log } = require("console");

let con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "lenguas",
	port: 3307
});

fs.readFile("./index.html", (e, indexHtml) => {
	con.connect(function(err) {
		if (err) throw err;
		console.log("Conectado al server")
		const requestListener = function (req, res) {
			res.setHeader("Content-Type", "text/html");
			res.writeHead(200);
			req.setEncoding('utf8')
			if (req.method == 'POST') {
				let resp = "A"
				/*console.log(req)
				req.on("data",(postData) => {
					console.log("Data:")
					console.log(postData)
				})
				res.on("error", () => {
					console.log("A")
				})*/
				res.end(indexHtml.toString().replace("ñ", resp))
			} else {
				res.end(indexHtml.toString().replace("ñ", ""))
			}
		};
		const server = http.createServer(requestListener);
		server.listen(3308, "localhost", () => {
			console.log("My body is ready");
		});
	});
})