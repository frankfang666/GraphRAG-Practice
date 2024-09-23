// Backend server setup using Express.js and FalkorDB
const express = require('express');
const cors = require('cors');
const { FalkorDB } = require('falkordb');

const app = express();

// Enable CORS for all origins (you can restrict this to specific origins if needed)
app.use(cors());

(async () => {
  // Connect to FalkorDB
  const db = await FalkorDB.connect({
    socket: {
      host: 'localhost',
      port: 6379,
    },
  });

  console.log('Connected to FalkorDB');

  // Define your API route
  app.get('/api/graph/query', async (req, res) => {
    try {
      const graph = db.selectGraph('test');
      const result = await graph.query('MATCH (n)-[r]->(m) RETURN n,r,m');
      res.json(result.data);
    } catch (error) {
      console.error('Error querying FalkorDB:', error);
      res.status(500).json({ error: 'Failed to query FalkorDB' });
    }
  });

  // Start the server
  app.listen(3002, () => {
    console.log('Server is running on port 3002');
  });
})();