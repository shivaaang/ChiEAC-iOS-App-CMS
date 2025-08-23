//
//  Layout.tsx
//  ChiEAC
//
//  Main application layout with navigation and sidebar
//  Created by Shivaang Kumar on 8/16/25.
//

import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { 
      path: '/', 
      label: 'Overview', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ), 
      description: 'Dashboard & insights' 
    },
    { 
      path: '/core-work', 
      label: 'Core Work', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ), 
      description: 'Mission & values' 
    },
    { 
      path: '/impact-stats', 
      label: 'Impact', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ), 
      description: 'Metrics & analytics' 
    },
    { 
      path: '/team', 
      label: 'Team', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ), 
      description: 'People & roles' 
    },
    { 
      path: '/programs', 
      label: 'Programs', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ), 
      description: 'Educational initiatives' 
    },
    { 
      path: '/articles', 
      label: 'Articles', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ), 
      description: 'Content & stories' 
    },
    { 
      path: '/form-submissions', 
      label: 'Form Submissions', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ), 
      description: 'Messages from the app' 
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/60 sticky top-0 z-50">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                  <img 
                    src="/chieac-logo.png" 
                    alt="ChiEAC Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h1 className="text-lg font-bold text-white">ChiEAC CMS</h1>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMobileMenu}></div>
            <div className="fixed left-0 top-0 w-64 h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/60 transform transition-transform duration-300">
              {/* Mobile Logo */}
              <div className="flex items-center px-6 py-8 border-b border-slate-800/60">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                      <img 
                        src="/chieac-logo.png" 
                        alt="ChiEAC Logo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h1 className="text-xl font-bold text-white">ChiEAC CMS</h1>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-6 py-6 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-orange-500/20 text-orange-400 shadow-lg shadow-orange-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span className={`mr-3 transition-colors duration-200 ${
                      isActive(item.path) ? 'text-orange-400' : 'text-slate-400 group-hover:text-slate-300'
                    }`}>
                      {item.icon}
                    </span>
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </nav>

              {/* Mobile Logout */}
              <div className="p-6 border-t border-slate-800/60">
                <button
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                  className="flex items-center w-full px-3 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:z-40 lg:w-64 lg:h-screen lg:bg-slate-900/95 lg:backdrop-blur-xl lg:border-r lg:border-slate-800/60 lg:block">{/* Logo */}
        {/* Logo */}
        <div className="flex items-center px-6 py-8 border-b border-slate-800/60">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="/chieac-logo.png" 
                  alt="ChiEAC Logo" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">ChiEAC</h1>
              <p className="text-xs text-slate-400 font-medium">Content Studio</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-300 relative ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-white border border-violet-500/30 shadow-lg shadow-violet-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {isActive(item.path) && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-400 to-purple-500 rounded-r-full"></div>
                )}
                <div className={`mr-3 transition-colors duration-300 ${
                  isActive(item.path) 
                    ? 'text-violet-400' 
                    : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{item.label}</div>
                  <div className={`text-xs mt-0.5 ${
                    isActive(item.path) 
                      ? 'text-slate-300' 
                      : 'text-slate-500 group-hover:text-slate-400'
                  }`}>
                    {item.description}
                  </div>
                </div>
                {isActive(item.path) && (
                  <div className="w-2 h-2 bg-violet-400 rounded-full shadow-sm shadow-violet-400/50"></div>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Status Card */}
        <div className="mx-4 mt-8">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-sm rounded-lg p-4 border border-slate-700/60">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-300">System Status</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-emerald-400 font-medium">Online</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Database</span>
                <span className="text-xs text-emerald-400">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Last Sync</span>
                <span className="text-xs text-slate-300">2m ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Admin</div>
                <div className="text-xs text-slate-400">Super User</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
              title="Sign Out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Top Header Bar */}
        <header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/60 sticky top-0 z-30 hidden lg:block">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold text-white">
                  {navItems.find(item => isActive(item.path))?.label || 'ChiEAC CMS'}
                </h2>
                <div className="hidden md:flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 text-xs font-medium">Live</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h5a2 2 0 002-2v-5a2 2 0 00-2-2H4a2 2 0 00-2 2v5a2 2 0 002 2z" />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></div>
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="bg-slate-950 min-h-screen">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
