const mysql = require("mysql");
const http = require("http");
const fs = require("fs");
const process = require('process'); 

const formatData = (rawData) => {return JSON.parse("{\""+rawData.replaceAll("=", "\":\"").replaceAll("&", "\",\"")+"\"}")}

if (process.argv.length > 2) {
	let workingPort = parseInt(process.argv[2]);
	let con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		database: "lenguas",
		port: workingPort
	});

	fs.readFile("./index.html", (e, indexHtml) => {
		let html = indexHtml.toString().replaceAll("¿", workingPort+1)
		con.connect((errorCon) => {
			const server = http.createServer(
				(req, res) => {
					res.setHeader("Content-Type", "text/html");
					res.writeHead(200);
					req.setEncoding("utf8")
					if (req.method == "POST") {
						let resp = ""
						req.on("data",(postData) => {
							let data = formatData(postData)
							if (req.url == "/enviar") {
								con.query("", (errorQuery, resultQuery) => {
									if (errorQuery)
										throw errorQuery
									console.log(resultQuery)
								})
							} else if (req.url == "/request") {

							}
						})
						res.end(html.replace("ñ", resp))
					} else {
						res.end(html.replace("ñ", ""))
					}
				}
			);
			server.listen(workingPort+1, "localhost", () => {
				console.log("Conectado al server en http://localhost:"+(workingPort+1))
				console.log("My body is ready");
			})
		})
	})
}