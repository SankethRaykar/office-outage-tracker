# NetPulse

NetPulse is a lightweight, real-time internet and network reporting dashboard designed for quick outage logging and organizational health monitoring. 

## 🚀 Features

- **One-Touch Reporting**: Employees can instantly report network outages with a single click.
- **Real-Time Stopwatch**: Active downtime is tracked down to the millisecond using a live pulse stopwatch.
- **User-Wise Tracking**: Input field to track exactly which employee or department is reporting the issue.
- **Aggregated Dashboard**:
  - **Total Incidents** & **Cumulative Downtime** KPI cards.
  - **Health Trend**: Duration trend bar chart for all incidents.
  - **Incidents by User**: Identifies who is experiencing the most outages.
- **Modern UI**: Dark mode optimized with high-contrast colors and clean typography.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS Variables (Vanilla CSS)
- **Icons**: Lucide React
- **Data Visualization**: Recharts

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd netpulse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`.

## 🏗️ Future Enhancements (Roadmap)

- **Backend Integration**: Connect to a database (Firebase, Supabase, or custom API) to persist outage logs across sessions.
- **SSO Authentication**: Restrict access to company employees only.
- **Slack/Teams Integration**: Automatically send a webhook alert to the IT channel when an outage is reported.

## 📄 License

This project is proprietary and confidential. 
