import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '../api';

function ExpenseForm({ onExpenseAdded }) {
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Reset status on change
        if (success) setSuccess(false);
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Generate idempotency key for this specific attempt
        const idempotencyKey = uuidv4();

        try {
            // Amount in cents (integer)
            const payload = {
                ...formData,
                amount: Math.round(parseFloat(formData.amount) * 100),
                idempotencyKey
            };

            await api.post('/expenses', payload);
            if (onExpenseAdded) onExpenseAdded(); // Refresh list

            // Reset form
            setFormData({
                amount: '',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
            setError('Failed to add expense. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="expense-form card">
            <div className="card-header">
                <h3>Add New Expense</h3>
            </div>

            <div className="card-body">
                {error && <div className="alert error">{error}</div>}
                {success && <div className="alert success">Expense added successfully!</div>}

                <div className="form-row">
                    <div className="form-group">
                        <label>Amount (₹)</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health">Health</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="What did you spend on?"
                        required
                    />
                </div>

                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Adding...' : 'Add Expense'}
                </button>
            </div>
        </form>
    );
}

export default ExpenseForm;
