'use client';

import { useState } from "react";

export default function Home() {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [description, setDescription] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        amount, 
        type, 
        description, 
        userId: "202198d4-89f1-4f50-825c-203ed7584e24" 
      }),
    });

    if (response.ok) {
      alert('Transaksi berhasil ditambahkan!');
    }
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-5">Add New Transaction</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input 
          type="number" 
          placeholder="Rp 0.00" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          className="border p-2"
        />
        
        <input 
          type="text" 
          placeholder="What was this for?" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="border p-2"
        />

        <button type="submit" className="bg-blue-900 text-white p-2 rounded">
          Add Transaction
        </button>
      </form>
    </div>
  );

}