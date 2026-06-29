import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Hardcoded Chart Data
const niftyData = [
  { t: '9:15', v: 24512 },
  { t: '9:30', v: 24580 },
  { t: '9:45', v: 24640 },
  { t: '10:00', v: 24590 },
  { t: '10:30', v: 24680 },
  { t: '11:00', v: 24720 },
  { t: '11:30', v: 24782 },
];

const sensexData = [
  { t: '9:15', v: 80842 },
  { t: '9:30', v: 81100 },
  { t: '9:45', v: 81250 },
  { t: '10:00', v: 81150 },
  { t: '10:30', v: 81400 },
  { t: '11:00', v: 81600 },
  { t: '11:30', v: 81742 },
];

const bankData = [
  { t: '9:15', v: 53412 },
  { t: '9:30', v: 53320 },
  { t: '9:45', v: 53250 },
  { t: '10:00', v: 53300 },
  { t: '10:30', v: 53200 },
  { t: '11:00', v: 53230 },
  { t: '11:30', v: 53218 },
];

const aiForecastData = [
  { t: '1', v: 24782 },
  { t: '2', v: 24820 },
  { t: '3', v: 24790 },
  { t: '4', v: 24890 },
  { t: '5', v: 24940 },
  { t: '6', v: 25040 },
];

