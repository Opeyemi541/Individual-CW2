const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

//logger middleware that output all requests to the server console
app.use((req, res, next) => {
  console.log(`${req.method} request made to ${req.url}`);
  next();
});

// Sets up the path where your static files are
var publicPath = path.resolve(__dirname, "public");

app.use(express.static(publicPath));

app.use((req, res, next) => {
  const error = new Error('File not found');
  error.status = 404;
  next();
});

//connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
let db;

// MongoClient.connect('mongodb+srv://Yusuf:12345@cluster0.iiaahgn.mongodb.net/?retryWrites=true&w=majority', (err, client)=> {
//     db = client.db('Lessons');
//     lessonCollection = db.collection("Lesson Information");
//     orderCollection = db.collection("Order");
// });
const url = 'mongodb+srv://Yusuf:12345@cluster0.iiaahgn.mongodb.net';
const client = new MongoClient(url);

async function run() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Access a database and collection
    const database = client.db('Lessons');
    const collection = database.collection('Order');
    

    // Perform database operations
    const result = await collection.insertOne({ name: 'example' });
    console.log(result);
  } catch (e) {
    console.error(e);
  } finally {
    // Close the client
    await client.close();
   }
}

run().catch(console.error);


//display a message for root path to show that API is workig
app.get('/', (req, res, next)=>{
  res.send('Select a collection, e.g., /collection/messages')
}) 


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// GET Route for lessons
const lessons = require('./lessons.js');

app.get("/lessons", (req, res) => {
  console.log(lessons);
  res.json(lessons);
});
  
// POST Route to save new order
app.post('/orders', async (req, res) => {
  try {
    // Connect to the MongoDB database
    await client.connect();
    const db = client.db('Lessons');
    const collection = db.collection('Order');

    // Insert a new document into the collection
    const result = await collection.insertOne(req.body);
    res.status(201).json({ message: 'Order created successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    // Close the database connection
    await client.close();
  }
});
  
  // PUT Route to update number of available spaces in lesson
  app.put("/lessons/:Subject/:Location", (req, res) => {
    const { subject, location } = req.params;
    const updatedLesson = lessons.find(
      lessons => lessons.Subject === subject && lessons.Location === location
    );
  
    if (updatedLesson) {
      updatedLesson.Space -= 1;
      res.json(updatedLesson);
    } else {
      res.status(404).send("Lesson not found");
    }
  });

  //search    
  app.get("/search", (req, res) => {
    let search_keyword = req.query.search;
    req.Lessons.find({}).toArray((err, results) => {
      if (err) return next(err);
      let filteredList = results.filter((subject) => {
        return (
          subject.subjectname
            .toLowerCase()
            .match(search_keyword.toLowerCase()) ||
          subject.location.toLowerCase().match(search_keyword.toLowerCase())
        );
      });
      res.send(filteredList);
    });
  });


  
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
