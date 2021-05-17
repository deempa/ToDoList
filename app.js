const bodyParser = require("body-parser");
const e = require("express");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/ToDoListDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
    name: String
};

const Item = mongoose.model(
    "Item", itemsSchema
);

app.get("/", function(req, res){
     Item.find({}, function(err, foundItems){
            res.render("list", {day: "Today", items: foundItems});
     });    
});

app.get("/about", function(req, res){
    res.render("about");
});

app.post("/", function(req, res){
    let itemName = req.body.newItem;
    if(itemName === ""){
        res.redirect("/");
    }
    else{
        const item = new Item({
            name: itemName
        });
        item.save();
        res.redirect("/");
    }
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, function(err){
        if(err) console.log(err);
    });
    res.redirect("/");
});

app.listen(3000, function(){
    console.log("Port 3000 is listening");
})