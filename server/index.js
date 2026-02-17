const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Finance Tool API - DB Connected');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
