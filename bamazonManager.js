var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
})

connection.connect();

var makeTable = function() {
    connection.query('SELECT item_id, product_name, price, stock_quantity FROM products', function (err, result) {
        if (err) {
            console.log(err);
        }
        var table = new Table({
            head: ['Item #', 'Product Name', 'Price', 'Quantity'],
            style: {
                head: ['grey']
            }
        });
        for (var i = 0; i < result.length; i++) {
    
            table.push(
                [result[i].item_id, result[i].product_name, result[i].price, result[i].stock_quantity]
            );
        }
        console.log(table.toString());
        promptManager(result);
    });
}


var promptManager = function(result) {
    inquirer.prompt([{
        type: "rawlist",
        name: "choice",
        message: "What would you like to do?",
        choices: ["Add new item","Add quantity to an existing item"]
    }]).then(function(val) {
        if(val.choice == "Add new item") {
            addItem();
        }
        if(val.choice == "Add quantity to an existing item") {
            addQuantity(result);
        }
    })
}

function addItem() {
    inquirer.prompt([{
        type: "input",
        name: "item_id",
        message: "What is the product's id number?"
    },{
        type: "input",
        name: "product_name",
        message: "What is the name of the product?" 
    },{
        type: "input",
        name: "price",
        message: "What is the price of the product?"
    },{
        type: "input",
        name: "stock_quantity",
        message: "How many of the items of the product are available for sale?" 
    }]).then(function(val){
        connection.query("INSERT INTO products (item_id, product_name, price, stock_quantity) VALUES ('"+ val.item_id +"','"+ val.product_name +"','"+ val.price +"','"+ val.stock_quantity+"');", function(err,res){
            if(err)throw err;
            console.log(val.product_name + " ADDED TO BAMAZON!!!");
            makeTable();
        })
    })
}

function addQuantity(res){
    inquirer.prompt([{
        type: "input",
        name: "product_name",
        message: "What producct would you like to update"
    },{
        type: "input",
        name: "added",
        message: "How much stock would you like to add?"
    }]).then(function(val){
        for(i=0; i<res.length; i++){
            if(res[i].product_name==val.product_name){
                connection.query('UPDATE products SET stock_quantity = stock_quantity+'+ val.added +' WHERE item_id=' + res[i].item_id +';', function(err,res){
                    if(err)throw err;
                    if(res.affectedRows == 0) {
                        console.log("That item does not exist at this time. Try selecting a different item.");
                    } else {
                        console.log("Items have been added into your inventory.");
                        makeTable();
                    }
                })
            }
        }
    })
}

makeTable();