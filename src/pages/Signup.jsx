import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signup', { name, email, password });
      setMessage(res.data.message || 'Signup successful!');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Signup failed');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Chat Connect - Signup</h2>
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      <form onSubmit={handleSignup}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px' }} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px' }} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px' }} 
        />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Create Account
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Pehle se account hai? <Link to="/login">Login karein</Link>
      </p>
    </div>
  );
}

export default Signup;
