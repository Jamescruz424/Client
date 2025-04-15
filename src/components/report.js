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
