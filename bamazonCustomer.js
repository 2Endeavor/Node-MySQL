
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
    promptCustomerForItems(res);
  })  
}



function promptCustomerForItems(inventory){
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



function checkInventory(choiceId,inventory){
  for(var i=0; i<inventory.length; i++){
    if ( choiceId===inventory[i].item_id){
      return inventory[i]
    }
  }
  return null;
}



// Here we find out how many items the customer needs
function quantityRequested(amtNeeded){
  
  inquirer
      .prompt([
    {
      type: "input",
      message: "How many would you like to buy?",
      name: "quantity"
    }
  ])
  .then(function(inquirerResponse){
    
  
    var quantity = parseInt(inquirerResponse.quantity);
    var curStockLevel = parseInt(amtNeeded.stock_quantity);
    var itemToPurchase = amtNeeded.item_id;
    var itemPrice = parseInt(amtNeeded.price);
    var prodName = (amtNeeded.product_name);
    
    if(quantity > curStockLevel){
      console.log("sorry we don't have enough. Please make another selection");
      afterConnection();
    }
    else{
      
      debtInventory(itemToPurchase, curStockLevel, quantity,itemPrice, prodName);
      
    }
  })
}



//Here we are updating mysql. We are passing in the product we wish to purchase and the new stock level
function debtInventory(reqProduct, curStockLevel, quantityReq, itemPrice, prodName){
  newStockLvl = (curStockLevel-quantityReq);

  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newStockLvl
      },
      {
        
        item_id: reqProduct
        
      }

    ],
    function(err){
      if (err) throw err;
      updateCustomer(prodName, quantityReq, itemPrice)
      afterConnection();
      
    }  
    );
}




// Here we are updating the customer and letting them know their final cost
function updateCustomer(prodName, quantityReq, itemPrice){
  var totalSale = quantityReq*itemPrice;
  
  
  console.log("Thank you for shopping with us!");
  console.log(prodName + "------------------$ " +itemPrice);
  console.log("Quantity purchased: " + quantityReq);
  console.log("Total Sale:-----------------$ " + totalSale);
  
}
