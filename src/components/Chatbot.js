import React from 'react';

const Chatbot = () => {
  return <div>Chatbot</div>;
};

export default Chatbot;
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

const Chatbot = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <FontAwesomeIcon icon={faRobot} className="mr-2 text-indigo-600" />
          Chatbot
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Ask me anything! I’m powered by Gemini AI.
        </p>
      </div>
    </div>
  );
};

export default Chatbot;
<div className="bg-white shadow-md rounded-md p-4 mb-4 h-96 overflow-y-auto">
  <p className="text-gray-500 text-center">Ask something to get a response!</p>
</div>
<form className="flex items-center space-x-2">
  <input
    type="text"
    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    placeholder="Type your message..."
  />
  <button
    type="submit"
    className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    <FontAwesomeIcon icon={faPaperPlane} />
  </button>
</form>
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { chat } from '../services/api'; // Adjusted path if api.js is in src/services

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please enter a message.');
      return;
    }

    setResponse('');
    setError(null);

    try {
      const res = await chat(message);
      console.log('Chat response:', res.data); // Debug
      setResponse(res.data.response);
      setMessage('');
    } catch (err) {
      setError('Failed to get response from chatbot.');
      console.error('Chat error:', err);
      setResponse('Error: Could not respond.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <FontAwesomeIcon icon={faRobot} className="mr-2 text-indigo-600" />
          Chatbot
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Ask me anything! I’m powered by Gemini AI.
        </p>

        <div className="bg-white shadow-md rounded-md p-4 mb-4 h-96 overflow-y-auto">
          {response ? (
            <div className="p-2 rounded-lg bg-gray-200 text-gray-900">{response}</div>
          ) : (
            <p className="text-gray-500 text-center">Ask something to get a response!</p>
          )}
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={sendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { chat } from '../services/api'; // Adjust path if needed

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError('Please enter a message.');
      return;
    }

    setResponse('');
    setError(null);

    try {
      const res = await chat(message);
      console.log('Chat response:', res.data); // Debug log
      setResponse(res.data.response);
      setMessage('');
    } catch (err) {
      setError('Failed to get response from chatbot.');
      console.error('Chat error:', err);
      setResponse('Error: Could not respond.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <FontAwesomeIcon icon={faRobot} className="mr-2 text-indigo-600" />
          Chatbot
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Ask me anything! I’m powered by Gemini AI.
        </p>

        <div className="bg-white shadow-md rounded-md p-4 mb-4 h-96 overflow-y-auto">
          {response ? (
            <div className="p-2 rounded-lg bg-gray-200 text-gray-900">{response}</div>
          ) : (
            <p className="text-gray-500 text-center">Ask something to get a response!</p>
          )}
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={sendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
import { chat } from '../services/api'; // Adjust path as needed
const sendMessage = async (e) => {
  e.preventDefault();
  if (!message.trim()) {
    setError('Please enter a message.');
    return;
  }

  setResponse('');
  setError(null);

  try {
    const res = await chat(message);
    console.log('Chat response:', res.data);
    setResponse(res.data.response);
    setMessage('');
  } catch (err) {
    console.error('Chat error:', err);
    setError('Failed to get response from chatbot.');
    setResponse('Error: Could not respond.');
  }
};
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { chat } from '../services/api';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    const res = await chat(message);
    setResponse(res.data.response);
    setMessage('');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <FontAwesomeIcon icon={faRobot} className="mr-2 text-indigo-600" />
          Chatbot
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Ask me anything! I’m powered by Gemini AI.
        </p>

        <div className="bg-white shadow-md rounded-md p-4 mb-4 h-96 overflow-y-auto">
          {response ? (
            <div className="p-2 rounded-lg bg-gray-200 text-gray-900">{response}</div>
          ) : (
            <p className="text-gray-500 text-center">Ask something to get a response!</p>
          )}
        </div>

        <form onSubmit={sendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { chat } from '../services/api';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please enter a message.');
      return;
    }

    setResponse('');
    setError(null);

    try {
      const res = await chat(message);
      setResponse(res.data.response);
      setMessage('');
    } catch (err) {
      setError('Failed to get response from chatbot.');
      setResponse('Error: Could not respond.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <FontAwesomeIcon icon={faRobot} className="mr-2 text-indigo-600" />
          Chatbot
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Ask me anything! I’m powered by Gemini AI.
        </p>

        <div className="bg-white shadow-md rounded-md p-4 mb-4 h-96 overflow-y-auto">
          {response ? (
            <div className="p-2 rounded-lg bg-gray-200 text-gray-900">{response}</div>
          ) : (
            <p className="text-gray-500 text-center">Ask something to get a response!</p>
          )}
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={sendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Type your message..."
            aria-label="Chat message input"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Send message"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;









