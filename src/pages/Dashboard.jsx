import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [message, setMessage] = useState('');
  const [chatList, setChatList] = useState([]);
  const navigate = useNavigate();

  // Login Check: Agar token nahi hai toh login page par bhejo
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setChatList([...chatList, { id: Date.now(), text: message, sender: 'You' }]);
    setMessage('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '30px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
        <h2>Chat Connect - Dashboard</h2>
        <button 
          onClick={handleLogout} 
          style={{ padding: '8px 15px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', minHeight: '250px', background: '#f9f9f9' }}>
        <h3>Chat Room</h3>
        {chatList.length === 0 ? (
          <p style={{ color: '#777' }}>Koi message nahi hai. Niche box me message type karke send karein!</p>
        ) : (
          chatList.map((chat) => (
            <div key={chat.id} style={{ background: '#e3f2fd', padding: '8px 12px', margin: '8px 0', borderRadius: '5px' }}>
              <strong>{chat.sender}:</strong> {chat.text}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Apna message type karein..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Dashboard;
