'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCameras, getAlerts, getUnacknowledgedAlerts, getCriticalAlerts, getDetectionSlots } from '@/lib/types';
import { recordLogout, getLoginHistory, getActiveUsers } from '@/lib/auth';
import type { Camera, Alert, DetectionSlot } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unacknowledgedAlerts, setUnacknowledgedAlerts] = useState<Alert[]>([]);
  const [criticalAlerts, setCriticalAlerts] = useState<Alert[]>([]);
  const [detectionSlots, setDetectionSlots] = useState<DetectionSlot[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cameras' | 'alerts' | 'history' | 'slots'>('dashboard');
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(currentUser));

    setCameras(getCameras());
    setAlerts(getAlerts());
    setUnacknowledgedAlerts(getUnacknowledgedAlerts());
    setCriticalAlerts(getCriticalAlerts());
    setDetectionSlots(getDetectionSlots());
    setLoginHistory(getLoginHistory());
    setActiveUsers(getActiveUsers());

    const interval = setInterval(() => {
      setCameras(getCameras());
      setAlerts(getAlerts());
      setUnacknowledgedAlerts(getUnacknowledgedAlerts());
      setCriticalAlerts(getCriticalAlerts());
      setDetectionSlots(getDetectionSlots());
      setLoginHistory(getLoginHistory());
      setActiveUsers(getActiveUsers());
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = () => {
    if (user) {
      recordLogout(user.id);
    }
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const getStatusColor = (status: Camera['status']) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      case 'recording': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'low': return 'text-blue-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getGreeting = () => {
    if (!mounted) return 'Welcome';
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const onlineCameras = cameras.filter(c => c.status !== 'offline').length;
  const totalCameras = cameras.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex">
        {/* Sidebar */}
        <aside className="w-80 min-h-screen bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 backdrop-blur-3xl border-r border-slate-800/50 p-6 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-yellow-600 p-[2px] shadow-2xl shadow-orange-500/30">
              <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden">
                <img src="/phonix-logo.png" alt="PHONIX" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">PHONIX</h1>
              <p className="text-xs text-slate-500 font-semibold tracking-widest uppercase mt-1">AI Surveillance</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-8">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Monitoring</p>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                    activeTab === 'dashboard'
                      ? 'bg-gradient-to-r from-orange-500/20 via-red-500/20 to-yellow-500/20 text-orange-400 border border-orange-500/40 shadow-2xl shadow-orange-500/20'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  <span className="font-medium">Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('cameras')}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                    activeTab === 'cameras'
                      ? 'bg-gradient-to-r from-orange-500/20 via-red-500/20 to-yellow-500/20 text-orange-400 border border-orange-500/40 shadow-2xl shadow-orange-500/20'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Cameras</span>
                </button>

                <button
                  onClick={() => setActiveTab('alerts')}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                    activeTab === 'alerts'
                      ? 'bg-gradient-to-r from-orange-500/20 via-red-500/20 to-yellow-500/20 text-orange-400 border border-orange-500/40 shadow-2xl shadow-orange-500/20'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="font-medium">Alerts</span>
                  {unacknowledgedAlerts.length > 0 && (
                    <span className="ml-auto bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs px-3 py-1.5 rounded-full shadow-xl shadow-red-500/30 font-bold">
                      {unacknowledgedAlerts.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('slots')}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                    activeTab === 'slots'
                      ? 'bg-gradient-to-r from-orange-500/20 via-red-500/20 to-yellow-500/20 text-orange-400 border border-orange-500/40 shadow-2xl shadow-orange-500/20'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">AI Events</span>
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                    activeTab === 'history'
                      ? 'bg-gradient-to-r from-orange-500/20 via-red-500/20 to-yellow-500/20 text-orange-400 border border-orange-500/40 shadow-2xl shadow-orange-500/20'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-medium">Analytics</span>
                </button>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800/60">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 group"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>

          {/* System Status */}
          <div className="mt-auto pt-8 border-t border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
              <span className="text-sm text-slate-400 font-semibold">System Operational</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Authentication & Monitoring</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10">
          {!mounted ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-slate-400 text-lg">Loading...</div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-10">
                <p className="text-sm font-bold text-orange-400 tracking-widest uppercase mb-2">AI Security Operations</p>
                <h1 className="text-4xl font-bold text-white tracking-tight">{getGreeting()}, {user?.name?.split(' ')[0] || 'Admin'}</h1>
              </div>

          {/* Dashboard Tab Content */}
          {activeTab === 'dashboard' && mounted && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-gradient-to-br from-slate-800/70 via-slate-900/70 to-slate-950/70 backdrop-blur-3xl rounded-3xl p-7 border border-slate-700/50 shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 hover:border-orange-500/40 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400/30 via-red-500/20 to-orange-600/30 border border-orange-500/50 flex items-center justify-center shadow-xl shadow-orange-500/30">
                      <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className={`text-sm font-bold ${onlineCameras > 0 ? 'text-orange-400' : 'text-slate-500'}`}>{onlineCameras > 0 ? 'Active' : 'Inactive'}</span>
                  </div>
                  <p className="text-5xl font-bold text-white mb-2 tracking-tight">{onlineCameras} / {totalCameras}</p>
                  <p className="text-slate-400 text-sm font-semibold">Cameras Online</p>
                  <p className="text-slate-500 text-xs mt-3">{onlineCameras} cameras connected</p>
                </div>

                <div className="bg-gradient-to-br from-slate-800/70 via-slate-900/70 to-slate-950/70 backdrop-blur-3xl rounded-3xl p-7 border border-slate-700/50 shadow-2xl hover:shadow-red-500/20 transition-all duration-500 hover:border-red-500/40 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400/30 via-rose-500/20 to-red-600/30 border border-red-500/50 flex items-center justify-center shadow-xl shadow-red-500/30">
                      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <span className={`text-sm font-bold ${unacknowledgedAlerts.length > 0 ? 'text-red-400' : 'text-slate-500'}`}>{unacknowledgedAlerts.length > 0 ? 'Active' : 'Clear'}</span>
                  </div>
                  <p className="text-5xl font-bold text-white mb-2 tracking-tight">{String(unacknowledgedAlerts.length).padStart(2, '0')}</p>
                  <p className="text-slate-400 text-sm font-semibold">Active Alerts</p>
                  <p className="text-slate-500 text-xs mt-3">{criticalAlerts.length} critical - {unacknowledgedAlerts.length - criticalAlerts.length} medium</p>
                </div>

                <div className="bg-gradient-to-br from-slate-800/70 via-slate-900/70 to-slate-950/70 backdrop-blur-3xl rounded-3xl p-7 border border-slate-700/50 shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 hover:border-yellow-500/40 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400/30 via-orange-500/20 to-yellow-600/30 border border-yellow-500/50 flex items-center justify-center shadow-xl shadow-yellow-500/30">
                      <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className={`text-sm font-bold ${detectionSlots.filter(s => s.enabled).length > 0 ? 'text-yellow-400' : 'text-slate-500'}`}>{detectionSlots.filter(s => s.enabled).length > 0 ? 'Active' : 'Inactive'}</span>
                  </div>
                  <p className="text-5xl font-bold text-white mb-2 tracking-tight">{detectionSlots.filter(s => s.enabled).length}</p>
                  <p className="text-slate-400 text-sm font-semibold">AI Detection Slots</p>
                  <p className="text-slate-500 text-xs mt-3">{detectionSlots.filter(s => s.enabled).length} slots enabled</p>
                </div>

                <div className="bg-gradient-to-br from-slate-800/70 via-slate-900/70 to-slate-950/70 backdrop-blur-3xl rounded-3xl p-7 border border-slate-700/50 shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 hover:border-orange-500/40 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400/30 via-red-500/20 to-orange-600/30 border border-orange-500/50 flex items-center justify-center shadow-xl shadow-orange-500/30">
                      <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                    <span className="text-slate-500 text-sm font-bold">Pending</span>
                  </div>
                  <p className="text-5xl font-bold text-white mb-2 tracking-tight">0%</p>
                  <p className="text-slate-400 text-sm font-semibold">Storage Saved</p>
                  <p className="text-slate-500 text-xs mt-3">Smart recording not configured</p>
                </div>
              </div>

              {/* Live Camera Feed */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white tracking-tight">AI-assisted real-time monitoring</h2>
                  <span className="text-sm text-slate-400 font-semibold">{onlineCameras} cameras active</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {cameras.slice(0, 4).map((camera, index) => (
                    <div key={camera.id} className="bg-gradient-to-br from-slate-800/70 via-slate-900/70 to-slate-950/70 backdrop-blur-3xl rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:border-cyan-500/40 hover:-translate-y-1">
                      <div className="relative aspect-video bg-slate-950 flex items-center justify-center">
                        <div className="absolute top-5 left-5 flex items-center gap-3">
                          {camera.status !== 'offline' && (
                            <>
                              <span className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-xl shadow-xl shadow-red-500/40 animate-pulse">LIVE</span>
                              <span className="px-4 py-2 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-xl border border-cyan-500/50 shadow-xl shadow-cyan-500/30">AI ACTIVE</span>
                            </>
                          )}
                        </div>
                        <div className="absolute top-5 right-5 text-xs text-slate-400 font-mono bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-700/50">CAM-0{index + 1}</div>
                        <svg className="w-28 h-28 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="p-6 border-t border-slate-700/50 bg-slate-800/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-bold text-xl">{camera.name}</h3>
                            <p className="text-slate-400 text-sm mt-1">{camera.location}</p>
                          </div>
                          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${camera.status === 'online' ? 'bg-green-500/10 text-green-400 border border-green-500/40' : camera.status === 'offline' ? 'bg-red-500/10 text-red-400 border border-red-500/40' : 'bg-blue-500/10 text-blue-400 border border-blue-500/40'}`}>
                            <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
                            <span className="text-sm capitalize font-semibold">{camera.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Security Events */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white tracking-tight">AI + authentication monitoring</h2>
                  <span className="text-sm text-slate-400 font-semibold">Last 24 hours</span>
                </div>
                <div className="bg-gradient-to-br from-slate-800/70 via-slate-900/70 to-slate-950/70 backdrop-blur-3xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                  <div className="space-y-5">
                    {alerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="flex items-center gap-5 p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : 'yellow'}-500/30 to-${alert.severity === 'critical' ? 'rose' : alert.severity === 'high' ? 'amber' : 'orange'}-600/30 border border-${alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : 'yellow'}-500/50 flex items-center justify-center shadow-xl`}>
                          <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-bold text-xl">{alert.description}</p>
                          <p className="text-slate-400 text-sm mt-1">{alert.cameraName} • {mounted ? new Date(alert.timestamp).toLocaleString() : ''}</p>
                        </div>
                        <span className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                          alert.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-xl shadow-red-500/30' :
                          alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50 shadow-xl shadow-orange-500/30' :
                          'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 shadow-xl shadow-yellow-500/30'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                    ))}
                    {alerts.length === 0 && (
                      <div className="text-center py-16">
                        <svg className="w-20 h-20 text-slate-600 mx-auto mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-slate-400 text-xl font-medium">No recent security events</p>
                      </div>
                    )}
                  </div>

                  {/* Threat Level */}
                  <div className="mt-10 pt-8 border-t border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white font-bold text-xl">Current Threat Level</span>
                      <span className={`px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider ${unacknowledgedAlerts.length > 0 ? "bg-red-500/20 text-red-400 border border-red-500/50 shadow-xl shadow-red-500/30" : "bg-green-500/20 text-green-400 border border-green-500/50 shadow-xl shadow-green-500/30"}`}>
                        {unacknowledgedAlerts.length > 0 ? "HIGH" : "LOW"}
                      </span>
                    </div>
                    <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${unacknowledgedAlerts.length > 0 ? "bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500" : "bg-gradient-to-r from-green-500 to-emerald-500"}`} style={{ width: unacknowledgedAlerts.length > 0 ? '75%' : '10%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Other Tabs Content */}
          {activeTab === 'cameras' && mounted && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Camera Monitoring</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cameras.map((camera) => (
                  <div key={camera.id} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl rounded-2xl p-6 border border-slate-700/60 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:border-cyan-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${camera.status === 'online' ? 'bg-green-500 shadow-lg shadow-green-500/50' : camera.status === 'offline' ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-blue-500 shadow-lg shadow-blue-500/50'}`}></div>
                        <h3 className="text-lg font-semibold text-white">{camera.name}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${camera.status === 'online' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : camera.status === 'offline' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'}`}>{camera.status}</span>
                    </div>
                    <div className="aspect-video bg-slate-950 rounded-xl mb-4 flex items-center justify-center border border-slate-700/50">
                      <svg className="w-20 h-20 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Location: {camera.location}</span>
                      <span className="text-slate-400">
                        Last active: {mounted ? new Date(camera.lastActive).toLocaleTimeString() : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && mounted && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Alerts</h2>
              {alerts.length === 0 ? (
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl rounded-2xl p-12 border border-slate-700/60 shadow-2xl text-center">
                  <svg className="w-20 h-20 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-slate-400 text-lg">No alerts recorded</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl rounded-2xl p-6 border shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 ${
                        alert.acknowledged ? 'border-slate-700/60' : 'border-red-500/40 hover:border-red-500/60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`w-4 h-4 rounded-full mt-2 ${alert.severity === 'critical' ? 'bg-red-500 shadow-lg shadow-red-500/50' : alert.severity === 'high' ? 'bg-orange-500 shadow-lg shadow-orange-500/50' : alert.severity === 'medium' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 'bg-blue-500 shadow-lg shadow-blue-500/50'}`}></div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{alert.cameraName}</h3>
                            <p className="text-slate-400 mt-1">{alert.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-slate-500 capitalize">{alert.type}</span>
                              <span className="text-slate-500 capitalize">{alert.severity}</span>
                              <span className="text-slate-500">
                                {mounted ? new Date(alert.timestamp).toLocaleString() : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        {!alert.acknowledged && (
                          <button
                            onClick={() => {/* Acknowledge alert */}}
                            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-cyan-500/30"
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                      {alert.acknowledged && (
                        <p className="text-slate-500 text-sm mt-3">
                          Acknowledged by {alert.acknowledgedBy} at{' '}
                          {alert.acknowledgedAt && mounted ? new Date(alert.acknowledgedAt).toLocaleString() : ''}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && mounted && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Login History</h2>
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl rounded-2xl border border-slate-700/60 shadow-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Login Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Logout Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {loginHistory.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{entry.userName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                          {mounted ? new Date(entry.loginTime).toLocaleString() : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                          {entry.logoutTime && mounted ? new Date(entry.logoutTime).toLocaleString() : 'Active'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-400">{entry.ipAddress}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                              entry.logoutTime
                                ? 'bg-slate-700 text-slate-400 border border-slate-600'
                                : 'bg-green-500/20 text-green-400 border border-green-500/40'
                            }`}
                          >
                            {entry.logoutTime ? 'Logged out' : 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'slots' && mounted && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">AI Detection Slots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {detectionSlots.map((slot) => (
                  <div key={slot.id} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl rounded-2xl p-6 border border-slate-700/60 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:border-cyan-500/30">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-semibold text-white">{slot.name}</h3>
                      <div className={`w-4 h-4 rounded-full ${slot.enabled ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-500'}`}></div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-slate-400 text-sm mb-2 font-medium">Detection Types</p>
                        <div className="flex flex-wrap gap-2">
                          {slot.filters.types.map((type) => (
                            <span key={type} className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm capitalize border border-cyan-500/30">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-2 font-medium">Min Confidence</p>
                        <p className="text-white text-lg font-semibold">{(slot.filters.minConfidence * 100).toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-2 font-medium">Monitored Cameras</p>
                        <div className="flex flex-wrap gap-2">
                          {slot.filters.cameras.map((cam) => (
                            <span key={cam} className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-sm border border-slate-600">
                              {cam}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
