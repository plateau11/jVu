const express = require('express');
const app = express();
const Chart = require('chart.js');
const path = require('path');
const bodyParser = require('body-parser');

const directory = path.join(__dirname, '../public');
app.use(express.static(directory));

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let jsonData = [];

// Middleware for parsing JSON
app.use(bodyParser.json());

// Route handler for processing the JSON object
app.post('/processJson', (req, res) => {
  jsonData = req.body;

  // Process the JSON object as needed
  console.log(jsonData);

  // Send a response back to the client
  res.sendStatus(200);
});

// Route handler for the chart page
app.get('/chart', (req, res) => {
  let names = [];
  let values = [];

  // Check if jsonData is an array
  if (Array.isArray(jsonData)) {
    names = jsonData.map(item => item.name);
    values = jsonData.map(item => item.value);
  } else {
    // Extract names and values manually from jsonData
    names = Object.keys(jsonData);
    values = Object.values(jsonData);
  }

  // Create the chart configuration
  const chartConfig = {
    type: 'bar',
    data: {
      labels: names,
      datasets: [
        {
          label: 'Values',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Bar Chart from JSON Data'
        }
      }
    }
  };

  // Render the chart page using EJS template
  res.render('chart', { chartConfig });
});

// Route handler for the input page
app.get('/input', (req, res) => {
  res.render('input');
});

// Redirect to the chart page after submitting JSON data
app.post('/input', (req, res) => {
  // Process the submitted JSON data if needed
  console.log(req.body);

  // Redirect to the chart page
  res.redirect('/chart');
});

// Route handler for the homepage (root URL)
app.get('/', (req, res) => {
  res.render('input');
});

const PORT = process.env.PORT || 3000;


 app.listen(PORT,()=>{
     console.log('server is starting in port:' + PORT)
 })