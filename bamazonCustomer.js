// npm packages
var inquirer = require('inquirer');
var mySQL = require('mysql');
var Table = require('cli-table');

// connection with the MySQL server
var connection = mySQL.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

// product array where the selected items go
var productPurchased = [];

connection.connect();

// grabbing the specific information from the products and putting them into the table
connection.query('SELECT item_id, product_name, price FROM products', function (err, result) {
    if (err) {
        console.log(err);
    }
    var table = new Table({
        head: ['Item #', 'Product Name', 'Price'],
        style: {
            head: ['grey']
        }
    });
    for (var i = 0; i < result.length; i++) {

        table.push(
            [result[i].item_id, result[i].product_name, result[i].price]
        );
    }
    console.log(table.toString());

    buy();

});

// the prompt that asks the questions, grabs the specific item, and gives the total cost
function buy() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Please enter the item number you would like to purchase:",
        }, {
            type: "input",
            name: "quantity",
            message: "How many would you like to buy? ",
        }
    ]).then(function (answers) {
        var item = (answers.id);
        var qty = parseInt(answers.quantity);

        // searching for the requested item
        connection.query('SELECT * FROM products WHERE item_id=?', item, function (err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log("I'm sorry, please enter a valid item ID.");
            } else {
                var productData = data[0];

                if (qty <= productData.stock_quantity) {
                    console.log("Great! placing your items in your cart.")

                    // grabbing the specific item
                    connection.query('UPDATE products SET stock_quantity = ' +
                        (productData.stock_quantity - qty) + ' WHERE item_id= ' + item, function (err, data) {
                            if (err) throw err;

                            var total = parseFloat(((productData.price) * qty).toFixed(2));

                            console.log('');
                            console.log('Your order has been placed!');
                            console.log('You have ordered ' + qty + ' items of the ' +
                                productData.product_name + '.');
                            console.log('Your total is $' + total);
                            console.log('Thank you and come again!');

                            connection.end();
                        });

                } else {
                    console.log('Sorry, we do not have enough in stock of this product. Your order could not be be placed.');
                    console.log('Please modify your order.');

                }
            }
        });


    });
}
