// server.js
const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const cors = require('cors');
const app = express();
const bigquery = new BigQuery();
require('dotenv').config();

// Use CORS middleware
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/bigquery-data', async (req, res) => {
    try {
        // Using environment variables for project, dataset, and table
        const projectID = process.env.GOOGLE_CLOUD_PROJECT;
        const datasetName = process.env.BIGQUERY_DATASET;
        const tableName = process.env.BIGQUERY_TABLE;

        // Ensure the project ID is included in the query
        const query = `SELECT * FROM \`${projectID}.${datasetName}.${tableName}\` LIMIT 10`;
        const options = { query: query, location: 'US' };
        const [rows] = await bigquery.query(options);

        res.json(rows);
    } catch (error) {
        console.error('Error while querying BigQuery', error);
        res.status(500).send('Error querying BigQuery');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
