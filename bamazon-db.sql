DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id INTEGER(100) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(6, 2) NOT NULL,
    stock_quantity INTEGER(100) NOT NULL
);

INSERT INTO bamazon_db.products 
	(item_id, product_name, department_name, price, stock_quantity)
    VALUES (420, "Gemini Link Purse", "Women's Goods", 390.00, 50); 
    
INSERT INTO bamazon_db.products 
	(item_id, product_name, department_name, price, stock_quantity)
    VALUES (630, "Playstation 4", "Electronics", 369.99, 250); 
    
INSERT INTO bamazon_db.products 
	(item_id, product_name, department_name, price, stock_quantity)
    VALUES (557, "Face Oil", "Cosmetics", 40.00, 50); 
    
INSERT INTO bamazon_db.products 
	(item_id, product_name, department_name, price, stock_quantity)
    VALUES (314, "Nintendo Switch", "Electronics", 299.99, 300); 
    
INSERT INTO bamazon_db.products 
	(item_id, product_name, department_name, price, stock_quantity)
    VALUES (173, "Canon EOS 5D Mark IV", "Electronics", 3499.99, 150); 
    
INSERT INTO bamazon_db.products 
	(item_id, product_name, department_name, price, stock_quantity)
    VALUES (666, "New Balance Black Shoes", "Men's Footware", 59.99, 50); 
    
INSERT INTO bamazon_db.products 
	(item_id, product_name, department_name, price, stock_quantity)
    VALUES (148, "All Natural: Calcium", "Supplements/Nutrition", 6.99, 500); 
    
INSERT INTO bamazon_db.products 
	(item_id, product_name, department_name, price, stock_quantity)
    VALUES (425, "Tory Burch Red Purse", "Women's Goods", 328.00, 50); 

INSERT INTO bamazon_db.products 
	(item_id, product_name, department_name, price, stock_quantity)
    VALUES (426, "Michael Kors Pink Purse", "Women's Goods", 200.00, 50); 
    
INSERT INTO bamazon_db.products 
	(item_id, product_name, department_name, price, stock_quantity)
    VALUES (325, "XBOX One Black Controller", "Electronics", 39.99, 200);

