const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

// categories
const categories = require('./data/brands.json');
const items = require('./data/items.json');

app.get('/', (req, res) => {
  res.send('Brand shop server is Running!')
})

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.fikwith.mongodb.net/?retryWrites=true&w=majority`;

// const uri = "mongodb+srv://<username>:<password>@cluster0.fikwith.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('productDB').collection('products');

    // send all data
    app.get('/products', async(req, res)=>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // 
    app.get('/products/:id', async(req, res)=>{
      const id = req.params.id;
      const query ={_id : new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    })


    // delete
    app.delete('/products/:id', async(req, res)=>{
      const id = req.params.id;
      const query ={_id : new ObjectId(id)};
      const result = await productCollection.deleteOne(query);
      res.send(result);

    })

    

    // add a single data
    app.post('/products', async(req, res)=>{
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Brand shop server is running on port ${port}`)
})