const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.b4qhmp5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const servicesCollection = client.db("TourGuideReview").collection("services");

        app.post('/services', async(req, res) =>{
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result)
        })

        app.get('/services', async(req, res) =>{
            const query = {}
            const services = servicesCollection.find(query);
            const result = await services.toArray();
            res.send(result)
        })

    } 
    finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})