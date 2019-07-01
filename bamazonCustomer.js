
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
        console.log(userResponse);
        var product = checkInventory(userResponse,inventory);
        console.log("line 43 selection and product");
        var selection = product.item_id;
        console.log(selection, product);
        //console.log(product.item_id);
        if (product){
          quantityRequested(product, selection);

        }
        // var query = connection.query("SELECT stock_quantity from products WHERE product_name ='bike'", function(err, res){
        //   if (err)throw err;
        //   console.log(query);
        // })
         //console.log(inquirerResponse.item_id, inquirerResponse.quantity);
         // console.log(item_id);
          //connection.end();

      })
}


function checkInventory(choiceId,inventory){
  for(var i=0; i<inventory.length; i++){
    if ( choiceId===inventory[i].item_id){
      console.log("This is in the DB:"+ choiceId);
      return inventory[i]
    }
  }
  return null;
}

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
    // quantity is the amount the user is requesting
    //amtNeeded is the information from the database regarding the item requested
  
    var quantity = parseInt(inquirerResponse.quantity);
    var curStockLevel = parseInt(amtNeeded.stock_quantity);
    var itemToPurchase = amtNeeded.item_id;
    console.log ("I wish to purchase " + itemToPurchase);

    if(quantity > curStockLevel){
      console.log("sorry we don't have enough. Please make another selection");
      afterConnection();

    }
    else{

      // Here we are subtracting the requested amount from the to level
      newStockLvl = (curStockLevel-quantity);
      debtInventory(itemToPurchase, newStockLvl);
      
    }
  })
}
//Here we are passing in the product we wish to purchase and the new stock level
function debtInventory(reqProduct, newStockLvl){

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
      //console.log(res.affectedRows + "Product updated")
    }
    
    );
    afterConnection();
    
    
  
}