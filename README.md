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
- **Premium UI**: Deep dark mode optimized with glassmorphism, dynamic gradients, and smooth micro-animations.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Premium Glassmorphism)
- **Icons**: Lucide React
- **Data Visualization**: Recharts

## 📦 Getting Started (Local Development)

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

---

## 🔒 Restricting Access to Office Employees (Cloudflare Method)

This project can be easily deployed and restricted so that **only employees connected to your office Wi-Fi** can access it. We recommend using **Cloudflare Pages** and their free Web Application Firewall (WAF).

### Step 1: Deploy for Free on Cloudflare Pages
1. Push this repository to GitHub.
2. Sign up for a free [Cloudflare](https://dash.cloudflare.com/) account.
3. Navigate to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
4. Select your NetPulse repository.
5. In the build settings:
   - **Framework preset**: `Create React App` or `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Click **Save and Deploy**. Your site is now live!

### Step 2: Lock it down to your Office IP Address
Now, we will block everyone on the internet from accessing it, *except* your office network.

1. While connected to your office Wi-Fi, Google **"What is my IP"** and copy the public IP address.
2. In the Cloudflare Dashboard, go to your account home and select the domain you deployed to (you can use the free `.pages.dev` domain).
3. On the left sidebar, click **Security** -> **WAF** (Web Application Firewall).
4. Click **Create firewall rule**.
5. Give it a name (e.g., `Block Non-Office Access`).
6. Set the rule to match:
   - Field: **IP Source Address**
   - Operator: **does not equal**
   - Value: `[Paste your Office IP Address here]`
7. Under **Choose action**, select **Block**.
8. Click **Deploy firewall rule**.

**Result:** Only users physically in your office (or on the company VPN) can access the application. Anyone else will receive an Access Denied error.

---

## 📄 License

This project is proprietary and confidential.
