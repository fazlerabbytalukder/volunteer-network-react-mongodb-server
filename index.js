const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;



//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cnnr8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run() {
    try {
        await client.connect();
        // console.log('database connect successfully');
        const database = client.db("volunteer");
        const eventCollection = database.collection("events");
        const RegUserCollection = database.collection("regUser");

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = eventCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //GET API With id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await eventCollection.findOne(query);
            res.json(service);
        })
        //ADD REG USER API
        app.post('/regUser', async (req, res) => {
            const regUser = req.body;
            const result = await RegUserCollection.insertOne(regUser);
            res.json(result);
        })
        //ADD new event
        app.post('/services', async (req, res) => {
            const services = req.body;
            const result = await eventCollection.insertOne(services);
            res.json(result);
        })




    } finally {
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('i am from volunteer server');
})

app.listen(port, () => {
    console.log('running server on port', port);
})