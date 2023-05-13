const express = require("express");
require("./connectDB");
const Cart = require("./cartSchema");
const Farmer = require('./farmerSchema');
const User = require('./userSchema');
const Item = require("./itemSchema");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

// Add Cart Item
app.post("/api/addCartItem/:key1/:key2", async (req, res) => {
  try {
    let data = await Cart.findOne({userId: req.params.key1});
    if(!data){
      data = await Cart({userId: req.params.key1});
    }
    data.itemsId.push(req.params.key2)
    let result = await data.save({ writeConcern: { w: 'majority' } } );
    console.log(result);
    res.status(200).send(result);
  } catch (error) {
    res.status(400);
  }
});


// Show Cart Item
app.get("/api/showCartItem/:key", async (req, res) => {
  try {
    let data = await Cart.findOne({ userId: req.params.key });
    res.status(200).send(data);
  } catch (error) {
    res.status(400);
    console.log(error);
  }
});


// Delete Cart Item
app.delete("/api/deleteCartItem/:key1/:key2", async (req, res) => {
  try {
    const key = req.params.key2;
    const item = await Cart.findOne({ userId: req.params.key1 });
    if (!item) {
      return res.status(200).send({ message: "Item not found!" });
    }
    const updatedItems = item.itemsId.filter((id) => id !== key);
    item.itemsId = updatedItems;
    await item.save({ writeConcern: { w: 'majority' } } );
    res.status(201).send({ message: "Item deleted successfully!" });
  } catch (error) {
    res.status(400);
  }
});



// -------------------------------------------------------

// SignUp
app.post("/api/farmer/signup", async(req,res)=>{
    try{
        let data = Farmer(req.body);
        let result = await data.save();
        console.log(result);
        res.send(result);
    } catch(error){
        res.status(500).send('Something went wrong!');
        console.log(error);
    }
});


// Login
app.get("/api/farmer/login/:email/:password", async(req, res)=>{
    try{
        let data = await Farmer.findOne({email :req.params.email, password: req.params.password});
        if(!data){
            res.status(300);
            res.send("Login Unsuccessful");
        }
        else{
            res.status(302).send(data);
        }
    } catch(error){
        res.status(500).send('Something went wrong!');
    }
});


// Get Farmer Data using its Id
app.get("/api/farmer/getFarmerData/:key", async(req, res)=>{
    try{
        let data = await Farmer.findOne({_id :req.params.key});
        res.status(400).send(data);
    } catch(error){
        res.status(500).send('Something went wrong!');
    }
});

// -------------------------------------------------------------------------------------


// Add Item
app.post("/api/addItem", async (req, res) => {
    try {
      let data = Item(req.body);
      let result = await data.save({ writeConcern: { w: 'majority' } });
      console.log(result);
      res.status(400).send(result);
    } catch (error) {
      res.status(500);
    }
  });
  
  // Get Item Data By Category
  app.get("/api/getItemData/:key", async (req, res) => {
    try {
      let data = await Item.find({ category: req.params.key });
      res.status(400).send(data);
    } catch (error) {
      res.status(500).send("Something went wrong!");
    }
  });
  
  // Get Item Data By Id
  app.get("/api/getIdItemData/:key", async (req, res) => {
    try {
      let data = await Item.findOne({ _id: req.params.key });
      res.status(200).send(data);
      console.log(data);
    } catch (error) {
      res.status(500).send("Something went wrong!");
      console.log(error);
    }
  });
  
  // Get Farmer Dashboard Data
  app.get("/api/farmerdashboard/getItemData/:key", async (req, res) => {
    try {
      let data = await Item.find({ farmerId: req.params.key });
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send("Something went wrong!");
    }
  });
  
  // Delete Item
  app.delete("/api/farmerdashboard/getItemData/delete/:key", async (req, res) => {
    try {
      let data = await Item.deleteOne({ _id: req.params.key }, { writeConcern: { w: 'majority' } }); // Explicitly set write concern to 'majority'
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send("Something went wrong!");
    }
  });
  
  
  // Update Item
  app.put("/api/farmerdashboard/getItemData/update/:_id", async (req, res) => {
    // console.log(req.params); // req.params here stores id in object
    try {
      let data = await Item.updateOne(
        // {condition in object}, {$set:}
        req.params, // req.params -> already an object
        {
          $set: req.body,
        },
        { writeConcern: { w: 'majority' } } // Explicitly set write concern to 'majority'
      );
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send("Something went wrong!");
    }
  });

  
  // ------------------------------------------------------------------------------------------------------------


  

// SignUp
app.post("/api/user/signup", async(req,res)=>{
    try{
        let data = User(req.body);
        let result = await data.save({ writeConcern: { w: 'majority' } } );
        console.log(result);
        res.send(result);
    } catch(error){
        console.log(error);
        
    }
});


// Login

app.get("/api/user/login/:email/:password", async(req, res)=>{
    try{
        let data = await User.findOne({email :req.params.email, password: req.params.password});
        if(!data){
            res.status(200);
            res.send("Login Unsuccessful");
        }
        else{
            res.status(202).send(data);
        }
    } catch(error){
        res.status(500).send('Something went wrong!');
        console.log(error);
    }
});

  
  


app.listen(80,()=>{
    console.log("Server is listeneing on port 80");
});
