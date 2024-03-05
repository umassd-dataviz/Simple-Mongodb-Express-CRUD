const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Endpoint to get all items
app.get('/items', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(JSON.parse(data));
  });
});




// Endpoint to get one item
app.get('/items/:id', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // get the item with the matching ID
    const item = JSON.parse(data).find(item => item.id === parseInt(req.params.id));
    if (!item) {
      res.status(404).send('Item not found');
      return;
    }
    else{
      res.json(item);
    }
  });
});



// Endpoint to add a new item
app.post('/items', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      // Parse the read data into JSON data
      const items = JSON.parse(data);
      // Get the new item from the request body
      const newItem = req.body;
      
      // Auto-increment ID (for simplicity)
      newItem.id = items.length + 1; 
      
      //Add the new item to the array of the read data
      items.push(newItem);
      
      // Write the updated data back to the data.json file
      fs.writeFile('data.json', JSON.stringify(items), 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
          return;
        }
        // Return a success message
        res.status(201).send('Item created successfully');
      });
    });
  });
  

  // Endpoint to delete an item
app.delete('/items/:id', (req, res) => {

    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      const items = JSON.parse(data);
      const itemId = parseInt(req.params.id);
      items= items.filter(item => item.id !== itemId);
      fs.writeFile('data.json', JSON.stringify(items), 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
          return;
        }
        res.status(200).send('Item deleted successfully');
      });
    })});
  
  
    // Endpoint to update an item
app.put('/items/:id', (req, res) => {

  const itemId = parseInt(req.params.id);

  if (!itemId) {
    res.status(400).send('Invalid item ID');
    return;
  }

  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    let items = JSON.parse(data);
    const index = items.findIndex(item => item.id === itemId);

    if (index === -1) {
      res.status(404).send('Item not found');
      return;
    }

    if("id" in req.body) items[index] = req.body
    else  items[index] = {...req.body, id: itemId};
    fs.writeFile('data.json', JSON.stringify(items), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.status(200).send('Item updated successfully');
    });
  });
});

  