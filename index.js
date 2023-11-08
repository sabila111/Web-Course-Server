const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port =process.env.PORT || 5000

// middleware
app.use(cors({
  origin:[
    'http://localhost:5173/'
  ],
  credentials:true
}))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.blfnlbm.mongodb.net/?retryWrites=true&w=majority`;

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

    const jobsCollections = client.db("jobsDB").collection("jobs")
    
    
    app.post('/jwt', async(req, res)=>{

      const user = req.body
      console.log('user token', user)
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'10h'})
      res.cookie('token', token, {
        httpOnly:true,
        secure:true,
        sameSite:'none'
      })
      res.send({success:true})
    })

    app.post('/logout', async(req, res)=>{

      const user = req.body
      res.clearCookie('token', {maxAge:0}).send({success:true})
    })


    app.get('/jobs', async(req, res) =>{
     
        const cursor =jobsCollections.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/jobs/:category' , async(req, res) =>{

      const category = req.params.category;
      const cursor = jobsCollections.find({category:category})
     
      const result = await cursor.toArray()
      
      res.send(result)
  })

    app.get('/jobs/:id' , async(req, res) =>{

        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        console.log('get the data', query);
        const result = await jobsCollections.findOne(query)
        console.log('Result from MongoDB query', result);
        res.send(result)
    })
    
     

    app.post('/jobs', async(req, res) =>{

        const job = req.body;
        const result = await jobsCollections.insertOne(job)
        res.send(result)
       })
    
    app.delete('/jobs/:id',async(req, res) =>{

        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await jobsCollections.deleteOne(query)
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('job is available')
  })
  
  app.listen(port, () => {
    console.log(`job is running on port ${port}`)
  })