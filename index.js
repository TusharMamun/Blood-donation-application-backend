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
const allRegisteredDonorInfoCollection = db.collection("allRegisteredDonorInfo")

// allRegisteredDonorInfo Api
app.post('/regesterDoner',async(req,res)=>{
const userInfo = req.body;
const result = await allRegisteredDonorInfoCollection.insertOne(userInfo)
res.send(result)
})
// get all  user
app.get("/regesterDoner", async (req, res) => {
  try {
    const { status = "all", search = "", page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const query = {};

    // ✅ filter by status
    if (status !== "all") {
      query.status = status; // "active" or "blocked"
    }

    // ✅ search by name/email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await allRegisteredDonorInfoCollection.countDocuments(query);

    const result = await allRegisteredDonorInfoCollection
      .find(query)
      .sort({ updatedAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .toArray();

    res.send({
      result,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});





app.get('/profile/:email', async(req,res)=>{
  const email = req.params.email
  const result =await allRegisteredDonorInfoCollection.findOne({email})
res.send(result)
})




app.put("/update/profile", async (req, res) => {
  try {
    const { email, name, district, upazila, photoUrl } = req.body;

    if (!email) {
      return res.status(400).send({ message: "email is required" });
    }

    const filter = { email };

    const updateDoc = {
      $set: {
        email,
        name,
        district,
        upazila,
        photoUrl: photoUrl,
        updatedAt: new Date(),
      },
    };

    const result = await allRegisteredDonorInfoCollection.updateOne(
      filter,
      updateDoc,
      { upsert: true }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});




// getUserRoll 


app.get('/regesterDoner/role/:email', async(req,res)=>{
  const email = req.params.email
  const result =await allRegisteredDonorInfoCollection.findOne({email})
res.send(({role:result?.role}))
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
