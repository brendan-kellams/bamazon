var inquirer = require('inquirer');
var mySQL = require('mysql');
var Table = require('cli-table')

var connection = mySQL.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

var productPurchased = [];

connection.connect();

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

    buy(result);

});

function buy(result) {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Please enter the item number you would like to purchase:",
            // validate: function (value) {
            //     if (isNaN(value) == false && parseInt(value) <= result.length && parseInt(value) > 0) {
            //         return true;
            //     } else {
            //         return false;
            //     }
            // }
        }, {
            type: "input",
            name: "quantity",
            message: "How many would you like to buy? ",
            validate: function (value) {
                if (isNaN(value)) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(function (answers) {
        var item = (answers.id) - 1;
        var qty = parseInt(answers.quantity);
        

        connection.query('SELECT * FROM products WHERE item_id=?', { item_id: item }, function (err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log("I'm sorry, please enter a valid item ID.");
            } else {
                var productData = data[0];

                if (qty <= productData.stock_quantity) {
                    console.log("Great! placing your item in your cart.")

                    connection.query('UPDATE products SET stock_quantity = ' +
                        (productData.stock_quantity - qty) + ' WHERE item_id= ' + item, function (err, data) {
                            if (err) throw err;

                            var total = parseFloat(((result[item].price) * qty).toFixed(2));
                            console.log('Your order has been placed! Your total is $' + total);
                            console.log('Thank you and come again!');

                            connnection.end();
                        });

                } else {
                    console.log('Sorry, we do not have enough in stock of this product. Your order could not be be placed.');
                    console.log('Please modify your order.');

                }
            }
        });


    });
}
