const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const cors = require('cors'); 
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World, I am Developer!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v9gjy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection err', err);
  const serviceCollection = client.db("jagoronacademy").collection("services");
  const orderCollection = client.db("jagoronacademy").collection("orders");
  const adminCollection = client.db("jagoronacademy").collection("admin");
  const reviewCollection = client.db("jagoronacademy").collection("review");
  // perform actions on the collection object

  app.get('/services', (req, res) => {
    serviceCollection.find({})
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.get('/services/:id', (req, res) => {
    const id = req.params.id;
    serviceCollection.find({ _id: ObjectId(id) })
      .toArray((err, item) => {
        res.send(item[0])
      })
  })

  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('added a service: ', newService);
    serviceCollection.insertOne(newService)
      .then(result => {
        console.log('one inserted', result.insertedCount)
        res.send(res.insertedCount > 0)
      })
  })

  ////
  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    console.log('added a product: ', newOrder);
    orderCollection.insertOne(newOrder)
      .then(result => {
        console.log('one inserted', result.insertedCount)
        res.send(res.insertedCount > 0)
      })
  })

  app.get('/orderlist', (req, res) => {
    orderCollection.find({})
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.get('/orderlist/:email', (req, res) => {
    const email = req.params.email;
    orderCollection.find({ email: email })
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.post('/addAdmin', (req,res)=>{
    const adminNew = req.body.email;
    adminCollection.insertOne({email:adminNew})
    .then(result =>{
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/isAdmin', (req, res) =>{
    const email = req.body.email;
    adminCollection.find({email: email})
    .toArray((err, admin) => {
      res.send(admin.length > 0);
    }) 
  })

  app.get('/review', (req, res) => {
    reviewCollection.find({})
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    console.log('added a service: ', newReview);
    reviewCollection.insertOne(newReview)
      .then(result => {
        console.log('one inserted', result.insertedCount)
        res.send(res.insertedCount > 0)
      })
  })
  // client.close();
});




app.listen(process.env.PORT || port)