const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fikwith.mongodb.net/?retryWrites=true&w=majority`;

// const uri = "mongodb+srv://<username>:<password>@cluster0.fikwith.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    

    const productCollection = client.db("productDB").collection("products");

    const cartCollection = client.db("productDB").collection("addedProducts");

   
    const brandCollection = client.db("productBD").collection("brands");
    
    //  brand collection Api
    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // send all product data
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get a special product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const  query ={_id : new ObjectId(id)};
      const options ={upsert: true};
      const result = await productCollection.findOne(query, options);
      // console.log("result inside server", result);
      res.send(result);
    });

    // added product to cart 
    app.post('/carts', async(req, res)=>{
      const cartProduct = req.body;
      const result = await cartCollection.insertOne(cartProduct);
      res.send(result)
    })

    // get all added products
    app.get('/carts', async(req, res)=>{
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

      //  delete from cart api
      app.delete('/carts/:id', async(req, res)=>{
      const id = req.params.id;
      const query ={_id : new ObjectId(id)};
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })


    // add a single data
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    // update a single product
    app.put('/products/:id', async(req, res)=>{
        const id = req.params.id;
        const product = req.body;
        const filter ={_id: new ObjectId(id)}
        const options ={upsert: true}
        const updatedProduct = {
          $set:{
             brand:product.brand,
             name:product.name,
             price: product.price,
             type: product.type,
             photo:product.photo,
             rating:product.rating
          }
        }
        const result = await productCollection.updateOne(filter,updatedProduct,options);
        res.send(result)
    })


 


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Brand shop server is Running!");
});

app.listen(port, () => {
  console.log(`Brand shop server is running on port ${port}`);
});

