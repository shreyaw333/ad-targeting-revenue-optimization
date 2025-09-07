import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Overview from './pages/Overview';
import Campaigns from './pages/Campaigns';
import Analytics from './pages/Analytics';
import ABTesting from './pages/ABTesting';
import Models from './pages/Models';
import Settings from './pages/Settings';
import { DataProvider } from './context/DataContext';
import './App.css';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="app">
          <Header />
          <div className="app-content">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/ab-testing" element={<ABTesting />} />
                <Route path="/models" element={<Models />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;