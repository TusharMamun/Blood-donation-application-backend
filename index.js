// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());
// data base Connection with mondodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mongodb-digitalshop.vq7pmww.mongodb.net/?appName=Mongodb-DigitalShop`;

// / Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
const db = client.db("Blood_Donation_Application_DB")
// All colleciton of mongodb
const allRegisteredDonorInfo = db.collection("allRegisteredDonorInfo")

// allRegisteredDonorInfo Api
app.post('/regesterDoner',async(req,res)=>{

})



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error

  }
}
run().catch(console.dir);







// routes
app.get("/", (req, res) => {
  res.send("Blood Donation API running ✅");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// example POST route (test)
app.post("/echo", (req, res) => {
  res.json({ received: req.body });
});


app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
