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
    figlet("Employee Manager", function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
    });
    startApp();
});

async function startApp() {
    const primeQ = [{
        
    }]
}