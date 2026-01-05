'use client';
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMsgs }),
    });

    const data = await res.json();
    setMessages([...newMsgs, { role: 'assistant', content: data.answer }]);
  }

  return (
    <div style={{
      fontFamily: 'sans-serif',
      maxWidth: 600,
      margin: 'auto',
      padding: 20,
    }}>
      <h1>💬 PackFlow AI</h1>
      <p>Ask me about bottling & packaging processes!</p>

      <div style={{
        border: '1px solid #ccc',
        borderRadius: 10,
        padding: 10,
        height: 400,
        overflowY: 'auto',
        marginBottom: 10
      }}>
        {messages.map((m, i) => (
          <p key={i}><b>{m.role === 'user' ? 'You' : 'AI'}:</b> {m.content}</p>
        ))}
      </div>

      <div>
        <input
          style={{ width: '80%', padding: 8 }}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your question here..."
        />
        <button onClick={sendMessage} style={{
          padding: 8,
          marginLeft: 5,
          background: 'orange',
          border: 'none',
          borderRadius: 5,
          color: 'white',
          fontWeight: 'bold',
        }}>Send</button>
      </div>
    </div>
  );
}
