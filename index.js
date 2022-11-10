const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.b4qhmp5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const servicesCollection = client.db("TourGuideReview").collection("services");
        const reviewCollection = client.db("TourGuideReview").collection("reviews");

        app.post('/services', async(req, res) =>{
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result)
        })

        app.get('/services', async(req, res) =>{
            const query = {}
            const services = servicesCollection.find(query).limit(3);
            const result = await services.toArray();
            res.send(result)
        })
        
        app.get('/servicesAll', async(req, res) =>{
          const query = {}
          const services = servicesCollection.find(query);
          const result = await services.toArray();
          res.send(result)
      })

        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)}
            const result = await servicesCollection.findOne(query);
            res.send(result);
        })

      // ----------------------- Review part -------------------------------------

      app.post('/reviews', async(req, res) =>{
        const service = req.body;
        const result = await reviewCollection.insertOne(service);
        res.send(result)
      })

      // ------------------------- Review get by ID query ------------------------- 

      app.get('/review/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await reviewCollection.findOne(query);
        res.send(result)
      })

      app.get('/review', async(req, res) =>{
        let query= {}
        if(req.query.ServiceId){
          query={
            ServiceId : req.query.ServiceId
          }
        }
        const services = reviewCollection.find(query).sort({Time: -1});
        const result = await services.toArray();
        res.send(result)
      })

      //----------------------- Review with email query -----------------------------
      app.get('/reviews', async(req, res) =>{
        let query= {}
        if(req.query.UserEmail){
          query={
            UserEmail : req.query.UserEmail
          }
        }
        const services = reviewCollection.find(query).sort({Time: -1});
        const result = await services.toArray();
        res.send(result)
      })

      // ----------------- delete ---------------------------------------

      app.delete('/review/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await reviewCollection.deleteOne(query);
        res.send(result)
      })

      app.get('/update/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await reviewCollection.findOne(query);
        res.send(result)
      })

      //------------------------- update -----------------------
      app.put('/review/:id', async(req, res) =>{
        const id = req.params.id;
        const filter = {_id: ObjectId(id)};
        const Data = req.body;
        const option ={upsert:true}
        const updatedData = {
          $set:{
            reviewText:Data.review
          }
        }
        const result = await reviewCollection.updateOne(filter, updatedData, option);
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