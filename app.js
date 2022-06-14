const mysql = require('mysql2');
const inquirer = require('inquirer');
const figlet = require('figlet');
const cTable = require('console.table');


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'organization_db'
    },
    console.log('Connected to the organization_db database.')
);

db.connect((err) => {
    if (err) throw(err);
    figlet('Employee Manager', function(err, data) {
        if (err) {
            console.log(`Couldn't create art.`);
            console.dir(err);
            return;
        }
        console.log(data)
    });
    startApp();
});

function startApp() {
    const primeQ = [{
        type: 'list',
        message: `What would you like to do?`,
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Update Manager', 'View Emplpoyee by Manager', 'Delete Department', 'Delete Role', 'Delete Employee', 'Exit'],
        name:'main'
    }]

    inquirer.prompt(primeQ)
    .then(response => {
        switch (response.main){
            case 'View All Employees':
                viewAll('employee');
                break;
            case 'Add Employee':
                addNewEmployee();
                break;
            case 'Update Employee Role':
                updateEmployee();
                break;
            case 'View All Roles':
                viewAll('role');
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                viewAll('department');
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Update Manager':
                updateManager();
                break;
            case 'View Emplpoyee by Manager': 
                viewEmployeeByManager();
                break;
            case 'Delete Department':
                deleteDepartment();
                break;
            case 'Delete Role':
                deleteRole();
                break;
            case 'Delete Employee':
                deleteEmployee();
                break;
            default:
                db.end();
        }       
    })
    .catch(err => {console.log(err)});
};
    
const viewAll = (table) => {
    let query; 
    if (table === 'department') {
        query = `SELECT * FROM department`
    } else if (table === 'role') {
        query = `SELECT R.id AS id, title, salary, D.name AS department FROM role as R LEFT JOIN department AS D ON R.department_id = D.id;`;
    } else {
        query = `SELECT E.id AS id, E.first_name AS first_name, E.last_name AS last_name, R.title as role, D.name as department, CONCAT(M.first_name, '', M.last_name) AS manager 
        FROM employee AS E LEFT JOIN ROLE AS R ON E.role_id = R.id LEFT JOIN department as D ON R.department_id = D.id LEFT JOIN employee AS M on E.manager_id = M.id;`;
    }
   
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    }
)};