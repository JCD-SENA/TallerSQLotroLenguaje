const mysql = require("mysql");
const http = require("http");
const fs = require("fs");

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
			res.end(indexHtml)
		};
		const server = http.createServer(requestListener);
		server.listen(3308, "localhost", () => {
			console.log("My body is ready");
		});
	});
})