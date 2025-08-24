//
//  Dashboard.tsx
//  ChiEAC
//
//  Professional overview dashboard for ChiEAC iOS App CMS
//  Created by Shivaang Kumar on 8/16/25.
//

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';

interface DashboardStats {
  coreWork: number;
  impactStats: number;
  teamMembers: number;
  programs: number;
  articles: number;
  formSubmissions: number;
  loading: boolean;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    coreWork: 0,
    impactStats: 0,
    teamMembers: 0,
    programs: 0,
    articles: 0,
    formSubmissions: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all collection stats
        const [
          coreWorkSnap,
          impactStatsSnap,
          teamMembersSnap,
          programsSnap,
          articlesSnap,
          formSubmissionsSnap
        ] = await Promise.all([
          getDocs(collection(db, 'core_work')),
          getDocs(collection(db, 'impact_stats')),
          getDocs(collection(db, 'team_members')),
          getDocs(collection(db, 'programs')),
          getDocs(collection(db, 'articles')),
          getDocs(collection(db, 'form_submissions')),
        ]);

        setStats({
          coreWork: coreWorkSnap.size,
          impactStats: impactStatsSnap.size,
          teamMembers: teamMembersSnap.size,
          programs: programsSnap.size,
          articles: articlesSnap.size,
          formSubmissions: formSubmissionsSnap.size,
          loading: false,
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  // Enhanced stats configuration
  const contentMetrics = [
    { 
      label: 'Home Sections', 
      value: stats.coreWork + stats.impactStats,
      sublabel: `${stats.coreWork} Core + ${stats.impactStats} Impact`,
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      color: 'from-emerald-500 to-teal-600',
      status: (stats.coreWork + stats.impactStats) >= 6 ? 'complete' : 'needs-attention'
    },
    { 
      label: 'Team Members', 
      value: stats.teamMembers,
      sublabel: stats.teamMembers > 0 ? 'Active profiles' : 'Setup needed',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      color: 'from-blue-500 to-indigo-600',
      status: stats.teamMembers >= 3 ? 'complete' : 'needs-attention'
    },
    { 
      label: 'Programs', 
      value: stats.programs,
      sublabel: stats.programs > 0 ? 'Educational initiatives' : 'No programs yet',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      color: 'from-violet-500 to-purple-600',
      status: stats.programs >= 2 ? 'complete' : 'needs-attention'
    },
    { 
      label: 'Published Articles', 
      value: stats.articles,
      sublabel: stats.articles > 0 ? 'From Medium sync' : 'Awaiting sync',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'from-pink-500 to-rose-600',
      status: stats.articles >= 1 ? 'complete' : 'neutral'
    },
    { 
      label: 'Form Submissions', 
      value: stats.formSubmissions,
      sublabel: stats.formSubmissions > 0 ? 'User messages' : 'No submissions',
      icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
      color: 'from-amber-500 to-orange-600',
      status: 'neutral'
    },
  ];

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Loading Dashboard</h3>
            <p className="text-slate-400">Gathering insights from your CMS...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 lg:p-8 border border-slate-700/60">
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <img src="/chieac-logo.png" alt="ChiEAC" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  ChiEAC CMS Overview
                </h1>
                <p className="text-violet-300 font-medium">iOS App Content Management</p>
              </div>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
              Professional content management system powering the ChiEAC iOS application. 
              Monitor, manage, and optimize your educational advocacy platform.
            </p>
          </div>
          
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-purple-500/5"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Content Metrics Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Content Overview</h2>
          <span className="text-sm text-slate-400">Real-time data from Firebase</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {contentMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/60 hover:border-slate-600/60 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color} text-white shadow-lg`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={metric.icon} />
                  </svg>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  metric.status === 'complete' ? 'bg-emerald-400' :
                  metric.status === 'needs-attention' ? 'bg-amber-400' : 'bg-slate-500'
                }`}></div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <div className="text-sm font-medium text-slate-300">{metric.label}</div>
                <div className="text-xs text-slate-400">{metric.sublabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Manage Content</h2>
          <span className="text-sm text-slate-400">Access all CMS sections</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/home"
            className="group block p-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl border border-emerald-500/30 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-slate-800/60 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                  Home Content
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Manage Core Work items and Impact statistics for the app home screen
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/team"
            className="group block p-6 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-xl border border-blue-500/30 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-slate-800/60 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                  Team Members
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Manage team member profiles, roles, and organizational structure
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/programs"
            className="group block p-6 bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-violet-500/30 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-slate-800/60 text-violet-400 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors duration-300">
                  Educational Programs
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Create and organize learning initiatives and educational content
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/articles"
            className="group block p-6 bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-sm rounded-xl border border-pink-500/30 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-slate-800/60 text-pink-400 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pink-300 transition-colors duration-300">
                  Articles
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Monitor Medium article sync and manage published content
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/form-submissions"
            className="group block p-6 bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl border border-amber-500/30 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-slate-800/60 text-amber-400 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-300 transition-colors duration-300">
                  Form Submissions
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Review and respond to form submissions from iOS app users
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
