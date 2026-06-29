# NetPulse

NetPulse is an enterprise-grade network monitoring system that tracks your organization's internet uptime and bandwidth performance. It uses a decentralized architecture consisting of background desktop agents and a centralized real-time admin dashboard.

## System Architecture (V2)

The system is split into three main components:
1. **NetPulse Agent (`/netpulse-agent`)**: A lightweight, background Node.js process that runs on employee machines. It performs a "Hybrid Pulse":
   - Every 5 minutes, it sends a lightweight ping to verify connection without draining bandwidth.
   - If latency spikes, it triggers a heavy Javascript Speed Test.
   - If speeds drop below 20 Mbps (Download) or 10 Mbps (Upload), it logs a ticket.
   - If the internet goes offline completely, it logs an offline ticket as soon as the connection is restored.
2. **Admin Dashboard (React)**: A real-time command center that admins use to monitor live tickets and identify which employees are experiencing the most downtime.
3. **Firebase Cloud Database**: The central real-time database (Firestore) that connects the agents to the dashboard.

## Quick Start Setup

### 1. Firebase Configuration
NetPulse requires a free Google Firebase Firestore database to sync data.
1. Create a project at [console.firebase.google.com](https://console.firebase.google.com/).
2. Register a Web App to get your Firebase configuration keys.
3. Create a **Firestore Database** and start it in **Test Mode**.
4. Paste your configuration keys into the following two files:
   - `src/firebase.js` (For the Dashboard)
   - `netpulse-agent/firebase.js` (For the Background Agent)

### 2. Running the Admin Dashboard
The dashboard is built with React and Vite. To run it locally:
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Running the NetPulse Agent
The agent is a Node.js process that runs silently in your terminal.
```bash
cd netpulse-agent
npm install
node main.js
```

## Production Deployment (Cloudflare Pages)

To deploy the Admin Dashboard for your company admins:
1. Connect this GitHub repository to [Cloudflare Pages](https://pages.cloudflare.com/).
2. Build Settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
3. If you want to restrict access to only your office building, configure **Cloudflare WAF (Web Application Firewall)** to only allow your company's public IP address.
