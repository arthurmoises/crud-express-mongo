const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())

var db;

MongoClient.connect('mongodb://arthurborges.dev:4gcnscgy@ds235860.mlab.com:35860/controle-estoque',
  { useNewUrlParser: true },
  (err, client) => {

    if (err) return console.log(err)
    db = client.db('controle-estoque')
    app.listen(3000, function() {
      console.log('listening on 3000')
    })
})

app.get('/', (req, res) => {
  var cursor = db.collection('estoque').find().toArray(function(err, result) {
    if (err) console.log(err);
    res.render('index.ejs', {quotes: result});
  });
})

app.put('/quotes', (req, res) => {
  db.collection('estoque')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('estoque').findOneAndDelete(
    { name: req.body.name}, (err, result) => {
      if (err) return res.send(500, err)
      res.send({message: 'A darth vadar quote got deleted'})
    })
})

app.post('/quotes', (req, res) => {
  db.collection('estoque').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})
