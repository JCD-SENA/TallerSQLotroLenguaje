const mysql = require("mysql");
const http = require("http");
const fs = require("fs");
const process = require('process'); 

const formatData = (rawData) => {return JSON.parse("{\""+rawData.replaceAll("+", " ").replaceAll("=", "\":\"").replaceAll("&", "\",\"")+"\"}")}

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
						req.on("data",(postData) => {
							let data = formatData(postData)
							if (req.url == "/enviar") {
								let query = "INSERT INTO usuario (nombre, lang"
								if ("genero" in data) query+=", sexo"
								query += ") VALUES (\""+data["nombre"]+"\", \""
								if ("enLang" in data) query+="EN,"
								if ("esLang" in data) query+="ES,"
								if ("arLang" in data) query+="AR"
								if ("genero" in data) query+="\", "+data["genero"]
								if (!("genero" in data)) query+="\""
								query += ")"
								con.query(query, () => {})
								res.end(html.replace("ñ", ""))
							} else if (req.url == "/request") {
								let query = "SELECT * FROM usuario WHERE "
								Object.keys(data).forEach((lang, pos) => {
									if (lang == "enLang") query += "lang LIKE \"%EN%\""
									if (lang == "esLang") query += "lang LIKE \"%ES%\""
									if (lang == "arLang") query += "lang LIKE \"%AR%\""
									if (pos < Object.keys(data).length - 1) query += " AND "
								});
								let resp = ""
								con.query(query, (e, resultQuery) => {
									resultQuery.forEach((entr) => {
										resp += "<b>Nombre</b> "+entr["nombre"]+ "<b>Genero</b> "+entr["sexo"] + " <b>Idiomas</b> "+entr["lang"]+"<br>"
									})
									res.end(html.replace("ñ", resp))
								})
							}
						})						
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