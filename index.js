const express = require("express");
const cors = require('cors')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
//  middleware

app.use(cors());
app.use(express.json())

console.log(process.env.DB_USER)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rbfkgiq.mongodb.net/?retryWrites=true&w=majority`;

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




    const products = client.db("roboTech").collection("products");
    const userCollection = client.db("roboTech").collection("users");
    const cartCollection = client.db("roboTech").collection("carts");

    app.post('/users', async(req, res)=>{
      const users = req.body
      const result = await userCollection.insertOne(users)
      res.send(result)
    })
   
   
   
    app.get('/products', async(req, res)=>{
      const cursor = products.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/products/:id', async(req, res)=> {
      const id = req.params.id 
      const query = { _id : new ObjectId(id)}
      const result = await products.findOne(query)
      res.send(result)
    })

    app.get('/carts', async(req, res)=>{
      const email = req.query.email 
      if(!email){
        res.send([])
      }
      const query = {email : email}
      const result = await cartCollection.find(query).toArray()
      res.send(result)
    })


    // app.post('/carts', async (req, res) => {
    //   const item = req.body;
    //   const existingItem = await cartCollection.findOne({ toyItem: item.toyId });
    //   if (existingItem) {
    //     res.send("Already Exist")
    //   } else {
    //     const result = await cartCollection.insertOne(item);
    //     res.json(result);
    //   }
    // });

    app.post('/carts', async(req, res)=>{
      const item = req.body
      const result = await cartCollection.insertOne(item)
      res.send(result)
    })

    app.delete('/carts/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)};
      const result = await cartCollection.deleteOne(query)
      res.send(result)
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


app.get('/', (req, res)=> {
    res.send('Robo Tech is Running')
})

app.listen(port, ()=> {
    console.log(`Robo Tech server is Running on port ${port}`)
})