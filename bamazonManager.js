// required npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

// setting up connection with the MySQL database
var connection = mysql.createConnection({
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
    connection.query('SELECT item_id, product_name, department_name, price, stock_quantity FROM products', function (err, result) {
        if (err) {
            console.log(err);
        }
        var table = new Table({
            head: ['Item #', 'Product Name', 'Department', 'Price', 'Quantity'],
            style: {
                head: ['grey']
            }
        });
        for (var i = 0; i < result.length; i++) {

            table.push(
                [result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity]
            );
        }
        console.log(table.toString());
        promptManager(result);
    });
};

// giving the user a choice between adding a new product or adding quantity to an existing item
var promptManager = function (result) {
    inquirer.prompt([{
        type: "rawlist",
        name: "choice",
        message: "What would you like to do?",
        choices: ["Add a new product", "Add quantity to an existing product"]
    }]).then(function (val) {
        if (val.choice == "Add a new product") {
            addItem();
        }
        if (val.choice == "Add quantity to an existing product") {
            addQuantity(result);
        }
    });
};

// this function adds a new product into the data base with information provided by the user
function addItem() {
    inquirer.prompt([{
        type: "input",
        name: "item_id",
        message: "What is the product's id number?"
    }, {
        type: "input",
        name: "product_name",
        message: "What is the name of the product?"
    }, {
        type: "input",
        name: "department_name",
        message: "Which department does this product belong?"
    }, {
        type: "input",
        name: "price",
        message: "What is the price of the product?"
    }, {
        type: "input",
        name: "stock_quantity",
        message: "How many of the items of the product are available for sale?"
    }]).then(function (val) {
        // adding the inputed data into the product database
        connection.query("INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES ('"
            + val.item_id + "','" + val.product_name + "','" + val.department_name + "','" + val.price + "','" + val.stock_quantity + "');",
            function (err, res) {
                if (err) throw err;
                console.log(val.product_name + " ADDED TO BAMAZON!!!");
                makeTable();
            });
    });
};

// this function adds quantity to an existing item
function addQuantity(res) {
    inquirer.prompt([{
        type: "input",
        name: "product_name",
        message: "What product would you like to update"
    }, {
        type: "input",
        name: "added",
        message: "How much stock would you like to add?"
    }]).then(function (val) {
        // searches through the database to see if the product name provided by the user matches the product name in the product database
        for (i = 0; i < res.length; i++) {
            if (res[i].product_name == val.product_name) {
                connection.query('UPDATE products SET stock_quantity = stock_quantity+' + val.added + ' WHERE item_id=' + res[i].item_id + ';', function (err, res) {
                    if (err) throw err;
                    if (res.affectedRows == 0) {
                        console.log("That item does not exist at this time. Try selecting a different item.");
                    } else {
                        console.log("Items have been added into your inventory.");
                        makeTable();
                    }
                });
            };
        };
    });
};