function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatISTTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  // Semicircle Needle Angle calculation (180 to 360 deg)
  const getNeedleCoords = (percent: number, cx = 50, cy = 50, radius = 35) => {
    const angle = 180 + (percent / 100) * 180;
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const sentimentNeedle = getNeedleCoords(72);
  const breadthNeedle = getNeedleCoords(55);

  return (
    <div className="app-container">
      <style>{`
        /* Reset and Global rules */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background-color: #0b0d12;
          color: #f9fafb;
          font-family: 'Inter', system-ui, sans-serif;
          overflow: hidden;
          height: 100vh;
        }

        /* Top-level CSS Grid Shell */
        .app-container {
          display: grid;
          grid-template-columns: 200px 1fr;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background-color: #0b0d12;
        }

        /* Sidebar Styling */
        .sidebar {
          display: flex;
          flex-direction: column;
          background-color: #0e1018;
          border-right: 1px solid #1c1f2e;
          height: 100%;
          overflow-y: auto;
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 12px;
          border-bottom: 1px solid #1c1f2e;
        }
        .logo-icon {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background-color: #1d4ed8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }
        .sidebar-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 10px 0;
        }
        .sidebar-section-label {
          font-size: 9px;
          color: #4b5563;
          text-transform: uppercase;
          font-weight: bold;
          padding: 8px 12px 4px 12px;
          letter-spacing: 0.08em;
        }
        .sidebar-item {
          display: flex;
          align-items: center;
          font-size: 11px;
          color: #9ca3af;
          padding: 6px 10px;
          margin: 2px 6px;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .sidebar-item:hover {
          background-color: #131620;
          color: #f9fafb;
        }
        .sidebar-item.active {
          background-color: #172554;
          color: #93c5fd;
          font-weight: 600;
          border-left: 3px solid #3b82f6;
          border-radius: 0 6px 6px 0;
          margin-left: 3px;
        }
        .sidebar-badge {
          margin-left: auto;
          font-size: 7px;
          font-weight: bold;
          background-color: #1d4ed8;
          color: #ffffff;
          padding: 1px 3px;
          border-radius: 3px;
        }
        .sidebar-bottom {
          flex-shrink: 0;
          padding: 10px;
          border-top: 1px solid #1c1f2e;
          background-color: #0e1018;
        }
        .pro-card {
          background-color: #1e1b4b;
          border: 1px solid #312e81;
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 8px;
        }
        .profile-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 8px;
          border-top: 1px solid #1c1f2e;
          margin-top: 6px;
        }
        .avatar {
          width: 24px;
          height: 24px;
          border-radius: 5px;
          background-color: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: bold;
          color: white;
        }

        /* Main Workspace Area */
        .main-area {
          display: grid;
          grid-template-rows: 44px 34px 1fr;
          height: 100vh;
          overflow: hidden;
          background-color: #0b0d12;
        }

        /* Topbar Style */
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 44px;
          padding: 0 12px;
          background-color: #0e1018;
          border-bottom: 1px solid #1c1f2e;
        }
        .search-container {
          position: relative;
          flex: 1;
          max-width: 320px;
        }
        .search-input {
          width: 100%;
          background-color: #161925;
          border: 1px solid #1c1f2e;
          border-radius: 7px;
          padding: 5px 30px 5px 10px;
          font-size: 11px;
          color: #f9fafb;
          outline: none;
        }
        .search-input::placeholder {
          color: #4b5563;
        }
        .search-badge {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 9px;
          color: #4b5563;
          border: 1px solid #1c1f2e;
          padding: 1px 3px;
          border-radius: 3px;
        }
        .topbar-controls {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .icon-btn {
          width: 28px;
          height: 28px;
          background-color: #161925;
          border: 1px solid #1c1f2e;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #9ca3af;
          position: relative;
        }
        .btn-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background-color: #3b82f6;
          color: white;
          font-size: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .market-status-box {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: 4px;
        }
        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #22c55e;
          box-shadow: 0 0 6px #22c55e;
        }

        /* Ticker Bar Styling */
        .ticker-bar {
          display: flex;
          align-items: center;
          height: 34px;
          background-color: #0e1018;
          border-bottom: 1px solid #1c1f2e;
          overflow-x: auto;
        }
        .ticker-bar::-webkit-scrollbar {
          display: none; /* Hide scrollbar for Chrome, Safari and Opera */
        }
        .ticker-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 14px;
          height: 100%;
          border-right: 1px solid #1c1f2e;
          font-size: 10px;
          font-family: monospace;
          white-space: nowrap;
        }

        /* Content Scroll Area */
        .content-area {
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .content-area::-webkit-scrollbar {
          width: 4px;
        }
        .content-area::-webkit-scrollbar-thumb {
          background-color: #1c1f2e;
          border-radius: 2px;
        }

        /* Card Base Class */
        .card {
          background: #131620;
          border: 1px solid #1c1f2e;
          border-radius: 10px;
          padding: 12px;
          overflow: hidden;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* Row Layout Grid Systems */
        .row-1 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          height: 114px;
          flex-shrink: 0;
        }
        .row-2 {
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 10px;
          height: 126px;
          flex-shrink: 0;
        }
        .row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1.1fr;
          gap: 10px;
          height: 180px;
          flex-shrink: 0;
        }
        .row-4 {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 10px;
          height: 184px;
          flex-shrink: 0;
        }

        /* Heatmap Grid Cell */
        .heatmap-grid {
          display: grid;
          grid-template-columns: 2fr 1.5fr 2fr 1.5fr;
          grid-template-rows: 1fr 1fr;
          gap: 4px;
          height: 100px;
          flex-grow: 1;
        }
        .heatmap-cell {
          padding: 6px 8px;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-decoration: none;
          transition: filter 0.15s;
        }
        .heatmap-cell:hover {
          filter: brightness(1.15);
        }

        /* Table Components Row */
        .table-row {
          display: grid;
          grid-template-columns: 16px 1fr auto auto;
          gap: 6px;
          align-items: center;
          font-size: 10px;
          padding: 4.5px 0;
        }
        .table-row:nth-child(even) {
          background-color: rgba(255, 255, 255, 0.015);
        }
      `}</style>

      {/* ===== Left Sidebar ===== */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">A</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f9fafb', lineHeight: 1 }}>Analytics Pro</div>
            <div style={{ fontSize: '9px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '1px' }}>Stock Market Intelligence</div>
          </div>
        </div>

        <div className="sidebar-scroll">
          <div className="sidebar-section-label">Market</div>
          <a className="sidebar-item active"><span style={{ marginRight: '6px' }}>■</span>Dashboard</a>
          <a className="sidebar-item"><span style={{ marginRight: '6px' }}>■</span>Markets</a>
          <a className="sidebar-item"><span style={{ marginRight: '6px' }}>■</span>Watchlist</a>
          <a className="sidebar-item"><span style={{ marginRight: '6px' }}>■</span>Heatmap</a>
          <a className="sidebar-item">
            <span style={{ marginRight: '6px' }}>■</span>News & Insights
            <span className="sidebar-badge" style={{ backgroundColor: '#3b82f6' }}>NEW</span>
          </a>

          <div className="sidebar-section-label" style={{ marginTop: '8px' }}>Analytics</div>
          <a className="sidebar-item"><span style={{ marginRight: '6px' }}>■</span>Technical Analysis</a>
          <a className="sidebar-item"><span style={{ marginRight: '6px' }}>■</span>Options Analytics</a>
          <a className="sidebar-item"><span style={{ marginRight: '6px' }}>■</span>AI Signals</a>
          <a className="sidebar-item"><span style={{ marginRight: '6px' }}>■</span>Market Scanner</a>

          <div className="sidebar-section-label" style={{ marginTop: '8px' }}>Portfolio</div>
          <a className="sidebar-item"><span style={{ marginRight: '6px' }}>■</span>Portfolio Overview</a>
          <a className="sidebar-item"><span style={{ marginRight: '6px' }}>■</span>Holdings</a>
          <a className="sidebar-item"><span style={{ marginRight: '6px' }}>■</span>Performance</a>
          <a className="sidebar-item"><span style={{ marginRight: '6px' }}>■</span>Transactions</a>

          <div className="sidebar-section-label" style={{ marginTop: '8px' }}>Tools</div>
          <a className="sidebar-item"><span style={{ marginRight: '6px' }}>■</span>Economic Calendar</a>
          <a className="sidebar-item"><span style={{ marginRight: '6px' }}>■</span>Alerts</a>
          <a className="sidebar-item"><span style={{ marginRight: '6px' }}>■</span>Reports</a>
        </div>

        {/* Sidebar Bottom Profile */}
        <div className="sidebar-bottom">
          <div className="pro-card">
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#ffffff' }}>Upgrade to Pro</div>
            <div style={{ fontSize: '8px', color: '#9ca3af', marginTop: '2px', lineHeight: 1.3 }}>Unlock institutional grade screeners & analytics tools</div>
          </div>
          <a className="sidebar-item" style={{ margin: '1px 0', padding: '4px 6px' }}>⚙ Settings</a>
          <a className="sidebar-item" style={{ margin: '1px 0', padding: '4px 6px' }}>? Help & Support</a>
          
          <div className="profile-box">
            <div className="avatar">US</div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#f9fafb' }}>Unith Sharma</div>
              <div style={{ fontSize: '8px', color: '#4b5563', fontFamily: 'monospace' }}>Premium Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== Main Content Workspace Shell ===== */}
      <div className="main-area">
        {/* Top Navbar */}
        <header className="topbar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search any symbol, company or index..."
              className="search-input"
            />
            <span className="search-badge">⌘K</span>
          </div>

          <div className="topbar-controls">
            {/* Theme Toggle */}
            <button className="icon-btn" title="Toggle Theme">☀</button>
            {/* Portfolio Badge */}
            <button className="icon-btn" title="Quick Portfolio">
              💼
              <span className="btn-badge">3</span>
            </button>
            {/* Notification bell */}
            <button className="icon-btn" title="Notifications">🔔</button>
            
            {/* Live Status indicator */}
            <div className="market-status-box">
              <div className="live-dot" />
              <div style={{ lineHeight: 1.1 }}>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#22c55e', display: 'block', textTransform: 'uppercase' }}>Market Open</span>
                <span style={{ fontSize: '8px', color: '#9ca3af', fontFamily: 'monospace' }}>{formatISTTime(time)} IST</span>
              </div>
            </div>
          </div>
        </header>

        {/* Live Index Ticker */}
        <div className="ticker-bar">
          <div className="ticker-item">
            <span style={{ color: '#e5e7eb', fontWeight: 'bold' }}>NIFTY 50</span>
            <span style={{ color: '#6b7280' }}>24,782.45</span>
            <span style={{ color: '#22c55e', fontWeight: 'bold' }}>▲ 1.17%</span>
          </div>
          <div className="ticker-item">
            <span style={{ color: '#e5e7eb', fontWeight: 'bold' }}>SENSEX</span>
            <span style={{ color: '#6b7280' }}>81,742.38</span>
            <span style={{ color: '#22c55e', fontWeight: 'bold' }}>▲ 1.22%</span>
          </div>
          <div className="ticker-item">
            <span style={{ color: '#e5e7eb', fontWeight: 'bold' }}>BANKNIFTY</span>
            <span style={{ color: '#6b7280' }}>53,218.75</span>
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>▼ 0.27%</span>
          </div>
          <div className="ticker-item">
            <span style={{ color: '#e5e7eb', fontWeight: 'bold' }}>INDIAVIX</span>
            <span style={{ color: '#6b7280' }}>14.82</span>
            <span style={{ color: '#22c55e', fontWeight: 'bold' }}>▲ 5.96%</span>
          </div>
          <div className="ticker-item">
            <span style={{ color: '#e5e7eb', fontWeight: 'bold' }}>USD/INR</span>
            <span style={{ color: '#6b7280' }}>83.12</span>
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>▼ 0.12%</span>
          </div>
          <div className="ticker-item">
            <span style={{ color: '#e5e7eb', fontWeight: 'bold' }}>GOLD</span>
            <span style={{ color: '#6b7280' }}>71,450</span>
            <span style={{ color: '#22c55e', fontWeight: 'bold' }}>▲ 0.45%</span>
          </div>
          <div className="ticker-item" style={{ borderRight: 'none' }}>
            <span style={{ color: '#e5e7eb', fontWeight: 'bold' }}>CRUDE</span>
            <span style={{ color: '#6b7280' }}>6,820</span>
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>▼ 0.82%</span>
          </div>
        </div>

        {/* Content Scrolling Area */}
        <main className="content-area">
          
          {/* ===== ROW 1: Index Cards + Sentiment ===== */}
          <div className="row-1">
            {/* Card 1: Nifty 50 */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '9px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold' }}>NIFTY 50</div>
                  <div style={{ fontSize: '8px', color: '#4b5563' }}>NSE INDICES</div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#22c55e' }}>▲ 1.17%</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '2px 0' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#f9fafb', fontFamily: 'monospace' }}>24,782.45</span>
              </div>

              <div style={{ height: '36px', width: '100%', margin: '2px 0' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={niftyData}>
                    <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#4b5563', borderTop: '1px solid #1c1f2e', paddingTop: '3px' }}>
                <span>High <span style={{ color: '#f9fafb', fontWeight: 'bold', fontSize: '10px' }}>24,831.90</span></span>
                <span>Low <span style={{ color: '#f9fafb', fontWeight: 'bold', fontSize: '10px' }}>24,487.65</span></span>
              </div>
            </div>

            {/* Card 2: Sensex */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '9px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold' }}>SENSEX</div>
                  <div style={{ fontSize: '8px', color: '#4b5563' }}>BSE INDICES</div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#22c55e' }}>▲ 1.22%</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '2px 0' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#f9fafb', fontFamily: 'monospace' }}>81,742.38</span>
              </div>

              <div style={{ height: '36px', width: '100%', margin: '2px 0' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sensexData}>
                    <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#4b5563', borderTop: '1px solid #1c1f2e', paddingTop: '3px' }}>
                <span>High <span style={{ color: '#f9fafb', fontWeight: 'bold', fontSize: '10px' }}>81,924.10</span></span>
                <span>Low <span style={{ color: '#f9fafb', fontWeight: 'bold', fontSize: '10px' }}>80,718.30</span></span>
              </div>
            </div>

            {/* Card 3: BankNifty */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '9px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold' }}>BANKNIFTY</div>
                  <div style={{ fontSize: '8px', color: '#4b5563' }}>NSE INDICES</div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#ef4444' }}>▼ 0.27%</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '2px 0' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#f9fafb', fontFamily: 'monospace' }}>53,218.75</span>
              </div>

              <div style={{ height: '36px', width: '100%', margin: '2px 0' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bankData}>
                    <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#4b5563', borderTop: '1px solid #1c1f2e', paddingTop: '3px' }}>
                <span>High <span style={{ color: '#f9fafb', fontWeight: 'bold', fontSize: '10px' }}>53,587.40</span></span>
                <span>Low <span style={{ color: '#f9fafb', fontWeight: 'bold', fontSize: '10px' }}>53,048.90</span></span>
              </div>
            </div>

            {/* Card 4: Market Sentiment */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '9px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold' }}>MARKET SENTIMENT</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#22c55e', marginTop: '1px' }}>Bullish</div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280' }}>72 / 100</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', height: '40px', margin: '2px 0' }}>
                <svg viewBox="0 0 100 58" style={{ width: '82px' }}>
                  {/* Semicircle arcs */}
                  <path d="M 10 50 A 40 40 0 0 1 30 15.3" fill="none" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 30 15.3 A 40 40 0 0 1 70 15.3" fill="none" stroke="#f59e0b" strokeWidth="10" />
                  <path d="M 70 15.3 A 40 40 0 0 1 90 50" fill="none" stroke="#22c55e" strokeWidth="10" strokeLinecap="round" />
                  {/* Needle */}
                  <line x1="50" y1="50" x2={sentimentNeedle.x} y2={sentimentNeedle.y} stroke="#f9fafb" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="4.5" fill="#f9fafb" />
                </svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#4b5563', borderTop: '1px solid #1c1f2e', paddingTop: '3px' }}>
                <span>Today <span style={{ color: '#22c55e', fontWeight: 'bold' }}>▲ 12</span></span>
                <span>Yesterday <span style={{ color: '#9ca3af', fontWeight: 'bold' }}>60/100</span></span>
              </div>
            </div>
          </div>

          {/* ===== ROW 2: Breadth + Heatmap ===== */}
          <div className="row-2">
            {/* Market Breadth */}
            <div className="card">
              <div style={{ fontSize: '9px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>MARKET BREADTH</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1 }}>
                {/* Advances left */}
                <div style={{ lineHeight: 1.1 }}>
                  <div style={{ fontSize: '8px', color: '#9ca3af' }}>ADVANCES</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#22c55e', fontFamily: 'monospace' }}>1847</div>
                  <div style={{ fontSize: '10px', color: '#22c55e', fontWeight: 'bold' }}>(55%)</div>
                </div>

                {/* Semicircle Progress Breadth gauge */}
                <div style={{ height: '46px' }}>
                  <svg viewBox="0 0 100 58" style={{ width: '92px' }}>
                    {/* Red base */}
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#ef4444" strokeWidth="9" strokeLinecap="round" />
                    {/* Green advances overlay */}
                    <path d="M 50 10 A 40 40 0 0 1 90 50" fill="none" stroke="#22c55e" strokeWidth="9" strokeLinecap="round" />
                    {/* Needle */}
                    <line x1="50" y1="50" x2={breadthNeedle.x} y2={breadthNeedle.y} stroke="#f9fafb" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="4" fill="#f9fafb" />
                  </svg>
                </div>

                {/* Declines right */}
                <div style={{ textAlign: 'right', lineHeight: 1.1 }}>
                  <div style={{ fontSize: '8px', color: '#9ca3af' }}>DECLINES</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444', fontFamily: 'monospace' }}>1423</div>
                  <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: 'bold' }}>(42%)</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '9px', color: '#9ca3af', borderTop: '1px solid #1c1f2e', paddingTop: '3px', marginTop: '4px', fontWeight: '600' }}>
                UNCHANGED 112 (3%)
              </div>
            </div>

            {/* Sector Heatmap */}
            <div className="card">
              <div style={{ fontSize: '9px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>SECTOR HEATMAP</div>
              <div className="heatmap-grid">
                {/* Row 1 cells */}
                <a className="heatmap-cell" style={{ backgroundColor: '#14532d' }}>
                  <span style={{ fontSize: '9px', color: '#ffffff', fontWeight: 'bold' }}>IT</span>
                  <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 'bold', fontFamily: 'monospace' }}>+3.42%</span>
                </a>
                <a className="heatmap-cell" style={{ backgroundColor: '#166534' }}>
                  <span style={{ fontSize: '9px', color: '#ffffff', fontWeight: 'bold' }}>PHARMA</span>
                  <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 'bold', fontFamily: 'monospace' }}>+1.92%</span>
                </a>
                <a className="heatmap-cell" style={{ backgroundColor: '#7f1d1d' }}>
                  <span style={{ fontSize: '9px', color: '#ffffff', fontWeight: 'bold' }}>ENERGY</span>
                  <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 'bold', fontFamily: 'monospace' }}>-1.68%</span>
                </a>
                <a className="heatmap-cell" style={{ backgroundColor: '#14532d' }}>
                  <span style={{ fontSize: '9px', color: '#ffffff', fontWeight: 'bold' }}>CONSUMER</span>
                  <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 'bold', fontFamily: 'monospace' }}>+1.64%</span>
                </a>

                {/* Row 2 cells */}
                <a className="heatmap-cell" style={{ backgroundColor: '#991b1b' }}>
                  <span style={{ fontSize: '9px', color: '#ffffff', fontWeight: 'bold' }}>BANKING</span>
                  <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 'bold', fontFamily: 'monospace' }}>-1.24%</span>
                </a>
                <a className="heatmap-cell" style={{ backgroundColor: '#166534' }}>
                  <span style={{ fontSize: '9px', color: '#ffffff', fontWeight: 'bold' }}>FIN SVCS</span>
                  <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 'bold', fontFamily: 'monospace' }}>+0.84%</span>
                </a>
                <a className="heatmap-cell" style={{ backgroundColor: '#14532d' }}>
                  <span style={{ fontSize: '9px', color: '#ffffff', fontWeight: 'bold' }}>AUTO</span>
                  <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 'bold', fontFamily: 'monospace' }}>+2.84%</span>
                </a>
                <a className="heatmap-cell" style={{ backgroundColor: '#1a4731' }}>
                  <span style={{ fontSize: '9px', color: '#ffffff', fontWeight: 'bold' }}>FMCG</span>
                  <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 'bold', fontFamily: 'monospace' }}>+0.84%</span>
                </a>
              </div>
            </div>
          </div>

          {/* ===== ROW 3: Gainers + Losers + News ===== */}
          <div className="row-3">
            {/* Top Gainers */}
            <div className="card" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '9px', color: '#f9fafb', fontWeight: 'bold', textTransform: 'uppercase' }}>TOP GAINERS</span>
                <a style={{ fontSize: '9px', color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer' }}>View All ›</a>
              </div>

              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div className="table-row" style={{ borderBottom: '1px solid #1c1f2e', paddingBottom: '3px' }}>
                  <span style={{ color: '#4b5563' }}>#</span>
                  <span style={{ color: '#9ca3af' }}>SYMBOL</span>
                  <span style={{ color: '#9ca3af', textAlign: 'right' }}>PRICE</span>
                  <span style={{ color: '#9ca3af', textAlign: 'right' }}>CHG%</span>
                </div>

                <div className="table-row">
                  <span style={{ color: '#4b5563' }}>1</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>TATAMOTORS</span>
                  <span style={{ color: '#f9fafb', textAlign: 'right', fontFamily: 'monospace' }}>₹982.45</span>
                  <span style={{ color: '#22c55e', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace' }}>+5.22%</span>
                </div>
                <div className="table-row">
                  <span style={{ color: '#4b5563' }}>2</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>ADANIENT</span>
                  <span style={{ color: '#f9fafb', textAlign: 'right', fontFamily: 'monospace' }}>₹3247.80</span>
                  <span style={{ color: '#22c55e', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace' }}>+4.58%</span>
                </div>
                <div className="table-row">
                  <span style={{ color: '#4b5563' }}>3</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>WIPRO</span>
                  <span style={{ color: '#f9fafb', textAlign: 'right', fontFamily: 'monospace' }}>₹542.30</span>
                  <span style={{ color: '#22c55e', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace' }}>+4.40%</span>
                </div>
                <div className="table-row">
                  <span style={{ color: '#4b5563' }}>4</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>BAJFINANCE</span>
                  <span style={{ color: '#f9fafb', textAlign: 'right', fontFamily: 'monospace' }}>₹7842.15</span>
                  <span style={{ color: '#22c55e', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace' }}>+3.95%</span>
                </div>
                <div className="table-row">
                  <span style={{ color: '#4b5563' }}>5</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>HCLTECH</span>
                  <span style={{ color: '#f9fafb', textAlign: 'right', fontFamily: 'monospace' }}>₹1847.90</span>
                  <span style={{ color: '#22c55e', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace' }}>+3.50%</span>
                </div>
              </div>
            </div>

            {/* Top Losers */}
            <div className="card" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '9px', color: '#ef4444', fontWeight: 'bold', textTransform: 'uppercase' }}>TOP LOSERS</span>
                <a style={{ fontSize: '9px', color: '#ef4444', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer' }}>View All ›</a>
              </div>

              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div className="table-row" style={{ borderBottom: '1px solid #1c1f2e', paddingBottom: '3px' }}>
                  <span style={{ color: '#4b5563' }}>#</span>
                  <span style={{ color: '#9ca3af' }}>SYMBOL</span>
                  <span style={{ color: '#9ca3af', textAlign: 'right' }}>PRICE</span>
                  <span style={{ color: '#9ca3af', textAlign: 'right' }}>CHG%</span>
                </div>

                <div className="table-row">
                  <span style={{ color: '#4b5563' }}>1</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>HDFCBANK</span>
                  <span style={{ color: '#f9fafb', textAlign: 'right', fontFamily: 'monospace' }}>₹1642.30</span>
                  <span style={{ color: '#ef4444', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace' }}>-2.88%</span>
                </div>
                <div className="table-row">
                  <span style={{ color: '#4b5563' }}>2</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>SBIN</span>
                  <span style={{ color: '#f9fafb', textAlign: 'right', fontFamily: 'monospace' }}>₹824.50</span>
                  <span style={{ color: '#ef4444', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace' }}>-2.65%</span>
                </div>
                <div className="table-row">
                  <span style={{ color: '#4b5563' }}>3</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>ICICIBANK</span>
                  <span style={{ color: '#f9fafb', textAlign: 'right', fontFamily: 'monospace' }}>₹1284.60</span>
                  <span style={{ color: '#ef4444', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace' }}>-2.49%</span>
                </div>
                <div className="table-row">
                  <span style={{ color: '#4b5563' }}>4</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>KOTAKBANK</span>
                  <span style={{ color: '#f9fafb', textAlign: 'right', fontFamily: 'monospace' }}>₹1842.70</span>
                  <span style={{ color: '#ef4444', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace' }}>-2.24%</span>
                </div>
                <div className="table-row">
                  <span style={{ color: '#4b5563' }}>5</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>ONGC</span>
                  <span style={{ color: '#f9fafb', textAlign: 'right', fontFamily: 'monospace' }}>₹284.30</span>
                  <span style={{ color: '#ef4444', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace' }}>-2.00%</span>
                </div>
              </div>
            </div>

            {/* Market News */}
            <div className="card" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase' }}>MARKET NEWS</span>
                <a style={{ fontSize: '9px', color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer' }}>View All</a>
              </div>

              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #0e1018', paddingBottom: '3.5px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#e5e7eb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>RBI keeps repo rate unchanged; maintains accommodative stance</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#4b5563', marginTop: '1px' }}>
                    <span>Economic Times</span>
                    <span>2m ago</span>
                  </div>
                </div>
                <div style={{ borderBottom: '1px solid #0e1018', paddingBottom: '3.5px', paddingTop: '3px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#e5e7eb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>IT stocks rally as US tech spending shows strong growth</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#4b5563', marginTop: '1px' }}>
                    <span>Moneycontrol</span>
                    <span>15m ago</span>
                  </div>
                </div>
                <div style={{ borderBottom: '1px solid #0e1018', paddingBottom: '3.5px', paddingTop: '3px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#e5e7eb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Global markets trade mixed ahead of US Fed decision</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#4b5563', marginTop: '1px' }}>
                    <span>Bloomberg</span>
                    <span>35m ago</span>
                  </div>
                </div>
                <div style={{ paddingTop: '3px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#e5e7eb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Crude oil prices fall on weak global demand outlook</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#4b5563', marginTop: '1px' }}>
                    <span>CNBC TV18</span>
                    <span>1h ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== ROW 4: NIFTY Chart + AI Outlook ===== */}
          <div className="row-4">
            {/* Nifty 50 Chart */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase' }}>NIFTY 50 CHART</span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#22c55e', fontFamily: 'monospace' }}>24,782.45 +287.35 (1.17%)</span>
                  
                  {/* Timeline Switch tabs */}
                  <div style={{ display: 'flex', gap: '3px', backgroundColor: '#0b0d12', padding: '2px', borderRadius: '4px' }}>
                    <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '3px', backgroundColor: '#1d3a8a', color: '#93c5fd', fontWeight: 'bold', cursor: 'pointer' }}>1D</span>
                    <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '3px', color: '#6b7280', cursor: 'pointer' }}>1W</span>
                    <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '3px', color: '#6b7280', cursor: 'pointer' }}>1M</span>
                    <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '3px', color: '#6b7280', cursor: 'pointer' }}>3M</span>
                    <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '3px', color: '#6b7280', cursor: 'pointer' }}>1Y</span>
                    <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '3px', color: '#6b7280', cursor: 'pointer' }}>5Y</span>
                  </div>
                </div>
              </div>

              <div style={{ height: '130px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={niftyData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <defs>
                      <linearGradient id="niftyChartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.05} />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1c1f2e" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="t" stroke="#374151" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis domain={[24400, 24850]} stroke="#374151" fontSize={9} tickLine={false} axisLine={false} orientation="right" />
                    <Tooltip contentStyle={{ backgroundColor: '#131620', border: '1px solid #1c1f2e', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} fill="url(#niftyChartGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Market Outlook */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <div>
                  <div style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase' }}>AI MARKET OUTLOOK</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#22c55e' }}>BULLISH</span>
                    <span style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer' }}>Confidence: 72% ›</span>
                  </div>
                </div>

                {/* Small AreaChart */}
                <div style={{ width: '80px', height: '36px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={aiForecastData}>
                      <Area type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={1} fill="none" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ fontSize: '9.5px', color: '#6b7280', lineHeight: 1.45, borderTop: '1px solid #1c1f2e', paddingTop: '5px', paddingBottom: '5px' }}>
                Market showing strong bullish momentum with positive indicators across major sectors. Banking and IT sectors expected to lead the rally.
              </div>

              {/* Key Factors */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Key Factors</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#14532d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7.5px', color: '#22c55e', fontWeight: 'bold' }}>✓</div>
                    <span style={{ fontSize: '9.5px', color: '#f9fafb' }}>Global cues</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#14532d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7.5px', color: '#22c55e', fontWeight: 'bold' }}>✓</div>
                    <span style={{ fontSize: '9.5px', color: '#f9fafb' }}>RBI policy</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#14532d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7.5px', color: '#22c55e', fontWeight: 'bold' }}>✓</div>
                    <span style={{ fontSize: '9.5px', color: '#f9fafb' }}>Earnings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default App;
