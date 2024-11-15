import { createPool } from "mysql2/promise";

import dotenv from "dotenv"
dotenv.config({path: '.env'})

export const conexion = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
})