const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const date = require(__dirname + '/date.js');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));

const lists = [];
const worklist = [];

app.get('/', (req, res) => {
  const day = date.getdate();

  res.render('list', { date: day, lists: lists});
});

app.post('/', (req, res) => {
  
  if (req.body.btn === 'Work') {
    worklist.length = 0;
    res.redirect('/work');
  } else {
    if (!req.body.list) {
      lists.length = 0;
      res.redirect('/');
    } else {
      let list = req.body.list;
      if (req.body.button === 'Work') {
        worklist.push(list);
        res.redirect('/work');
      } else {
        lists.push(list);
        res.redirect('/');
      }
    }
  }

  
});

app.get('/work', (req, res) => {
  res.render('list', { date: 'Work List', lists: worklist});
});

app.listen(3000, () => {
  console.log('Server Started with the port no 3000');
});
