//
//  App.tsx
//  ChiEAC
//
//  Created by Shivaang Kumar on 8/16/25.
//

import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './config/firebase';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CoreWorkManager from './pages/CoreWorkManager';
import ImpactStatsManager from './pages/ImpactStatsManager';
import TeamManager from './pages/TeamManager';
import ProgramsManager from './pages/ProgramsManager';
import ArticlesManager from './pages/ArticlesManager';
import Layout from './components/Layout';
import './index.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
          <span className="text-slate-300 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/core-work" element={<CoreWorkManager />} />
          <Route path="/impact-stats" element={<ImpactStatsManager />} />
          <Route path="/team" element={<TeamManager />} />
          <Route path="/programs" element={<ProgramsManager />} />
          <Route path="/articles" element={<ArticlesManager />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
