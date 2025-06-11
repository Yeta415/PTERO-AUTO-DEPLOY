const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.PTERO_API_KEY;
const PANEL_URL = process.env.PANEL_URL;

app.post('/api/create-user', async (req, res) => {
  const { username, email, firstName, lastName } = req.body;
  try {
    const response = await axios.post(`${PANEL_URL}/api/application/users`, {
      username,
      email,
      first_name: firstName,
      last_name: lastName,
    }, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.post('/api/create-server', async (req, res) => {
  const { userId, name, egg, nest, node, ram, disk, cpu } = req.body;
  try {
    const response = await axios.post(`${PANEL_URL}/api/application/servers`, {
      name,
      user: userId,
      egg,
      nest,
      node,
      allocation: 1,
      docker_image: 'ghcr.io/pterodactyl/yolks:java_17',
      startup: "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar server.jar nogui",
      environment: {
        SERVER_JARFILE: "server.jar",
        VANILLA_VERSION: "latest",
        BUILD_NUMBER: "latest"
      },
      limits: {
        memory: ram,
        swap: 0,
        disk,
        io: 500,
        cpu
      },
      feature_limits: {
        databases: 0,
        backups: 0,
        allocations: 1
      },
    }, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
