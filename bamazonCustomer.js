var inquirer = require('inquirer');
var mySQL = require('mysql');

var connection = mySQL.createConnection({
    host: "LocalTacoShop",
    port: 3306,
    user: "root",
    password:"",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if(err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.end();
});