import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      setMessage(res.data.message || 'Login successful!');
      if (res.data.access_token) {
        localStorage.setItem('token', res.data.access_token);
        // Login success hote hi Dashboard par bhejein
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Chat Connect - Login</h2>
      {message && <p style={{ color: 'blue', fontWeight: 'bold' }}>{message}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Account nahi hai? <Link to="/">Signup karein</Link>
      </p>
    </div>
  );
}

export default Login;
