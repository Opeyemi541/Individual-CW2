const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());

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

MongoClient.connect('mongodb+srv://Yusuf:12345@cluster0.iiaahgn.mongodb.net/?retryWrites=true&w=majority', (err, client)=> {
    db = client.db('Lessons');
})

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
app.post("/orders", (req, res) => {
  const newOrder = req.body;
  orders.push(newOrder);
  res.json(orders);
});
  
  // PUT Route to update number of available spaces in lesson
  app.put("/lessons/:subject/:location", (req, res) => {
    const { subject, location } = req.params;
    const updatedLesson = lessons.find(
      lesson => lesson.subject === subject && lesson.location === location
    );
  
    if (updatedLesson) {
      updatedLesson.availableSpaces -= 1;
      res.json(updatedLesson);
    } else {
      res.status(404).send("Lesson not found");
    }
  });

  //search    
    app.get('/search', (req, res) => {
      const query = req.query.q; 
      
      // perform the search using MongoDB
      const searchResults = lessons.filter((lessons) =>
    lessons.id.toLowerCase().includes(query.toLowerCase())
  );

  res.json(searchResults);
});
  
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
