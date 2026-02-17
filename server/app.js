const express = require('express');
const cors = require('cors');
const expenseRoutes = require('./routes/expenses');

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/expenses', expenseRoutes);

app.get('/', (req, res) => {
    res.send('Finance Tool API');
});

module.exports = app;
