const express = require('express');
const cors = require('cors');
const expenseRoutes = require('./routes/expenses');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/expenses', expenseRoutes);

app.get('/', (req, res) => {
    res.send('Finance Tool API');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
