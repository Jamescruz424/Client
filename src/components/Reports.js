import React from 'react';
import reportGenerator from './report';

const Reports = () => {
  const handleDownload = () => {
    reportGenerator.downloadTodayReport();
  };

  return (
    <div>
      <h2>Reports</h2>
      <button onClick={handleDownload}>Download Today’s Logs</button>
    </div>
  );
};

export default Reports;