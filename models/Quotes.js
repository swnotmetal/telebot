const axios = require('axios');
const fs = require('fs');

// Read the JSON file
const jsonData = fs.readFileSync('./quotes.json', 'utf-8');

// Define the URL of the server to send the JSON file to
const serverUrl = 'https://example.com/upload';

// Send the JSON data to the server
axios.post(serverUrl, jsonData, {
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => {
    console.log('JSON file sent successfully:', response.data);
})
.catch(error => {
    console.error('Error sending JSON file:', error);
});
