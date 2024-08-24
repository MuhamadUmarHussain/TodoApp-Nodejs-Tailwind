const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/Todo');

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = new mongoose.model('Item', itemSchema);


const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = new  mongoose.model('List', listSchema);

async function addNewItem(new_item){
  try{
    const items = new Item({
      name: new_item
    });
    await items.save();
    console.log("Sucessfully Added");
  }catch(err){
    console.log(err); 
  }
}


async function newList(listName, listItem) {
  try {

    const list = await List.findOne({ name: listName });
    if (list) {
      const newItem = { name: listItem };
      list.items.push(newItem);
      await list.save();
      console.log("Successfully added");
    } else {
      const new_list = new List({
        name: listName
      })
      new_list.save();
    }
  } catch (err) {
    console.log(err);
  }
}






app.get('/', async (req, res) => {
  const day = date.getdate();

  try {
    const lists = await Item.find(); // Await the promise inside the async function
    res.render('list', { date: day, lists: lists});
  } catch (err) {
    console.log(err); 
  }
});

app.post('/', (req, res) => {
  let listName = req.body.button;
  let listItem = req.body.list;
  let clear = req.body.btn;
  let Today = date.getday();

  if (_.lowerCase(listName) === _.lowerCase(Today)) {
    addNewItem(listItem);
    res.redirect('/');
  } else {
    if (listItem) {
      newList(listName, listItem);
    } else {
      console.log("Item cannot be empty.");
    }
    res.redirect("/" + listName);
  }
});



app.post('/delete', async (req, res) => {
  let id = req.body.checkbox;
  let listName = req.body.val;

  let Today = date.getdate();


  if(_.lowerCase(listName) === _.lowerCase(Today)){
    try {
      await Item.deleteOne({ _id: id });
      console.log("Successfully Deleted");
      res.redirect("/");
  } catch (err) {
      console.log("Error during deletion:", err);
      res.status(500).send("Error occurred during deletion.");
  }
  }else{
    try{
      await List.findOneAndUpdate(
        {name: listName},
        {$pull: {items: {_id: id}}}
      );
      console.log("Sucessfully Deleted");
      res.redirect('/'+ listName);
    }catch(err){
      console.log(err);
      
    }
  }

  
});





app.get('/:route', async (req, res) => {
  let route_name = req.params.route;
  
  try {
    const list = await List.findOne({ name: route_name });

    if (list) {
      const itemListNames = list.items;

      res.render('list', { date: route_name, lists: itemListNames });
    } else {
      res.render('list', { date: route_name, lists: [] });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while fetching the list.");
  }
});



app.listen(3000, () => {
  console.log('Server Started with the port no 3000');
});
