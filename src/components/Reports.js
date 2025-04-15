// Create a Reports component to handle displaying and downloading reports
import React from 'react';
import reportGenerator from './report'; // Import the reportGenerator instance

const Reports = () => {
  const handleDownload = () => {
    reportGenerator.downloadTodayReport(); // Call the downloadTodayReport method from reportGenerator
  };

  return (
    <div>
      <h2>Reports</h2> {/* Display the title */}
      <button onClick={handleDownload}>Download Today’s Logs</button> {/* Button to trigger log download */}
    </div>
  );
};

export default Reports;
// Add a confirmation message after initiating the download
const handleDownload = () => {
  reportGenerator.downloadTodayReport(); // Trigger the download
  alert("Downloading today's logs..."); // Show confirmation message
};
