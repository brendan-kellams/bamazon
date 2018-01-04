// import { connect } from 'http2';

// npm packages
var inquirer = require('inquirer');
var mySQL = require('mysql');
var Table = require('cli-table');

// connection with the MySQL server
var connection = mySQL.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

// product array where the selected items go
var productPurchased = [];

connection.connect(function (err) {
    if (err) throw err;
    console.log("connection successful!");
    makeTable();
});

var makeTable = function() {
    connection.query('SELECT item_id, product_name, department_name, price, stock_quantity FROM products', function (err, res) {
        if (err) {
            console.log(err);
        }
        var table = new Table({
            head: ['Item #', 'Product Name', 'Department', 'Price', 'Quantity'],
            style: {
                head: ['grey']
            }
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());

        buy(res);
    });
}

// grabbing the specific information from the products and putting them into the table
// the prompt that asks the questions, grabs the specific item, and gives the total cost
function buy(res) {
    inquirer.prompt([{
        type: "input",
        name: "productID",
        message: "Please enter the item number you would like to purchase:"
    }]).then(function (answer) {
        var correct = false;
        for (var i = 0; i < res.length; i++) {
            if (res[i].item_id == answer.productID) {
                correct = true;
                var product = answer.productID;
                var id = i;
                inquirer.prompt({
                    type: "input",
                    name: "quantity",
                    message: "How many would you like to buy? ",
                    validate: function (value) {
                        if (isNaN(value) == false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function (answer) {
                    var qty = parseInt(answer.quantity);
                    if ((res[id].stock_quantity - qty) > 0) {
                        connection.query("UPDATE products SET stock_quantity ='" +
                            (res[id].stock_quantity - answer.quantity) + "' WHERE item_id = '" +
                            product + "'", function (err, res2) {
                                console.log("Product Purchase Complete!");

                                var total = parseFloat(((res[id].price) * qty).toFixed(2));
                                console.log('Your order has been placed!');
                                console.log('You have ordered ' + qty + ' items of the ' +
                                    res[id].product_name + '.');
                                console.log('Your total is $' + total);
                                console.log('Thank you and come again!');
                                makeTable();
                            })
                    } else {
                        console.log('Sorry, we do not have enough in stock of this product. Your order could not be be placed.');
                        console.log('Please modify your order.');
                        buy(res);
                    }
                })
            }
        }
    });
};
