// required npm packages
var mySQL = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

// setting up connection with the MySQL database
var connection = mySQL.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

// starting connection
connection.connect(function (err) {
    if (err) throw err;
    console.log("connection successful!");
    makeTable();
});

// formatting the table
var makeTable = function () {
    connection.query('SELECT * FROM departments', function (err, res) {
        if (err) {
            console.log(err);
        }
        var table = new Table({
            head: ['Department ID #', 'Department Name', 'Overhead Cost', 'Product Sales', 'Total Sales'],
            style: {
                head: ['grey']
            }
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].department_id, res[i].department_name, res[i].overheadcosts, res[i].product_sales, res[i].total_sales]
            );
        }
        console.log(table.toString());
        addDepartment();
    });
};
// function for adding the department
var addDepartment = function () {
    // creating a prompt asking the user what is the name of the department they want to add and what is the overhead cost of the new department
    inquirer.prompt([{
        type: "input",
        name: "name",
        message: "What is the name of the department you would like to add?"
    }, {
        type: "input",
        name: "overhead",
        message: "What are the overhead costs of this department?"
    }]).then(function (val) {
        // inserting the new information into the departments database
        connection.query("INSERT INTO departments (department_name, overheadcosts, product_sales, total_sales) VALUES ('" +
            val.name + "'," + val.overhead + ", 0, 0);", function (err, res) {
                if (err) throw err;
                console.log("Department Added!");
                makeTable();
            });
    });
};
