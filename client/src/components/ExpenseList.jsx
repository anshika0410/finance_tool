import { useState, useEffect } from 'react';
import api from '../api';

function ExpenseList({ refreshTrigger }) {
    const [expenses, setExpenses] = useState([]);
    const [filterCategory, setFilterCategory] = useState('');
    const [sortBy, setSortBy] = useState('created_at_desc'); // default
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchExpenses = async () => {
        setLoading(true);
        setError(null);
        try {
            let url = '/expenses?';
            if (filterCategory) url += `category=${filterCategory}&`;
            if (sortBy === 'date_desc') url += 'sort=date_desc&';

            const response = await api.get(url);
            setExpenses(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load expenses.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [refreshTrigger, filterCategory, sortBy]);

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate category totals
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    return (
        <div className="expense-section">
            <div className="summary-grid">
                <div className="summary-card card total-card">
                    <div className="summary-content">
                        <span className="summary-label">Total Expenses</span>
                        <span className="summary-amount">₹{(totalAmount / 100).toFixed(2)}</span>
                    </div>
                </div>

                {Object.entries(categoryTotals).map(([category, amount]) => (
                    <div key={category} className="summary-card card category-card">
                        <div className="summary-content">
                            <span className="summary-label">{category}</span>
                            <span className="summary-amount">₹{(amount / 100).toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="controls-card card">
                <div className="controls">
                    <div className="control-group">
                        <label>Filter by Category</label>
                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                            <option value="">All Categories</option>
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Health">Health</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="control-group">
                        <label>Sort By</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="created_at_desc">Date Created (Newest)</option>
                            <option value="date_desc">Expense Date (Newest)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="list-card card">
                {loading && <div className="loading-state">Loading expenses...</div>}
                {error && <div className="error-state">{error}</div>}

                {!loading && !error && (
                    <div className="table-responsive">
                        <table className="expense-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th className="text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map(expense => (
                                    <tr key={expense.id}>
                                        <td className="date-cell">{expense.date}</td>
                                        <td>
                                            <span className={`badge badge-${expense.category.toLowerCase()}`}>
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td>{expense.description}</td>
                                        <td className="amount-cell">₹{(expense.amount / 100).toFixed(2)}</td>
                                    </tr>
                                ))}
                                {expenses.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="empty-state">
                                            No expenses found. Start adding some!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExpenseList;
