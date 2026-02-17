const express = require('express');
const cors = require('cors');
const expenseRoutes = require('./routes/expenses');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/expenses', expenseRoutes);

app.get('/', (req, res) => {
    res.send('Finance Tool API');
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

// Keep-alive loop to prevent process exit in some environments
setInterval(() => { }, 1000 * 60 * 60);
