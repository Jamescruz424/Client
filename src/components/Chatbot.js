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


