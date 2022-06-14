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
                viewAll('Employees');
                break;
            case 'Add Employee':
                addNewEmployee();
                break;
            case 'Update Employee Role':
                updateEmployee();
                break;
            case 'View All Roles':
                viewAll('Roles');
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                viewAll('Departments');
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
    