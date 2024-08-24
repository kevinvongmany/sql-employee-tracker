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

const viewData = async (tableName) => {
    const data = await pool.query(`SELECT * FROM ${tableName}`);
    console.table(data.rows);
    start();
};



const deleteItem = async (tableName) => {
    const items = await pool.query(`SELECT * FROM ${tableName}`);
    console.table(items.rows);
    const { item_id } = await inquirer.prompt({
        type: "list",
        name: "item_id",
        message: `Which ${tableName} ID would you like to delete?`,
        choices: items.rows.map((item) => ({
            name: item.name,
            value: item.id,
        })),
    });

    const confirmation = await inquirer.prompt({
        type: "confirm",
        name: "choice",
        message: `Are you sure you want to delete this ${tableName}?`,
    });
    if (confirmation.choice) {
        console.log(`Deleting ${tableName}...`);
        await pool.query(`DELETE FROM ${tableName} WHERE id = $1`, [item_id]);
    }
    start();
};

const viewBudgetUsage = async () => {
    const departments = await pool.query("SELECT * FROM department");
    const { department_id } = await inquirer.prompt({
        type: "list",
        name: "department_id",
        message: "Which department's budget would you like to view?",
        choices: departments.rows.map((department) => ({
        name: department.name,
        value: department.id,
        })),
    });
    
    const budget = await pool.query(
        "SELECT SUM(salary) FROM role WHERE department = $1",
        [department_id]
    );
    console.log(`The total budget for this department is $${budget.rows[0].sum}`);
    start();
};

start();
