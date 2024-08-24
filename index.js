import { user } from "pg/lib/defaults";

const { Pool } = require("pg");
const inquirer = require("inquirer");
const dotenv = require("dotenv");

dotenv.config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
});

pool.connect();

