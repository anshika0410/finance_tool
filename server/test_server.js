const express = require('express');
const app = express();
const PORT = 3002;

app.get('/', (req, res) => res.send('Test'));

const server = app.listen(PORT, () => {
    console.log(`Test Server running on port ${PORT}`);

    // Check if it stays alive
    setTimeout(() => {
        console.log('Test Server still alive after 5s');
    }, 5000);
});
