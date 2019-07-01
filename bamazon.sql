DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR (50),
  department_name VARCHAR (40),
  price DECIMAL (10,2),
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("Logitech Mouse", "Electronics", 25, 150);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("IPAD", "Electronics", 459, 83),
("Boots", "Shoes", 135, 40),
("Microwave","Appliances", 150, 300),
("Sneakers", "Shoes", 275, 74),
("Stove", "Appliances", 1200, 300),
("Kindle","Electronics", 399, 1000),
("Bike","Toys", 499, 200),
("Bike Helmet", "Toys", 35, 35),
("Legos", "Toys", 99, 17);





