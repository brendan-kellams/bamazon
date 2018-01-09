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

// starting connection
connection.connect(function (err) {
    if (err) throw err;
    console.log("connection successful!");
    makeTable();
});

// formatting the table
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
};

// this function prompts the user which item they would like and what quantity of that item they would like.
// it substracts the quantity purchased from the product database, displays the total, and applies that total to the product sales in the department database 
function buy(res) {
    // the prompt asking which item they would like to purchase.  The user has to provide the item id #
    inquirer.prompt([{
        type: "input",
        name: "productID",
        message: "Please enter the item number you would like to purchase:"
    }]).then(function (answer) {
        // checking if the item id given by the user is correct
        var correct = false;
        for (var i = 0; i < res.length; i++) {
            if (res[i].item_id == answer.productID) {
                correct = true;
                var product = answer.productID;
                var id = i;
                // once it's confirmed that is correct, another prompt asks how many the user would like to buy
                inquirer.prompt({
                    type: "input",
                    name: "quantity",
                    message: "How many would you like to buy? ",
                    validate: function (value) {
                        // checking if the quantity given is a number
                        if (isNaN(value) == false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function (answer) {
                    // substracting the quantity purchased from the product database
                    var qty = parseInt(answer.quantity);
                    if ((res[id].stock_quantity - qty) > 0) {
                        connection.query("UPDATE products SET stock_quantity ='" +
                            (res[id].stock_quantity - answer.quantity) + "' WHERE item_id = '" +
                            product + "'", function (err, res2) {
                                // adding the total from the purchase to the product sales in the department database
                                connection.query("UPDATE departments SET product_sales= product_sales+"+
                                (answer.quantity*res[id].price)+", total_sales=product_sales-overheadcosts WHERE department_name='"+
                                res[id].department_name+"';", function(err,res3) {
                                    console.log("Sales Added to Department!");
                                });
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
