//Bamazon extra bonus:
// Add to Supervisor View
// - Delete products from inventory.
// - Delete departments and ask if the user would like to merge all products to a deferent department before deleting, or delete all products in said department.
// - Update any product or department name.


// TODO: Create Function Add New Product: Allows manager to add a new product to the database

var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon_db"
});

// Connect to database
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as Id" + connection.threadId + "\n");
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
   // console.table(res);
    promptManagerForRequest(res);
  });
}

//List menu options: View Products for Sale; View Low Inventory; Add to Inventory; Add New Product
function promptManagerForRequest(inventory) {
  inquirer
    .prompt([
      {
        type: "rawlist",
        message: "Select One",
        choices: [
          "Manager's View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ],
        name: "managerActions"
      }
    ])
    .then(function(inquirerResponse) {
      // var selection = (inquirerResponse.choice);

      switch (inquirerResponse.managerActions) {
        case "Manager's View Products for Sale":
          viewProducts(inventory);
          break;
        case "View Low Inventory":
          lowInventory();
          break;
        case "Add to Inventory":
          addToInventory ();
          break;
        case "Add New Product":
          addNewProducts();
          break;
      }
    });
}

// FUNCTION to View Products that will list every available item providing viewer with: item ID, Names, rices and quantities
function viewProducts(inventory) {
  connection.query("SELECT * FROM products WHERE stock_quantity >0", function(err, res) {
    if (err) throw err;
   console.table(res);
  
  });
}
  


// FUNCTION Low Inventory: provides list of all items with a count lower than 5
function lowInventory(){
  connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res) {
    if (err) throw err;
   console.table(res);
    //promptManagerForRequest(res);
  });
}


// TODO: Create FUNCTION Add to Inventory: Provide prompt that allows manager  to "add more" of any item currently in the store.
function addToInventory (){
  inquirer
  .prompt([
    {
      type: "input",
      message: "Product Name",
      name: "product_name"
    },

    {
      type: "input",
      message: "Department",
      name: "department_name"
    },

    {
      type: "input",
      message: "Price",
      name: "price"
    },

    {
      type: "input",
      message: "Quantity",
      name: "stock_quantity"
    }

  ])
  .then(function(inquirerResponse) {

    
      var newItem = inquirerResponse.product_name;
      var newItemDept = inquirerResponse.department_name;
      var newItemPrice = inquirerResponse.price;
      var newItemQuant = inquirerResponse.stock_quantity;
      // console.log( newItem, newItemDept, newItemPrice, newItemQuant);
      // connection.query("SELECT * FROM products WHERE stock_quantity <= 5") 

      increaseInventory(newItem, newItemDept, newItemPrice, newItemQuant);
  }
)};



// TODO: Create Function Add New Product: Allows manager to add a new product to the database
function addToInventory(){
  console.log("this is the function that add new products")
};








// Add the new product to the database
function addNewProducts(item, dept, price, quant){

 var query = connection.query(
   "INSERT INTO products SET  ?",  
   {
     product_name: item,
     department_name: dept,
     price: price,
     stock_quantity: quant
   },  
    function(err){
        if (err) throw err;
      //   //updateCustomer(prodName, quantityReq, itemPrice)
      //   console.log(item, dept, price, quant);
    // });
      afterConnection();      
  }  
);
}


  
      
      
 
