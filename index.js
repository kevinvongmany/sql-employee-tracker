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

const start = async () => {
  const { action } = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      "View all employees",
      "View all departments",
      "View all roles",
      "Add employee",
      "Add department",
      "Add role",
      "Update employee role",
      "Update employee manager",
      "View employees by manager",
      "View employees by department",
      "Delete department",
      "Delete employee",
      "Delete role",
      "View department budget utilisation",
      "Exit",
    ],
  });

  switch (action) {
    case "View all employees":
        viewData("employee");
      break;
    case "View all departments":
        viewData("department");
      break;
    case "View all roles":
        viewData("role");
      break;
    case "Add employee":
      addEmployee();
      break;
    case "Add department":
      addDepartment();
      break;
    case "Add role":
      addRole();
      break;
    case "Update employee role":
      updateEmployeeRole();
      break;
    case "Update employee manager":
      updateEmployeeManager();
      break;
    case "View employees by manager":
      viewEmployeesByManager();
      break;
    case "View employees by department":
        viewEmployeesByDepartment();
        break;
    case "Delete department":
        deleteItem('department');
        break;
    case "Delete employee":
        deleteItem('employee');
        break;
    case "Delete role":
        deleteItem('role');
        break;
    case "View department budget utilisation":
        viewBudgetUsage();
        break;
    case "Exit":
      process.exit();
  }
};



start();
