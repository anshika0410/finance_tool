const db = require('../db');

// GET /expenses
exports.getExpenses = (req, res) => {
    const { category, sort } = req.query;
    let query = 'SELECT * FROM expenses';
    const params = [];
    const conditionParts = [];

    if (category) {
        conditionParts.push('category = ?');
        params.push(category);
    }

    if (conditionParts.length > 0) {
        query += ' WHERE ' + conditionParts.join(' AND ');
    }

    if (sort === 'date_desc') {
        query += ' ORDER BY date DESC';
    } else {
        query += ' ORDER BY created_at DESC'; // default sort
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve expenses' });
        }
        res.json(rows);
    });
};

// POST /expenses
exports.createExpense = (req, res) => {
    const { amount, category, description, date, idempotencyKey } = req.body;

    if (!amount || !category || !description || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Idempotency check: if key provided, check if exists
    if (idempotencyKey) {
        db.get('SELECT * FROM expenses WHERE idempotency_key = ?', [idempotencyKey], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            if (row) {
                // Return existing record as if success
                return res.status(200).json(row);
            }
            insertExpense();
        });
    } else {
        insertExpense();
    }

    function insertExpense() {
        const query = `
            INSERT INTO expenses (amount, category, description, date, idempotency_key)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.run(query, [amount, category, description, date, idempotencyKey], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to create expense' });
            }

            db.get('SELECT * FROM expenses WHERE id = ?', [this.lastID], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to retrieve created expense' });
                }
                res.status(201).json(row);
            });
        });
    }
};
