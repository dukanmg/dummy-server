const express = require('express');
const axios = require('axios');
const bodyParser=require('body-parser')
var cors = require('cors')

const port=process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true }));

// Array of URL objects with methods and payloads (if applicable)
const urls = [
    { method: 'GET', url: 'https://mgdukan-server.onrender.com/check' },
    { method: 'POST', url: 'https://flipkart-code.onrender.com/check', data: { key: 'value' } },
    { method: 'POST', url: 'https://amazon-py.onrender.com/check', data: { anotherKey: 'anotherValue' } }
];

let intervalId = null;
let count=0;

// Function to hit the URLs
async function hitUrls() {
    try {
        const responses = await Promise.all(
            urls.map(({ method, url, data }) =>
                axios({ method, url, data })
                    .then(response => {
                        console.log(`Response from ${method} ${url}:`, response.status, response.statusText);
                        return response.data;
                    })
                    .catch(error => {
                        console.error(`Error hitting ${method} ${url}:`, error.message);
                    })
            )
        );
        count=count+1
        console.log("Process count : ",count)
        console.log("Hit time : ", new Date())
        console.log('All URLs processed:', responses);
    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

// Endpoint to start hitting URLs
app.post('/start', (req, res) => {
    let sec_diff = Number(req.body.seconds) || 30;
    if (intervalId) {
        return res.status(400).send('Hitting URLs is already in progress!');
    }
    
    intervalId = setInterval(hitUrls, sec_diff*1000);
    console.log('Started hitting URLs every 30 seconds');
    res.send('Started hitting URLs every 30 seconds');
});

// Endpoint to stop hitting URLs
app.post('/stop', (req, res) => {
    if (!intervalId) {
        return res.status(400).send('No process is running!');
    }

    clearInterval(intervalId);
    intervalId = null;
    console.log('Stopped hitting URLs');
    res.send('Stopped hitting URLs');
});


app.post('/check', (req, res) => {
    console.log("Server Running")
    res.send({"Ouput":"Dummy Server Running successfully"});
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
