const ping = require('ping');
const notifier = require('node-notifier');
const { logStatus, logTicket } = require('./firebase');
const os = require('os');

const USER_NAME = os.userInfo().username;
let isOffline = false;

function checkVPN() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('vpn') || lowerName.includes('tun') || lowerName.includes('tap') || 
        lowerName.includes('wireguard') || lowerName.includes('cisco') || lowerName.includes('openvpn')) {
      // Return true if any adapter is active (has an IPv4 address)
      const isUp = interfaces[name].some(iface => iface.family === 'IPv4' && !iface.internal);
      if (isUp) return true;
    }
  }
  return false;
}

// 5 Minutes interval
const PING_INTERVAL_MS = 5 * 60 * 1000;
const PING_TARGET = '8.8.8.8'; // Reliable target to test internet

async function performHybridPulse() {
  console.log(`\n[${new Date().toISOString()}] Running Hybrid Pulse...`);
  
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
        notifier.notify({
          title: 'NetPulse Monitor',
          message: 'Internet disconnected! A ticket has been raised with IT.'
        });
        const vpnActive = checkVPN();
        await logTicket({
          userId: USER_NAME,
          timestamp: Date.now(),
          type: 'Offline',
          message: `No internet connection detected.${vpnActive ? ' [USER WAS ON VPN]' : ''}`
        });
      }
      return; // Skip speed test if offline
    }
    
    isOffline = false;

    // Step 2: High Latency Trigger for Speed Test
    if (pingResult.time !== 'unknown' && pingResult.time > 150) {
      console.log('High latency detected, running pure JS speed test...');
      
      const startTime = Date.now();
      // Download a 10MB test file from a fast CDN
      const response = await fetch('https://speed.hetzner.de/100MB.bin', {
        headers: { 'Range': 'bytes=0-10485760' } // Download first 10MB
      });
      
      if (!response.ok) throw new Error('Speed test download failed');
      
      const arrayBuffer = await response.arrayBuffer();
      const endTime = Date.now();
      
      const durationInSeconds = (endTime - startTime) / 1000;
      const bitsLoaded = arrayBuffer.byteLength * 8;
      const speedBps = bitsLoaded / durationInSeconds;
      const downloadMbps = speedBps / (1024 * 1024);
      
      console.log(`Speedtest Result: DL: ${downloadMbps.toFixed(2)} Mbps`);
      
      if (downloadMbps < 20) {
        console.log('Speeds below threshold. Generating ticket...');
        notifier.notify({
          title: 'NetPulse Monitor',
          message: `Network speed dropped (${downloadMbps.toFixed(1)} Mbps). IT has been notified!`
        });
        const vpnActive = checkVPN();
        await logTicket({
          userId: USER_NAME,
          timestamp: Date.now(),
          type: 'Low Bandwidth',
          message: `Download Speed dropped below 20 Mbps threshold. Recorded DL: ${downloadMbps.toFixed(2)} Mbps.${vpnActive ? ' [USER WAS ON VPN]' : ''}`
        });
      }
    } else {
      console.log(`Connection healthy. Latency: ${pingResult.time}ms`);
    }
  } catch (err) {
    console.error('Error during Hybrid Pulse:', err);
  }
}

console.log(`=========================================`);
console.log(`NetPulse Agent started for: ${USER_NAME}`);
console.log(`Press Ctrl+C to stop the agent.`);
console.log(`=========================================\n`);

// Start polling
performHybridPulse();
setInterval(performHybridPulse, PING_INTERVAL_MS);
