var inquirer = require('inquirer');
var mySQL = require('mysql');
var Table = require('cli-table')

var connection = mySQL.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password:"",
    database: "bamazon_db"
});

connection.connect();

connection.query('SELECT item_id, product_name, price FROM products', function(err, result) {
    if(err) {
        console.log(err);
    }
    var table = new Table({
        head: ['Item #', 'Product Name', 'Price'],
        style: {
            head: ['grey']
        }
    });
    for(var i = 0; i < result.length; i++) {
        
        table.push(
            [result[i].item_id, result[i].product_name, result[i].price]
        );  
    }
    console.log(table.toString());
    connection.end();
});
