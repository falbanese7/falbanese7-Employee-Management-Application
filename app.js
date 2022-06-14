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

// ASCII Art NPM package. Renders text as ASCII art in user's console.
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

// Overarching function
function startApp() {
    
    // List of main menu questions
    const primeQ = [{
        type: 'list',
        message: `What would you like to do?`,
        choices: ['View All Employees', 'View All Roles', 'View All Departments', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Update Manager', 'View Emplpoyee by Manager', 'View Budgets', 'Delete Employee', 'Delete Role', 'Delete Department', 'Exit'],
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
            case 'View Budgets':
                viewBudgets();
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
    
const viewAll = (table) => { // Handles menu options that allow user to "View All"
    let query; 
    if (table === 'department') {
        query = `SELECT * FROM department`
    } else if (table === 'role') {
        query = `SELECT r.id AS id, title, salary, d.name AS department FROM role as r LEFT JOIN department AS d ON r.department_id = d.id;`;
    } else {
        query = `SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, r.title as role, r.salary AS salary, d.name as department, CONCAT(m.first_name, '', m.last_name) AS manager 
        FROM employee AS e LEFT JOIN ROLE AS r ON e.role_id = r.id 
        LEFT JOIN department as d ON r.department_id = d.id LEFT JOIN employee AS m on e.manager_id = m.id;`;
    }
   
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    }
)};

// Function to create a new employee
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

        db.query('SELECT * FROM role', (err, roleInfo) => {
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
            const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)`;
            let manager_id = res.manager_id !== 0? res.manager_id: null;
            db.query (query, [[res.first_name, res.last_name, res.role_id, manager_id]], (err, res) => {
                console.log(`Added new employee to organization database.`);
                startApp();
            });
         })
         .catch(err => {
            console.log(err);
         });
        });
    });
};

// Function to update an existing employee's data
const updateEmployee = () => {
    db.query('SELECT * FROM employee', (err, employeeInfo) => {
        if (err) throw err;
        const employeeArr = [];
        employeeInfo.forEach(({ first_name, last_name, id}) => {
            employeeArr.push( {
                name: first_name + ' ' + last_name,
                value: id
            });
        });
        db.query('SELECT * FROM role', (err, roleInfo) => {
            if (err) throw err;
            const roleArr = [];
            roleInfo.forEach(({ title, id }) => {
                roleArr.push({
                    title: title,
                    value: id
                });
            });
        
        let prompts = [
            {
                type: 'list',
                name: 'id',
                choices: employeeArr,
                message: 'Which employee is being updated?'
            },
            {
                type: 'list',
                name: 'role_id',
                choices: roleArr,
                message: 'What is the new role of this employee?'
            }
        ]
        
        inquirer.prompt(prompts)
        .then(res => {
           const query = `UPDATE employee SET ? WHERE ?? = ?;`;
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

// Function to add a new role
const addRole = () => {
    
    const deptArr = [];
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        res.forEach(depart => {
            let promptObject = {
                name: depart.name,
                value: depart.id
            }
            deptArr.push(promptObject);
        });
        let prompts = [
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of this role?'  
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of this role?' 
            },
            {
                type: 'list',
                name: 'department_id',
                choices: deptArr,
                message: 'What department is this role a part of?'
            }
        ]
        inquirer.prompt(prompts)
        .then(res => {
            const query = `INSERT INTO role (title, salary, department_id) VALUES (?)`;
            db.query (query, [[res.title, res.salary, res.department_id]], (err, res) => {
                console.log(`Added role to organization database.`);
                startApp();
            });
        })
        .catch(err => {
           console.log(err);
        });
    });
};

// Function to add a new department
const addDepartment = () => {
    let prompts = [
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of this new department?'
        }
    ]
    inquirer.prompt(prompts)
    .then(res => {
        const query = `INSERT INTO department (name) VALUES (?)`;
        db.query (query, [[res.name]], (err, res) => {
            if (err) throw err;
            console.log(`Department added to organization database.`);
            startApp();
        });
    })
    .catch(err => {
       console.log(err);
    });
};

// Function that allows the user to update an existing employee's manager
const updateManager = () => {
    db.query('SELECT * FROM employee', (err, employeeInfo) => {
        if (err) throw err;
        const employeeArr = [];
        employeeInfo.forEach(({ first_name, last_name, id}) => {
            employeeArr.push( { name: first_name + ' ' + last_name, value: id });
        });

        const managerSelect = [{ name: 'NA', value: 0 }];
        employeeInfo.forEach(({ first_name, last_name, id}) => {
            managerSelect.push( {
                name: first_name + ' ' + last_name,
                value: id
            });

        });

        let prompts = [
            {
                type: 'list',
                name: 'id',
                choices: employeeArr,
                message: 'Who would you like to update?'
            },
            {
                type: 'list',
                name: 'manager_id',
                choices: managerSelect,
                message: 'Which manager will now be overseeing to this employee?'
            }
        ]

        inquirer.prompt(prompts)
        .then(res => {
            const query = `UPDATE employee SET ? WHERE ?? = ?;`;
            let manager_id = res.manager_id !== 0? res.manager_id: null;
            db.query (query, [{manager_id: res.manager_id}, 'id', res.id], (err, res) => {
             if (err) throw err;
                console.log(`Employee has been assigned a new manager.`);
                startApp();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
};

// Function that displays a list of a specific manager's employee list. If an employee is not a manager, no data will appear in the console.
const viewEmployeeByManager = () => {
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

        let prompts = [
            {
                type: 'list',
                name: 'manager_id',
                choices: employeeData,
                message: `Which manager's employees would you like to see?`
            }
        ]

        inquirer.prompt(prompts)
        .then(res => {
            let query, manager_id;
            if (res.manager_id) {
                query = `SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, r.title as role, r.salary AS salary, d.name as department, CONCAT(m.first_name, '', m.last_name) AS manager 
                FROM employee AS e LEFT JOIN ROLE AS r ON e.role_id = r.id LEFT JOIN department as d ON r.department_id = d.id LEFT JOIN employee AS m on e.manager_id = m.id
                WHERE e.manager_id = ?`;
            } else {
                manager_id = null;
                query = `SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, r.title as role, r.salary AS salary, d.name as department, CONCAT(m.first_name, '', m.last_name) AS manager 
                FROM employee AS e LEFT JOIN ROLE AS r ON e.role_id = r.id LEFT JOIN department as d ON r.department_id = d.id LEFT JOIN employee AS m on e.manager_id = m.id
                WHERE e.manager_id is null`;
            }
            db.query(query, [res.manager_id], (err, res) => {
                if (err) throw err;
                console.table(res);
                startApp();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
};

// Deletes a role ONLY if all employees have been deleted first and roles have been deleted second
const deleteDepartment = () => {
    const deptArr = [];
    db.query('SELECT * FROM department', (err, res) => {
        res.forEach(department => {
            let promptObject = {
                name: department.name,
                value: department.id
            }
            deptArr.push(promptObject);
        });

        let prompts = [
            {
                type: 'list',
                name: 'id',
                choices: deptArr,
                message: 'Which department would you like to delete?'
            }
        ]

        inquirer.prompt(prompts)
        .then(res => {
            const query = `DELETE FROM department WHERE id = ?`;
            db.query(query, [res.id], (err, res) => {
                if (err) throw err;
                console.log(`The department has been deleted.`)
                startApp();
            });
        })
        .catch(err => {
            console.log(err);
        })
    });
};

// Deletes a role ONLY if all employees have been deleted first
const deleteRole = () => {
    db.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;

        const roleArr = [];
            res.forEach(({ title, id }) => {
                roleArr.push({
                    title: title,
                    value: id
                });
            });
        
        let prompts = [
            {
                type: 'list',
                name: 'id',
                choices: roleArr,
                message: 'Which role would you like to delete?'
            },
        ]

        inquirer.prompt(prompts)
        .then(res => {
            const query = `DELETE FROM role WHERE id = ?`;
            db.query(query, [res.id], (err, res) => {
                if (err) throw err;
                console.log(`The role has been deleted.`)
                startApp();
            });
        })
        .catch(err => {
            console.log(err);
        })
    })
};

// Deletes an employee's information from the database
const deleteEmployee = () => {
    db.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;

        const employeeArr = [];
        res.forEach(({ first_name, last_name, id }) => {
            employeeArr.push({
                name: first_name + ' ' + last_name,
                value: id
            });
        });

        let prompts = [
            {
                type: 'list',
                name: 'id',
                choices: employeeArr,
                message: 'Which employee would you like to delete?'
            }
        ]

        inquirer.prompt(prompts)
        .then(res => {
            const query = `DELETE FROM employee WHERE id = ?`;
            db.query(query, [res.id], (err, res) => {
                if (err) throw err;
                console.log(`Emoloyee has been deleted.`)
                startApp();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
};

// Sums up the total amount of salraies across a department and displays it to the console
const viewBudgets = () => {
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;

        const dSelect = [];
        res.forEach(({ name, id }) => {
            dSelect.push({ name: name, value: id });
        });

        let prompts = [
            {
                type: 'list',
                name: 'id',
                choices: dSelect,
                message: `Which department's budget would you like to view?`
            }
        ]

        inquirer.prompt(prompts)
        .then(res => {
            const query = `SELECT d.name, SUM(salary) as budget
            FROM employee AS e LEFT JOIN role AS r ON e.role_id = r.id
            LEFT JOIN department AS d ON R.department_id = d.id
            WHERE d.id = ?;`;
            db.query(query, [res.id], (err, res) => {
                if (err) throw err;
                console.table(res);
                startApp();
            });
        })
        .catch(err => {
            console.log(err);
        });
        
        
    })
}
