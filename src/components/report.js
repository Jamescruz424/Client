// Create the ReportGenerator class to manage and store logs
export class ReportGenerator {
  constructor() {
    this.logs = []; // Initialize an empty logs array
    this.originalConsoleLog = console.log; // Store the original console.log method
    this.overrideConsole(); // Override console.log with custom behavior
  }
}
