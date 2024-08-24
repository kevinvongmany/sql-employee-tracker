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

const addEmployee = async () => {
  const roles = await pool.query("SELECT * FROM role");
  const employees = await pool.query("SELECT * FROM employee");
  const managers = employees.rows.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
  managers.push({ name: "None", value: null });
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "role_id",
      message: "What is the employee's role?",
      choices: roles.rows.map((role) => ({ name: role.title, value: role.id })),
    },
    {
      type: "list",
      name: "manager_id",
      message: "Who is the employee's manager?",
      choices: managers,
    },
  ]);

  await pool.query(
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
    [first_name, last_name, role_id, manager_id]
  );
  console.log("Employee added!");
  start();
};

const addDepartment = async () => {
  const { name } = await inquirer.prompt({
    type: "input",
    name: "name",
    message: "What is the name of the department?",
  });

  await pool.query("INSERT INTO department (name) VALUES ($1)", [name]);
  console.log("Department added!");
  start();
};

const addRole = async () => {
  const departments = await pool.query("SELECT * FROM department");
  const { title, salary, department_id } = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the title of the role?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the role?",
    },
    {
      type: "list",
      name: "department_id",
      message: "What department does the role belong to?",
      choices: departments.rows.map((department) => ({
        name: department.name,
        value: department.id,
      })),
    },
  ]);

  await pool.query(
    "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
    [title, salary, department_id]
  );
  console.log("Role added!");
  start();
};

const updateEmployeeRole = async () => {
  const employees = await pool.query("SELECT * FROM employee");
  const roles = await pool.query("SELECT * FROM role");
  const { employee_id, role_id } = await inquirer.prompt([
    {
      type: "list",
      name: "employee_id",
      message: "Which employee's role would you like to update?",
      choices: employees.rows.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })),
    },
    {
      type: "list",
      name: "role_id",
      message: "What is the employee's new role?",
      choices: roles.rows.map((role) => ({ name: role.title, value: role.id })),
    },
  ]);

  await pool.query("UPDATE employee SET role_id = $1 WHERE id = $2", [
    role_id,
    employee_id,
  ]);
  console.log("Employee role updated!");
  start();
};

const updateEmployeeManager = async () => {
  const employees = await pool.query("SELECT * FROM employee");
  const managers = employees.rows.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
  managers.push({ name: "None", value: null });
  const { employee_id, manager_id } = await inquirer.prompt([
    {
      type: "list",
      name: "employee_id",
      message: "Which employee's manager would you like to update?",
      choices: employees.rows.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })),
    },
    {
      type: "list",
      name: "manager_id",
      message: "Who is the employee's new manager?",
      choices: managers,
    },
  ]);

  await pool.query("UPDATE employee SET manager_id = $1 WHERE id = $2", [
    manager_id,
    employee_id,
  ]);
  console.log("Employee manager updated!");
  start();
};

const viewEmployeesByManager = async () => {
    const employees = await pool.query("SELECT * FROM employee");
    const { manager_id } = await inquirer.prompt({
        type: "list",
        name: "manager_id",
        message: "Which manager's employees would you like to view?",
        choices: employees.rows.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
        })),
    });
    
    const managerEmployees = await pool.query(
        "SELECT * FROM employee WHERE manager_id = $1",
        [manager_id]
    );
    console.table(managerEmployees.rows);
    start();
};

const viewEmployeesByDepartment = async () => {
    const departments = await pool.query("SELECT * FROM department");
    const { department_id } = await inquirer.prompt({
        type: "list",
        name: "department_id",
        message: "Which department's employees would you like to view?",
        choices: departments.rows.map((department) => ({
        name: department.name,
        value: department.id,
        })),
    });
    
    const departmentEmployees = await pool.query(
        "SELECT * FROM employee WHERE role_id IN (SELECT id FROM role WHERE department = $1)",
        [department_id]
    );
    console.table(departmentEmployees.rows);
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
