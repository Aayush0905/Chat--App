
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');

   ws.current.onmessage = async (event) => {
  try {
    let data = event.data;

    
    if (data instanceof Blob) {
      data = await data.text();
    }

    const msg = JSON.parse(data); 
    setMessages((prev) => [...prev, msg]);
  } catch (error) {
    console.error("Error parsing WebSocket message:", error);
  }
  };



    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
  if (input.trim() === '') return;

  const message = {
    id: uuidv4(),
    text: input,
  };

  ws.current.send(JSON.stringify(message)); 
  setMessages((prev) => [...prev, message]);
  setInput('');
};


  return (
    <div className="App">
      <h2>Real-time Chat</h2>
      <div className="chat-box">
        {messages.map((msg) => (
          <div key={msg.id} className="chat-msg">{msg.text}</div>
        ))}
      </div>
      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
