const mysql = require('mysql2');
const inquirer = require('inquirer');
const art = require('ascii-art');
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

db.connect( async () => {
    try{
        let rendered = await art.font('Employee Manager', 'doom').completed()
        //rendered is the ascii
        console.log(rendered);
    }catch(err){
        //err is an error
    }
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
                addEmployee();
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

const addEmployee = () => {
    db.query ('SELECT * FROM employee', (err, employeeInfo) => {
        if (err) throw err;
        const employeeData = [
            {
                name: 'NA',
                value: 0
            }
        ];
        employeeInfo.forEach(({ first_name, last_name, id }) => {
            employeeData.push({
                name: first_name + ' ' + last_name,
                value: id
            });
        });

        db.query('SELECT * FROM ROLE', (err, roleInfo) => {
            if (err) throw err;
            const newRole = [];
            roleInfo.forEach(({ title, id }) => {
                newRole.push({
                    title: title,
                    value: id
                });
            });
        
        let prompts = [
            {
                type: 'input',
                name: 'first_name',
                message: 'What is the first name of this employee?'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is the last name of this employee?'
            },
            {
                type: 'list',
                name: 'role_id',
                choices: newRole,
                message: 'What is the role of this employee?'
            },
            {
                type: 'list',
                name: 'manager_id',
                choices: employeeData,
                message: 'Who is the manager of this employee?'
            }
        ]
        
        inquirer.prompt(prompts)
         .then(res => {
            const query = `INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id) VALUES (?)`;
            let manager_id = res.manager_id !== 0? res.manager_id: null;
            db.query (query, [[res.first_name, res.last_name, res.role_id, manager_id]], (err, res) => {
                console.log(`Added ${res.first_name} ${res.last_name} to organization database.`);
                startApp();
            });
         })
         .catch(err => {
            console.log(err);
         });
        });
    });
};

const updateEmployee = () => {
    db.query('SELECT * FROM employee', (err, employeeInfo) => {
        if (err) throw err;
        const employeeData = [];
        employeeInfo.forEach(({ name, value}) => {
            employeeData.push( {
                name: first_name + ' ' + last_name,
                value: id
            });
        });
        db.query('SELECT * FROM ROLE', (err, roleInfo) => {
            if (err) throw err;
            const updatedRole = [];
            roleInfo.forEach(({ title, id }) => {
                updatedRole.push({
                    title: title,
                    value: id
                });
            });
        
        let prompts = [
            {
                type: 'list',
                name: 'id',
                choices: employeeData,
                message: 'Which employee is being updated?'
            },
            {
                type: 'list',
                name: 'role_id',
                choices: updatedRole,
                message: 'What is the new role of this employee?'
            }
        ]
        
        inquirer.prompt(prompts)
        .then(res => {
           const query = `UPDATE employee SET ? WHERE ?? = ?;)`;
           db.query (query, [{role_id: res.role_id}, 'id', res.id], (err, res) => {
            if (err) throw err;
               console.log(`Employee has been updated.`);
               startApp();
           });
        })
        .catch(err => {
           console.log(err);
        });
        });
    });
};