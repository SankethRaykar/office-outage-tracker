const { app, Tray, Menu, nativeImage } = require('electron');
const ping = require('ping');
const Speedtest = require('speedtest-net');
const { logStatus, logTicket } = require('./firebase');
const os = require('os');

const USER_NAME = os.userInfo().username;
let tray = null;
let isOffline = false;

// 5 Minutes interval
const PING_INTERVAL_MS = 5 * 60 * 1000;
const PING_TARGET = '8.8.8.8'; // Reliable target to test internet

async function performHybridPulse() {
  console.log(`[${new Date().toISOString()}] Running Hybrid Pulse...`);
  
  try {
    // Step 1: Lightweight Ping
    const pingResult = await ping.promise.probe(PING_TARGET, { timeout: 3 });
    
    const statusLog = {
      userId: USER_NAME,
      timestamp: Date.now(),
      latency: pingResult.alive ? pingResult.time : null,
      status: pingResult.alive ? 'Online' : 'Offline'
    };

    // Log to Firebase
    await logStatus(statusLog);

    if (!pingResult.alive) {
      if (!isOffline) {
        isOffline = true;
        console.log('Internet disconnected. Logging Ticket...');
        await logTicket({
          userId: USER_NAME,
          timestamp: Date.now(),
          type: 'Offline',
          message: 'No internet connection detected.'
        });
      }
      return; // Skip speed test if offline
    }
    
    isOffline = false;

    // Step 2: High Latency Trigger for Speed Test
    // Only run the heavy bandwidth test if latency is suspiciously high (>150ms)
    if (pingResult.time !== 'unknown' && pingResult.time > 150) {
      console.log('High latency detected, running full speed test...');
      
      const speed = await Speedtest({ acceptLicense: true, acceptGdpr: true });
      const downloadMbps = speed.download.bandwidth / 125000; // Convert bytes/sec to Mbps
      const uploadMbps = speed.upload.bandwidth / 125000;
      
      console.log(`Speedtest Result: DL: ${downloadMbps.toFixed(2)} Mbps, UL: ${uploadMbps.toFixed(2)} Mbps`);
      
      // Threshold check: < 20 Mbps DL or < 10 Mbps UL
      if (downloadMbps < 20 || uploadMbps < 10) {
        console.log('Speeds below threshold. Generating ticket...');
        await logTicket({
          userId: USER_NAME,
          timestamp: Date.now(),
          type: 'Low Bandwidth',
          message: `Speed dropped below threshold. DL: ${downloadMbps.toFixed(2)} Mbps, UL: ${uploadMbps.toFixed(2)} Mbps`
        });
      }
    } else {
      console.log(`Connection healthy. Latency: ${pingResult.time}ms`);
    }
  } catch (err) {
    console.error('Error during Hybrid Pulse:', err);
  }
}

app.whenReady().then(() => {
  // Create an invisible icon for the System Tray
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    { label: `NetPulse Agent (Running as ${USER_NAME})`, enabled: false },
    { type: 'separator' },
    { label: 'Run Manual Diagnostic', click: () => performHybridPulse() },
    { label: 'Quit', click: () => { app.quit(); } }
  ]);
  
  tray.setToolTip('NetPulse Agent');
  tray.setContextMenu(contextMenu);

  // Start polling
  performHybridPulse();
  setInterval(performHybridPulse, PING_INTERVAL_MS);
});

// Hide dock icon on macOS to keep it strictly background
if (app.dock) {
  app.dock.hide();
}
