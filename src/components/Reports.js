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
// Add some basic styling to the button to improve the UI
return (
  <div>
    <h2>Reports</h2>
    <button 
      onClick={handleDownload} 
      style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
    >
      Download Today’s Logs
    </button>
  </div>
);
// Handle potential errors during the report download process
const handleDownload = () => {
  try {
    reportGenerator.downloadTodayReport(); // Attempt to download the report
  } catch (error) {
    alert("There was an error downloading the report. Please try again."); // Show error message if download fails
  }
};
