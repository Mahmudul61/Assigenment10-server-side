const express = require('express')
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config()
const app = express()
const port = process.env.PORT || 3000


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DV_USER}:${process.env.DV_PASS}@cluster0.xwc4gtj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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

    await client.connect();
    const reacipiMaker = client.db('recipeDB').collection('recipe')
    const userRecipi = client.db('recipeDB').collection('userrecipi')

    app.post('/AddRecipe',async(req, res) =>{
      const newRecipe = req.body;
      console.log(newRecipe);
      const result = await reacipiMaker.insertOne(newRecipe);
      
        const myRecipe = { ...newRecipe, recipeId: result.insertedId };
      const resultMy = await userRecipi.insertOne(myRecipe);
      res.send(result ,resultMy)
    })

  

    app.get( '/AllRecipes', async(req ,res) =>{
      const getrecipi = await reacipiMaker.find().toArray()
      res.send(getrecipi)
    })

    app.get('/AllRecipes/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const recipe = await reacipiMaker.findOne(query);

 
  res.send(recipe); 
});


app.put('/AllRecipes/:id' ,async(req ,res) =>{
     const id =req.params.id;
     const query = { _id: new ObjectId(id) }
     const updatedRecipe = req.body
     const update={
      $set: updatedRecipe
     }
     const result =await reacipiMaker.updateOne(query , update)
     res.send(result)
})





        app.get("/myRecipes/:email", async (req, res) => {
      const email = req.params.email ;
      const recipes = await userRecipi.find({ userEmail: email }).toArray();
      res.send(recipes);
    });


    // const { ObjectId } = require("mongodb");

app.delete("/AllRecipes/:id", async (req, res) => {
   const id = req.params.id;
   try {
     const query = { _id: new ObjectId(id) };
     const result = await reacipiMaker.deleteOne(query);
     res.send(result);
   } catch (error) {
     res.status(400).send({ error: "Invalid ID format" });
   }
});



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('My rannar reacipi all!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


