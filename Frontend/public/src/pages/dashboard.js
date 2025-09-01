import React, { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    (async () => {
      const res = await api.get("/expenses");
      setExpenses(res.data.expenses || []);
    })();
  }, []);

  const addExpense = async e => {
    e.preventDefault();
    try {
      await api.post("/expenses", { description: desc, amount: parseFloat(amount) });
      const res = await api.get("/expenses");
      setExpenses(res.data.expenses || []);
      setDesc("");
      setAmount("");
    } catch {
      alert("Failed to add expense");
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <form onSubmit={addExpense}>
        <input type="text" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {expenses.map(exp => (
          <li key={exp.sk}>{exp.description} - ₹{exp.amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
