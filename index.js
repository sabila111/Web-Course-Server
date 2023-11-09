const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port =process.env.PORT || 5000

// middleware
app.use(cors({
  origin:[
    // 'http://localhost:5173/',
    'https://web-course-project-4613a.web.app',
    'https://web-course-project-4613a.firebaseapp.com'
  ],
  credentials: true
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
    // await client.connect();

    const jobsCollections = client.db("jobsDB").collection("jobs")
    
    const bidsCollections = client.db("jobsDB").collection("bids")

    

  //   app.get('/jobs', async(req, res) =>{
  //    console.log(req.query.email)
  //    let query = {}
  //    if(req.query?.category){
  //     query ={category: req.query.category}
  //    }
  //     const cursor =jobsCollections.find(query)
  //     const result = await cursor.toArray()
  //     res.send(result)
  // })

   app.get('/jobs', async(req, res)=>{
    console.log(req.query)
    const cursor =jobsCollections.find()
      const result = await cursor.toArray()
      res.send(result)
   })

   app.get('/bids', async(req, res)=>{
    console.log(req.query)
    const cursor =jobsCollections.find()
      const result = await cursor.toArray()
      res.send(result)
   })

    app.get('/jobs/:id' , async(req, res) =>{

        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await jobsCollections.findOne(query)
        console.log('Result from MongoDB query', result);
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
    
    app.get('/bids/:id' , async(req, res) =>{

      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      console.log('get the data', query);
      const result = await jobsCollections.findOne(query)
      console.log('Result from MongoDB query', result);
      res.send(result)
  })

    app.get('/job/:category' , async(req, res) =>{

      const category = req.params.category;
      const cursor = jobsCollections.find({category:category})
     
      const result = await cursor.toArray()
      
      res.send(result)
  })  

 

    app.post('/jobs', async(req, res) =>{

        const job = req.body;
        const result = await jobsCollections.insertOne(job)
        res.send(result)
       })
    app.post('/bids', async(req, res) =>{

        const job = req.body;
        const result = await bidsCollections.insertOne(job)
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