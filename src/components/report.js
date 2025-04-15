// Create the ReportGenerator class to manage and store logs
export class ReportGenerator {
  constructor() {
    this.logs = []; // Initialize an empty logs array
    this.originalConsoleLog = console.log; // Store the original console.log method
    this.overrideConsole(); // Override console.log with custom behavior
  }
}
// Override console.log to capture log entries with timestamps
overrideConsole() {
  console.log = (...args) => {
    const timestamp = new Date().toISOString(); // Get current timestamp
    const logEntry = { timestamp, message: args.join(' ') }; // Store message with timestamp
    this.logs.push(logEntry); // Push the log entry to the logs array
    this.originalConsoleLog.apply(console, args); // Call the original console.log method
  };
}
// Restore the original console.log functionality
restoreConsole() {
  console.log = this.originalConsoleLog; // Restore original console.log
}
// Method to manually add a log entry with a message
addLog(message) {
  const timestamp = new Date().toISOString(); // Get current timestamp
  this.logs.push({ timestamp, message }); // Add log with timestamp
}
// Method to get logs for the current day
getTodayLogs() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set today's date at midnight
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Set tomorrow's date

  // Filter logs that are from today
  return this.logs.filter((log) => {
    const logDate = new Date(log.timestamp); // Convert log timestamp to Date object
    return logDate >= today && logDate < tomorrow; // Only include today's logs
  });
}
// Method to download a text report of today's logs
downloadTodayReport() {
  const todayLogs = this.getTodayLogs(); // Get today's logs
  if (todayLogs.length === 0) {
    alert('No logs available for today.'); // Alert if no logs exist for today
    return;
  }

  // Format logs as text
  const logText = todayLogs
    .map((log) => `[${log.timestamp}] ${log.message}`) // Format each log with timestamp and message
    .join('\n'); // Join logs with new lines
  
  // Create a blob for the log text and prepare to download
  const blob = new Blob([logText], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `logs-${new Date().toISOString().split('T')[0]}.txt`; // Name the file as logs-YYYY-MM-DD.txt
  document.body.appendChild(a);
  a.click(); // Trigger download
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url); // Clean up the URL object
}
// Method to clear all the logs
clearLogs() {
  this.logs = []; // Reset logs array to an empty array
}
// Create an instance of ReportGenerator for usage
const reportGenerator = new ReportGenerator();
export default reportGenerator; // Export the instance for usage elsewhere
// Enhance downloadTodayReport to handle no logs found gracefully
downloadTodayReport() {
  const todayLogs = this.getTodayLogs();
  if (todayLogs.length === 0) {
    alert('No logs available for today.'); // Graceful handling of empty logs
    return;
  }
}
