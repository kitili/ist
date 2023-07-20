const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const dataFilePath = './data.json';

// Helper function to read data from the JSON file
function readDataFile() {
  return JSON.parse(fs.readFileSync(dataFilePath));
}

// Helper function to write data to the JSON file
function writeDataFile(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// API endpoint to get all data
app.get('/api/data', (req, res) => {
  const data = readDataFile();
  res.json(data);
});

// API endpoint to add or edit data
app.post('/api/data', (req, res) => {
  const data = readDataFile();
  const { name, age } = req.body;
  const newData = { name, age };

  // If the name already exists, update the data
  const existingDataIndex = data.findIndex(d => d.name === name);
  if (existingDataIndex !== -1) {
    data[existingDataIndex] = newData;
  } else {
    // Otherwise, add new data
    data.push(newData);
  }

  writeDataFile(data);
  res.json({ message: 'Data saved successfully.' });
});

// API endpoint to delete data
app.delete('/api/data/:name', (req, res) => {
  const data = readDataFile();
  const nameToDelete = req.params.name;

  const newData = data.filter(d => d.name !== nameToDelete);
  writeDataFile(newData);
  res.json({ message: 'Data deleted successfully.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
