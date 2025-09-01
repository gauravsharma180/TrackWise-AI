// frontend/src/components/ExpenseTable.js
import React, { useEffect, useState } from 'react';
import api from '../api';

/**
 * ExpenseTable
 * - Loads /expenses (GET)
 * - Adds an expense via POST /expenses
 * - Shows categorized totals
 */
export default function ExpenseTable() {
  const [expenses, setExpenses] = useState([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data.expenses || []);
    } catch (err) {
      console.error(err);
      alert('Could not load expenses — make sure you are logged in');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addExpense = async (e) => {
    e.preventDefault();
    if (!desc || !amount) {
      alert('Provide description and amount');
      return;
    }
    setLoading(true);
    try {
      const payload = { description: desc, amount: parseFloat(amount), category };
      const res = await api.post('/expenses', payload);
      // server returns success; reload
      await load();
      setDesc('');
      setAmount('');
      setCategory('');
      if (res.data.alert) {
        // show server-side anomaly message if any
        alert(res.data.alert);
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || 'Failed to add');
    } finally {
      setLoading(false);
    }
  };

  // grouped categories
  const categories = expenses.reduce((acc, e) => {
    const cat = e.category || 'others';
    acc[cat] = (acc[cat] || 0) + (e.amount || 0);
    return acc;
  }, {});

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', gap: 20 }}>
        <form onSubmit={addExpense} style={{ flex: 1 }}>
          <h3>Add Expense</h3>
          <div>
            <label>Description</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} required />
          </div>
          <div>
            <label>Amount (₹)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>
          <div>
            <label>Category (optional)</label>
            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. food, transport" />
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Adding…' : 'Add Expense'}</button>
        </form>

        <div style={{ flex: 1 }}>
          <h3>Spending by Category</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Category</th>
                <th style={{ textAlign: 'right' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categories).length === 0 && (
                <tr><td colSpan="2">No expenses yet</td></tr>
              )}
              {Object.entries(categories).map(([cat, sum]) => (
                <tr key={cat}>
                  <td>{cat}</td>
                  <td style={{ textAlign: 'right' }}>{sum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3>All Transactions</h3>
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.sk || e.id}>
                  <td>{new Date(e.createdAt || e.timestamp || e.createdAt).toLocaleString()}</td>
                  <td>{e.description}</td>
                  <td style={{ textAlign: 'right' }}>₹{e.amount}</td>
                  <td>{e.category || 'others'}</td>
                </tr>
              ))}
              {expenses.length === 0 && <tr><td colSpan="4">No transactions</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
