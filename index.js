// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
const AllblodDonationRequest = db.collection("BlodeDonationRequest")

// allRegisteredDonorInfo Api
app.post('/regesterDoner',async(req,res)=>{
const userInfo = req.body;
const result = await allRegisteredDonorInfoCollection.insertOne(userInfo)
res.send(result)
})
// Payment intregratin in script 








// Creat  request Data
app.post('/CreatedBloadDonation',async(req,res)=>{
const RequestedInfo = req.body;
const result = await AllblodDonationRequest.insertOne(RequestedInfo)
res.send(result)   
})
app.get('/all-dontionrequest',async(req,res)=>{

})



// get All request data  FOR PENDIN REQUEST
app.get("/donation-requests", async (req, res) => {
  try {
    const { status } = req.query;

    const query = {};
    if (status) query.status = status; // pending/approved/done/cancelled

    const result = await AllblodDonationRequest
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

app.get("/blood-donation-requests", async (req, res) => {
  try {
    const { status, bloodGroup, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (bloodGroup) query.bloodGroup = bloodGroup;

    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: "i" } },
        { hospitalName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [result, total] = await Promise.all([
      AllblodDonationRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .toArray(),
      AllblodDonationRequest.countDocuments(query),
    ]);

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

// Get Donattion details page
app.get("/blood-donation-requests/:id", async (req, res) => {

  const result = await AllblodDonationRequest.findOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
});






// my requests 
app.get("/my-blood-donation-requests", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).send({ message: "email is required" });
    }

    const result = await AllblodDonationRequest
      .find({ 
requesterEmail:email })
      .sort({ createdAt: -1 })
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});













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
