const request = require('supertest');
const app = require('../app');

// Simple UUID generator for tests to avoid 'uuid' package issues in Jest
const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

describe('Finance Tool API', () => {

    describe('GET /expenses', () => {
        it('should return 200 and an array', async () => {
            const res = await request(app).get('/expenses');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('POST /expenses', () => {
        const validExpense = {
            amount: 1000,
            category: 'Food',
            description: 'Test Lunch',
            date: new Date().toISOString().split('T')[0]
        };

        it('should create a new expense and return 201', async () => {
            const res = await request(app).post('/expenses').send(validExpense);
            expect(res.status).toBe(201);
            expect(res.body.amount).toBe(1000);
            expect(res.body).toHaveProperty('id');
        });

        it('should return 400 for missing fields', async () => {
            const invalidExpense = { amount: 1000 };
            const res = await request(app).post('/expenses').send(invalidExpense);
            expect(res.status).toBe(400);
        });

        it('should return 400 for negative amount', async () => {
            const invalidExpense = { ...validExpense, amount: -500 };
            const res = await request(app).post('/expenses').send(invalidExpense);
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/positive/);
        });

        it('should return 400 for invalid date', async () => {
            const invalidExpense = { ...validExpense, date: 'not-a-date' };
            const res = await request(app).post('/expenses').send(invalidExpense);
            expect(res.status).toBe(400);
        });

        it('should handle idempotency (return same record on retry)', async () => {
            const idempotencyKey = uuidv4();
            const expense = { ...validExpense, idempotencyKey };

            // First attempt
            const res1 = await request(app).post('/expenses').send(expense);
            expect(res1.status).toBe(201);

            // Second attempt (Retry)
            const res2 = await request(app).post('/expenses').send(expense);
            expect(res2.status).toBe(200);

            // IDs should match
            expect(res1.body.id).toBe(res2.body.id);
        });
    });
});
