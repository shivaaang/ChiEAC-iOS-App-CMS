//
//  Dashboard.tsx
//  ChiEAC
//
//  Main dashboard with overview statistics and quick navigation
//  Created by Shivaang Kumar on 8/16/25.
//

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    coreWork: 0,
    impactStats: 0,
    teamMembers: 0,
    programs: 0,
    articles: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coreWorkSnap, impactStatsSnap, teamMembersSnap, programsSnap, articlesSnap] = await Promise.all([
          getDocs(collection(db, 'core_work')),
          getDocs(collection(db, 'impact_stats')),
          getDocs(collection(db, 'team_members')),
          getDocs(collection(db, 'programs')),
          getDocs(collection(db, 'articles')),
        ]);

        setStats({
          coreWork: coreWorkSnap.size,
          impactStats: impactStatsSnap.size,
          teamMembers: teamMembersSnap.size,
          programs: programsSnap.size,
          articles: articlesSnap.size,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Core Work Items', 
      value: stats.coreWork, 
      change: stats.coreWork > 0 ? '+1 this week' : 'No items yet',
      trend: stats.coreWork > 0 ? 'up' : 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-violet-500 to-purple-600'
    },
    { 
      label: 'Impact Statistics', 
      value: stats.impactStats, 
      change: stats.impactStats > 0 ? '+3 updated' : 'No stats yet',
      trend: stats.impactStats > 0 ? 'up' : 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-600'
    },
    { 
      label: 'Team Members', 
      value: stats.teamMembers, 
      change: stats.teamMembers > 0 ? '+2 this month' : 'No members yet',
      trend: stats.teamMembers > 0 ? 'up' : 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      label: 'Programs', 
      value: stats.programs, 
      change: stats.programs > 0 ? 'All active' : 'No programs yet',
      trend: 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'from-orange-500 to-red-600'
    },
    { 
      label: 'Articles', 
      value: stats.articles, 
      change: stats.articles > 0 ? 'Published' : 'No articles yet',
      trend: 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-pink-500 to-rose-600'
    },
  ];

  const quickActions = [
    {
      title: 'Manage Core Work',
      description: 'Update mission statements and organizational values',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      link: '/core-work',
      color: 'from-violet-500/20 to-purple-500/20',
      border: 'border-violet-500/30',
      iconColor: 'text-violet-400'
    },
    {
      title: 'Update Impact Stats',
      description: 'Add latest metrics and performance data',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      link: '/impact-stats',
      color: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-400'
    },
    {
      title: 'Manage Team',
      description: 'Add team members and update roles',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      link: '/team',
      color: 'from-blue-500/20 to-indigo-500/20',
      border: 'border-blue-500/30',
      iconColor: 'text-blue-400'
    },
    {
      title: 'Educational Programs',
      description: 'Create and manage learning initiatives',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      link: '/programs',
      color: 'from-orange-500/20 to-red-500/20',
      border: 'border-orange-500/30',
      iconColor: 'text-orange-400'
    },
  ];

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
          <span className="text-slate-300 font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-700/60">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Welcome to ChiEAC CMS
                </h1>
                <p className="text-base sm:text-lg text-slate-300">
                  Your comprehensive content management hub for educational advocacy
                </p>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 sm:px-4 py-2 self-start sm:self-auto">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 text-sm font-medium">All systems operational</span>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Last sync: <span className="text-slate-300 font-medium">2 minutes ago</span> • 
              Status: <span className="text-emerald-400 font-medium">Connected</span>
            </div>
          </div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-purple-500/5"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/60 hover:border-slate-600/60 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                {stat.icon}
              </div>
              {stat.trend === 'up' && (
                <div className="flex items-center text-emerald-400">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm font-medium text-slate-300">{stat.label}</div>
              <div className="text-xs text-slate-400">{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Quick Actions</h2>
          <span className="text-sm text-slate-400">Jump straight into managing your content</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`group block p-6 bg-gradient-to-br ${action.color} backdrop-blur-sm rounded-xl border ${action.border} hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg bg-slate-800/60 ${action.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors duration-300">
                    {action.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {action.description}
                  </p>
                  <div className="flex items-center mt-4 text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                    <span className="text-xs font-medium">Get started</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/60">
        <h2 className="text-lg font-semibold text-white mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Database Status</span>
              <span className="text-sm text-emerald-400 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Storage Usage</span>
              <span className="text-sm text-slate-300 font-medium">2.3 GB / 10 GB</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full" style={{ width: '23%' }}></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">API Response</span>
              <span className="text-sm text-emerald-400 font-medium">142ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Uptime</span>
              <span className="text-sm text-slate-300 font-medium">99.9%</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Last Backup</span>
              <span className="text-sm text-slate-300 font-medium">1 hour ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Version</span>
              <span className="text-sm text-slate-300 font-medium">v2.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
