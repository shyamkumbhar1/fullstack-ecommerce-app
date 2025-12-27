const { exec } = require('child_process');
const os = require('os');

const PORT = process.env.PORT || 5000;

// Windows command
if (os.platform() === 'win32') {
  exec(`netstat -ano | findstr :${PORT}`, (error, stdout) => {
    if (stdout) {
      const lines = stdout.trim().split('\n');
      const pids = new Set();
      
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0' && !isNaN(pid)) {
          pids.add(pid);
        }
      });

      if (pids.size > 0) {
        console.log(`🔧 Killing processes on port ${PORT}...`);
        pids.forEach(pid => {
          exec(`taskkill /PID ${pid} /F`, (err) => {
            if (!err) {
              console.log(`✅ Killed process ${pid} on port ${PORT}`);
            } else {
              console.log(`⚠️  Could not kill process ${pid}`);
            }
          });
        });
        // Wait a bit for processes to be killed
        setTimeout(() => {
          console.log(`✅ Port ${PORT} should be free now`);
        }, 1000);
      } else {
        console.log(`✅ Port ${PORT} is already free`);
      }
    } else {
      console.log(`✅ Port ${PORT} is already free`);
    }
  });
} else {
  // Linux/Mac command
  exec(`lsof -ti:${PORT}`, (error, stdout) => {
    if (stdout) {
      const pids = stdout.trim().split('\n');
      console.log(`🔧 Killing processes on port ${PORT}...`);
      pids.forEach(pid => {
        exec(`kill -9 ${pid}`, (err) => {
          if (!err) {
            console.log(`✅ Killed process ${pid} on port ${PORT}`);
          }
        });
      });
    } else {
      console.log(`✅ Port ${PORT} is already free`);
    }
  });
}

