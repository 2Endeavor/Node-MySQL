var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon_db"
});


connection.connect(function(err){
  if (err) throw err;
  console.log("connected as Id" + connection.threadId + "\n");
  afterConnection();
})


function afterConnection(){ 
  connection.query("SELECT * FROM products", function(err, res){
    if(err) throw err;
    console.table(res);
    promptManagerForRequest(res);
  })  
}


function promptManagerForRequest(inventory){
  inquirer
      .prompt([
        {
          //Here we find out what the user wants to buy
          type: "input",
          message: "What item-number are you interested in purchasing?",
          name: "choice"
        }
      ])
      .then(function(inquirerResponse){
        var userResponse = parseInt(inquirerResponse.choice);      
        var product = checkInventory(userResponse,inventory);     
        var selection = product.item_id;
         
        if (product){
          quantityRequested(product, selection);

        }
      })
}