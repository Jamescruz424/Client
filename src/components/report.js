export class ReportGenerator {
    constructor() {
      this.logs = [];
      this.originalConsoleLog = console.log;
      this.overrideConsole();
    }
  
    overrideConsole() {
      console.log = (...args) => {
        const timestamp = new Date().toISOString();
        const logEntry = { timestamp, message: args.join(' ') };
        this.logs.push(logEntry);
        this.originalConsoleLog.apply(console, args);
      };
    }
  
    restoreConsole() {
      console.log = this.originalConsoleLog;
    }
  
    addLog(message) {
      const timestamp = new Date().toISOString();
      this.logs.push({ timestamp, message });
    }
  
    getTodayLogs() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
  
      return this.logs.filter((log) => {
        const logDate = new Date(log.timestamp);
        return logDate >= today && logDate < tomorrow;
      });
    }
  
    downloadTodayReport() {
      const todayLogs = this.getTodayLogs();
      if (todayLogs.length === 0) {
        alert('No logs available for today.');
        return;
      }
  
      const logText = todayLogs
        .map((log) => `[${log.timestamp}] ${log.message}`)
        .join('\n');
      const blob = new Blob([logText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  
    clearLogs() {
      this.logs = [];
    }
  }
  
  const reportGenerator = new ReportGenerator();
  export default reportGenerator;
