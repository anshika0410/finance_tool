import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://localhost:3001';

async function runVerification() {
    try {
        console.log('Starting API Verification...');

        // 1. GET /expenses (Setup)
        console.log('\n[1] Checking initial expenses...');
        const initialRes = await axios.get(`${API_URL}/expenses`);
        console.log(`Status: ${initialRes.status}, Count: ${initialRes.data.length}`);

        // 2. POST /expenses (Create)
        const idempotencyKey = uuidv4();
        const expense1 = {
            amount: 1000, // ₹10.00
            category: 'Food',
            description: 'Test Lunch',
            date: new Date().toISOString().split('T')[0],
            idempotencyKey
        };

        console.log('\n[2] Creating expense 1...');
        const createRes1 = await axios.post(`${API_URL}/expenses`, expense1);
        console.log(`Status: ${createRes1.status}, ID: ${createRes1.data.id}`);

        // 3. POST /expenses (Idempotency Retry)
        console.log('\n[3] Retrying expense 1 (Idempotency check)...');
        const createRes2 = await axios.post(`${API_URL}/expenses`, expense1);
        console.log(`Status: ${createRes2.status}, ID: ${createRes2.data.id}`);

        if (createRes1.data.id === createRes2.data.id) {
            console.log('PASS: Idempotency preserved (Same ID returned).');
        } else {
            console.error('FAIL: Idempotency failed (Different IDs).');
        }

        // 4. Create another expense
        const expense2 = {
            amount: 500, // ₹5.00
            category: 'Transport',
            description: 'Test Bus',
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
            idempotencyKey: uuidv4()
        };
        console.log('\n[4] Creating expense 2 (Yesterday)...');
        await axios.post(`${API_URL}/expenses`, expense2);

        // 5. GET /expenses (Filter)
        console.log('\n[5] Filtering by category "Food"...');
        const filterRes = await axios.get(`${API_URL}/expenses?category=Food`);
        console.log(`Count: ${filterRes.data.length}`);
        if (filterRes.data.length === 1 && filterRes.data[0].category === 'Food') {
            console.log('PASS: Filtering works.');
        } else {
            console.error('FAIL: Filtering failed.');
        }

        // 6. GET /expenses (Sort)
        console.log('\n[6] Sorting by date (Newest first)...');
        const sortRes = await axios.get(`${API_URL}/expenses?sort=date_desc`);
        const dates = sortRes.data.map(e => e.date);
        console.log('Dates:', dates);
        if (new Date(dates[0]) >= new Date(dates[1])) {
            console.log('PASS: Sorting works.');
        } else {
            console.error('FAIL: Sorting failed.');
        }

        console.log('\nVerification Complete.');

    } catch (err) {
        console.error('Verification Failed:', err.message);
        if (err.response) {
            console.error('Response data:', err.response.data);
        } else if (err.code === 'ECONNREFUSED') {
            console.error('Server is not running. Please start the server first.');
        }
    }
}

runVerification();
