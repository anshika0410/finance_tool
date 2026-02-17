import { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import './index.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleExpenseAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-area">
            <h1>💸 Finance Tool</h1>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-grid">
          <section className="form-section">
            <ExpenseForm onExpenseAdded={handleExpenseAdded} />
          </section>
          <section className="list-section">
            <ExpenseList refreshTrigger={refreshTrigger} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
