require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Environment variables setup
const MongoDB_URI = process.env.MONGODB_URI

// Connect to MongoDB
mongoose.connect(MongoDB_URI)
  .then(() => console.log('MongoDB Connected')) // Log success message
  .catch(err => console.error('MongoDB Connection Error:', err)); // Log error message


// Set up server
const PORT = process.env.PORT || 3000;
// Listen for incoming requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Define a schema based on the database structure
const activitySchema = new mongoose.Schema({
   "time": String,
   "task": String,
   "duration_minutes": Number,
   "calories_burnt": Number
});

// Define a model based on the schema
const Item = mongoose.model('Activity', activitySchema);


// Example CRUD operations


// Endpoint to get all items
app.get('/items', (req, res) => {
  Item.find()
    .then(items => {
      console.log("OK")
      return res.json(items);
    })
    .catch(err => console.error(err));
});

// Endpoint to get a specific item by ID
app.get('/items/:id', (req, res) => {
  const id = req.params.id;
  Item.findById(id)
    .then(item => res.json(item))
    .catch(err => console.error(err));
});

// Endpoint to add a new item
app.post('/items', (req, res) => {
  const newItem = new Item(req.body);
  newItem.save()
    .then(item => res.json(item))
    .catch(err => console.error(err));
});

// Endpoint to update an existing item
app.put('/items/:id', (req, res) => {
  const id = req.params.id;
  Item.findByIdAndUpdate(id, req.body, { new: true })
    .then(item => res.json(item))
    .catch(err => console.error(err));
});

// Endpoint to delete an existing item
app.delete('/items/:id', (req, res) => {
  const id = req.params.id;
  Item.findByIdAndDelete(id)
    .then(item => res.json(item))
    .catch(err => console.error(err));
});
