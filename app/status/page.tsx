'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Clock, TrendingUp, Activity, AlertTriangle, Loader } from 'lucide-react';
import Link from 'next/link';

interface Service {
  name: string;
  status: 'operational' | 'degraded' | 'offline';
  description: string;
  responseTime: number;
  uptime: number;
}

interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  startTime: string;
  endTime?: string;
  affectedServices: string[];
}

interface MaintenanceWindow {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  affectedServices: string[];
}

interface StatusData {
  timestamp: string;
  overallStatus: 'operational' | 'degraded' | 'offline';
  services: Service[];
  incidents: Incident[];
  maintenance: MaintenanceWindow[];
  metrics: {
    thisMonth: number;
    lastMonth: number;
    avgResolutionTime: string;
    totalIncidents: number;
    uptime7d: number;
    uptime30d: number;
    uptime90d: number;
  };
}

export default function StatusPage() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Fetch status data
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/status');
        if (!response.ok) throw new Error('Failed to fetch status');
        const data = await response.json();
        setStatusData(data);
        setLastRefresh(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'offline':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'major':
        return 'bg-orange-100 text-orange-800 border border-orange-300';
      case 'minor':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'investigating':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'identified':
        return 'bg-orange-100 text-orange-800 border border-orange-300';
      case 'monitoring':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 border border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  // Calculate overall status
  const overallStatus = statusData?.overallStatus || 'operational';
  const services = statusData?.services || [];
  const incidents = statusData?.incidents || [];
  const maintenanceWindows = statusData?.maintenance || [];
  const incidentMetrics = statusData?.metrics || {
    thisMonth: 0,
    lastMonth: 0,
    avgResolutionTime: '—',
    totalIncidents: 0,
  };

  const uptimeByPeriod = {
    '7d': statusData?.metrics.uptime7d || 99.98,
    '30d': statusData?.metrics.uptime30d || 99.95,
    '90d': statusData?.metrics.uptime90d || 99.92,
  };

  const activeIncidents = incidents.filter((i) => i.status !== 'resolved').length;
  const upcomingMaintenance = maintenanceWindows.filter((m) => new Date(m.startTime) > currentTime).length;

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b-4 border-black py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="mb-4">
            <Link href="/" className="text-sm font-bold text-gray-700 hover:text-black">
              ← Back to Home
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-black mb-2">System Status</h1>
              <p className="text-gray-700 text-lg">Real-time monitoring of T.A.L.A. services</p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-2">
              <div className="text-right">
                <p className="text-xs text-gray-600 uppercase tracking-widest font-bold">Last Updated</p>
                <p className="text-lg font-black text-black">{lastRefresh.toLocaleTimeString()}</p>
              </div>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Loader className="w-4 h-4 animate-spin" />
                  Refreshing...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <section className="bg-red-50 border-b-4 border-red-600">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-bold">Error loading status</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && !statusData ? (
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader className="w-12 h-12 animate-spin text-black" />
              <p className="text-lg font-bold text-gray-700">Loading status data...</p>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Overall Status Banner */}
          <section className="bg-heirlock-green border-b-4 border-black">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Main Status */}
                <div className="md:col-span-2 border-4 border-black p-6 bg-white rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    {getStatusIcon(overallStatus)}
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Overall Status</p>
                      <h2 className="text-2xl font-black text-black capitalize">{overallStatus}</h2>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    {overallStatus === 'operational'
                      ? 'All systems are operating normally.'
                      : overallStatus === 'degraded'
                      ? 'Some services are experiencing issues.'
                      : 'One or more critical services are offline.'}
                  </p>
                </div>

                {/* Uptime */}
                <div className="border-4 border-black p-6 bg-white rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Uptime ({selectedPeriod})</p>
                  <p className="text-3xl font-black text-black mb-3">{uptimeByPeriod[selectedPeriod]}%</p>
                  <div className="flex gap-2">
                    {(['7d', '30d', '90d'] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`text-xs font-bold px-2 py-1 rounded border-2 transition-all ${
                          selectedPeriod === period
                            ? 'bg-black text-white border-black'
                            : 'border-gray-300 text-gray-700 hover:border-black'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Incidents */}
                <div className="border-4 border-black p-6 bg-white rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Active Incidents</p>
                  <p className="text-3xl font-black text-black mb-3">{activeIncidents}</p>
                  <p className="text-xs text-gray-700">
                    {activeIncidents === 0 ? 'No active incidents' : `${activeIncidents} incident${activeIncidents > 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Services Status */}
          <section className="py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <h2 className="text-3xl font-black text-black mb-8">Services</h2>

              {services.length === 0 ? (
                <div className="border-4 border-black p-8 rounded-lg bg-white text-center">
                  <Loader className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
                  <p className="text-lg font-bold text-gray-700">Loading services...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.name} className="border-4 border-black p-6 rounded-lg hover:shadow-brutal transition-all bg-white">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          {getStatusIcon(service.status)}
                          <div>
                            <h3 className="text-lg font-black text-black">{service.name}</h3>
                            <p className="text-sm text-gray-700">{service.description}</p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap ml-4 ${getStatusColor(
                            service.status
                          )}`}
                        >
                          {service.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t-2 border-gray-200">
                        <div>
                          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Response Time</p>
                          <p className="text-lg font-black text-black">{service.responseTime}ms</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Uptime (30d)</p>
                          <p className="text-lg font-black text-black">{service.uptime}%</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Status</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-bold text-green-700">Healthy</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Load</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div className="bg-heirlock-green h-2 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Incidents */}
          <section className="py-12 md:py-16 bg-heirlock-yellow border-y-4 border-black">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <h2 className="text-3xl font-black text-black mb-8">Recent Incidents</h2>

              {incidents.length === 0 ? (
                <div className="border-4 border-black p-8 rounded-lg bg-white text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-bold text-black">No recent incidents</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="border-4 border-black p-6 rounded-lg bg-white">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-xs font-bold text-gray-600 bg-gray-200 px-2 py-1 rounded">
                              {incident.id}
                            </span>
                            <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded-full ${getSeverityColor(incident.severity)}`}>
                              {incident.severity}
                            </span>
                            <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded-full ${getStatusBadgeColor(incident.status)}`}>
                              {incident.status}
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-black mb-2">{incident.title}</h3>
                          <p className="text-sm text-gray-700 mb-3">{incident.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t-2 border-gray-200">
                        <div>
                          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Start Time</p>
                          <p className="text-sm font-bold text-black">
                            {new Date(incident.startTime).toLocaleDateString()} {new Date(incident.startTime).toLocaleTimeString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Duration</p>
                          <p className="text-sm font-bold text-black">
                            {incident.endTime
                              ? `${Math.round((new Date(incident.endTime).getTime() - new Date(incident.startTime).getTime()) / (1000 * 60))}m`
                              : 'Ongoing'}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Affected Services</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {incident.affectedServices.map((service) => (
                              <span key={service} className="text-xs bg-black text-white px-2 py-1 rounded font-bold">
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Scheduled Maintenance */}
          <section className="py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <h2 className="text-3xl font-black text-black mb-8">Scheduled Maintenance</h2>

              {maintenanceWindows.length === 0 ? (
                <div className="border-4 border-black p-8 rounded-lg bg-white text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-bold text-black">No scheduled maintenance</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {maintenanceWindows.map((maintenance) => (
                    <div
                      key={maintenance.id}
                      className={`border-4 border-black p-6 rounded-lg ${
                        new Date(maintenance.startTime) > currentTime ? 'bg-heirlock-blue' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <Clock className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="text-lg font-black text-black">{maintenance.title}</h3>
                            <p className="text-sm text-gray-700 mt-1">{maintenance.description}</p>
                          </div>
                        </div>
                        <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap ml-4">
                          {new Date(maintenance.startTime) > currentTime ? 'Upcoming' : 'Past'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t-2 border-gray-400">
                        <div>
                          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Start</p>
                          <p className="text-sm font-bold text-black">
                            {new Date(maintenance.startTime).toLocaleDateString()} {new Date(maintenance.startTime).toLocaleTimeString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">End</p>
                          <p className="text-sm font-bold text-black">
                            {new Date(maintenance.endTime).toLocaleDateString()} {new Date(maintenance.endTime).toLocaleTimeString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Duration</p>
                          <p className="text-sm font-bold text-black">
                            {Math.round((new Date(maintenance.endTime).getTime() - new Date(maintenance.startTime).getTime()) / (1000 * 60))}m
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Affected Services</p>
                          <p className="text-sm font-bold text-black">{maintenance.affectedServices.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Metrics */}
          <section className="py-12 md:py-16 bg-heirlock-pink border-t-4 border-black">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <h2 className="text-3xl font-black text-black mb-8">Reliability Metrics</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border-4 border-black p-6 bg-white rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">This Month Incidents</p>
                  <p className="text-3xl font-black text-black">{incidentMetrics.thisMonth}</p>
                </div>
                <div className="border-4 border-black p-6 bg-white rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Last Month Incidents</p>
                  <p className="text-3xl font-black text-black">{incidentMetrics.lastMonth}</p>
                </div>
                <div className="border-4 border-black p-6 bg-white rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Avg Resolution Time</p>
                  <p className="text-3xl font-black text-black">{incidentMetrics.avgResolutionTime}</p>
                </div>
                <div className="border-4 border-black p-6 bg-white rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Total Incidents (All Time)</p>
                  <p className="text-3xl font-black text-black">{incidentMetrics.totalIncidents}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <h2 className="text-3xl font-black text-black mb-8">Get Notified</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-4 border-black p-8 rounded-lg bg-heirlock-yellow">
                  <Activity className="w-8 h-8 text-black mb-4" />
                  <h3 className="text-xl font-black text-black mb-2">Email Notifications</h3>
                  <p className="text-gray-800 mb-4">Get notified of incidents and maintenance windows via email.</p>
                  <button disabled className="w-full px-4 py-3 bg-gray-400 text-white font-bold border-3 border-black rounded-lg cursor-not-allowed opacity-70">
                    Subscribe to Updates (Coming Soon)
                  </button>
                </div>

                <div className="border-4 border-black p-8 rounded-lg bg-heirlock-blue">
                  <AlertTriangle className="w-8 h-8 text-black mb-4" />
                  <h3 className="text-xl font-black text-black mb-2">Status RSS Feed</h3>
                  <p className="text-gray-800 mb-4">Subscribe to our RSS feed for real-time status updates.</p>
                  <button disabled className="w-full px-4 py-3 bg-gray-400 text-white font-bold border-3 border-black rounded-lg cursor-not-allowed opacity-70">
                    Get RSS Feed (Coming Soon)
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Info */}
          <section className="border-t-4 border-black py-12 md:py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-black text-black text-lg mb-3">SLA Guarantees</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Starter: 99.5% uptime</li>
                    <li>• Professional: 99.9% uptime</li>
                    <li>• Enterprise: 99.99% uptime</li>
                    <li>• Government: 99.99% uptime + redundancy</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-black text-black text-lg mb-3">Support</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>Email: support@tala.io</li>
                    <li>Status Page: status.tala.io</li>
                    <li>Incident Escalation: critical@tala.io</li>
                    <li>Response Time: &lt; 1 hour</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-black text-black text-lg mb-3">Maintenance Windows</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Monthly security updates</li>
                    <li>• Scheduled: Sundays 2-6 AM UTC</li>
                    <li>• Emergency: As needed</li>
                    <li>• 7-day advance notice</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
