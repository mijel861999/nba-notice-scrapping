import mysql2 from "mysql2"
import dotenv from "dotenv"

dotenv.config()

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbDatabase = process.env.DB_DATABASE;

const connection = mysql2.createConnection({
	host: dbHost,
	user: dbUser,
	password: dbPassword,
	database: dbDatabase,
})

connection.connect(err => {
	if (err) {
    console.error('Error al conectarse a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos.');
})



export default connection
