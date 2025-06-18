'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ChatbotPage() {
  const [input, setInput] = useState('');
  const [clientName, setClientName] = useState('');
  const [selectedTool, setSelectedTool] = useState<'summarize' | 'recommend' | null>(null);
  const [messages, setMessages] = useState<{ from: 'user' | 'bot', text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedTool) return;

    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setLoading(true);

    try {
      let endpoint = '';
      let payload = {};

      if (selectedTool === 'summarize') {
        endpoint = '/tools/summarize_billing';
        payload = { month: input };
      } else if (selectedTool === 'recommend') {
        if (!clientName.trim()) {
          alert('Client name is required for cost recommendations.');
          setLoading(false);
          return;
        }
        endpoint = '/tools/recommend_cost_reduction';
        payload = { client_name: clientName };
      }

      const res = await axios.post(`http://localhost:9999${endpoint}`, payload);
      const botResult = res.data?.result;

      let botReply = '';
      if (typeof botResult === 'string') {
        botReply = botResult;
      } else if (botResult?.report) {
        botReply = botResult.report;
      } else if (botResult?.recommendation) {
        botReply = botResult.recommendation;
      } else if (botResult?.error) {
        console.error('Tool error:', botResult.error);
        botReply = `Error: ${botResult.error}`;
      } else {
        botReply = 'No valid response from agent';
      }

      setMessages(prev => [...prev, { from: 'bot', text: botReply }]);
    } catch (err: any) {
      console.error('Request error:', err);
      setMessages(prev => [...prev, { from: 'bot', text: 'Request Error: ' + err.message }]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-white text-blue-900 flex flex-col items-center px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Billing AI Assistant</h1>

      {/* Tool Selector */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedTool('summarize')}
          className={`px-4 py-2 rounded-full border transition ${
            selectedTool === 'summarize'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-blue-600 border-blue-400 hover:bg-blue-100'
          }`}
        >
          Summarize Billing
        </button>
        <button
          onClick={() => setSelectedTool('recommend')}
          className={`px-4 py-2 rounded-full border transition ${
            selectedTool === 'recommend'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-blue-600 border-blue-400 hover:bg-blue-100'
          }`}
        >
          Cost Recommendation
        </button>
      </div>

      {/* Chatbox */}
      <div className="w-full max-w-2xl bg-blue-50 rounded-lg shadow p-4 mb-4 overflow-y-auto max-h-[60vh]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-3 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`px-4 py-2 rounded-lg max-w-[80%] ${
                msg.from === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-800 border border-blue-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <p className="italic text-blue-500">AI is thinking...</p>}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col gap-2">
        {selectedTool === 'recommend' && (
          <input
            type="text"
            className="p-2 border border-blue-300 rounded w-full"
            placeholder="Client name (e.g. Acme Corp)"
            value={clientName}
            onChange={e => setClientName(e.target.value)}
            disabled={loading}
          />
        )}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border border-blue-300 rounded"
            placeholder={
              selectedTool === 'summarize'
                ? 'Enter month (e.g. 2025-06)'
                : selectedTool === 'recommend'
                ? 'Describe your issue (optional)'
                : 'Choose a tool first'
            }
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={!selectedTool || loading}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading || !selectedTool}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
