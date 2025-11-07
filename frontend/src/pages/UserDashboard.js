import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { serviceAPI, incidentAPI } from '../services/api';
import ServiceStatus from '../components/ServiceStatus';
import IncidentCard from '../components/IncidentCard';
import socketService from '../services/socket';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Connect to socket for real-time updates
    const socket = socketService.connect();
    
    socket.on('statusUpdated', (data) => {
      setServices(prev => prev.map(service => 
        service.id === data.serviceId ? { ...service, status: data.status } : service
      ));
    });

    socket.on('incidentCreated', (incident) => {
      setIncidents(prev => [incident, ...prev]);
    });

    socket.on('incidentUpdated', (incident) => {
      setIncidents(prev => prev.map(inc => inc.id === incident.id ? incident : inc));
    });

    socket.on('incidentResolved', (incident) => {
      setIncidents(prev => prev.map(inc => inc.id === incident.id ? incident : inc));
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const loadData = async () => {
    try {
      const [servicesRes, incidentsRes] = await Promise.all([
        serviceAPI.getServices(),
        incidentAPI.getIncidents()
      ]);
      
      setServices(servicesRes.data);
      setIncidents(incidentsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOverallStatus = () => {
    if (services.some(s => s.status === 'major-outage')) return 'Major Outage';
    if (services.some(s => s.status === 'partial-outage')) return 'Partial Outage';
    if (services.some(s => s.status === 'degraded-performance')) return 'Degraded Performance';
    return 'All Systems Operational';
  };

  const getOverallStatusColor = () => {
    const status = getOverallStatus();
    if (status === 'All Systems Operational') return '#10B981';
    if (status === 'Degraded Performance') return '#F59E0B';
    if (status === 'Partial Outage') return '#EF4444';
    return '#DC2626';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
            Internal Dashboard
          </h1>
          <p style={{ color: '#6b7280' }}>Welcome, {user?.email} • Internal Access</p>
        </div>
        <button
          onClick={logout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </header>

      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: getOverallStatusColor(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: getOverallStatusColor()
            }}
          />
          {getOverallStatus()}
        </div>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
          Services Status
        </h2>
        {services.map(service => (
          <div key={service.id} style={{ marginBottom: '12px' }}>
            <ServiceStatus service={service} />
            <div style={{
              marginTop: '8px',
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                Internal Notes:
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                {service.status === 'operational' && 'All systems running normally. Last checked: 2 minutes ago'}
                {service.status === 'degraded-performance' && 'Performance issues detected. Engineering team investigating. ETA: 30 minutes'}
                {service.status === 'partial-outage' && 'Partial service disruption. Incident #INC-001 created. Priority: High'}
                {service.status === 'major-outage' && 'Critical outage. All hands on deck. War room activated.'}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                Uptime (30d): {service.status === 'operational' ? '99.9%' : '98.5%'} • 
                Response Time: {service.status === 'operational' ? '120ms' : '450ms'}
              </div>
            </div>
          </div>
        ))}
      </section>

      {incidents.filter(inc => inc.status !== 'resolved').length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
            Active Incidents (Internal View)
          </h2>
          {incidents.filter(inc => inc.status !== 'resolved').map(incident => (
            <div key={incident.id}>
              <IncidentCard incident={incident} services={services} />
              <div style={{
                marginTop: '8px',
                padding: '12px',
                backgroundColor: '#fef2f2',
                borderRadius: '6px',
                border: '1px solid #fecaca'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#991b1b' }}>
                  Internal Details:
                </div>
                <div style={{ fontSize: '13px', color: '#7f1d1d' }}>
                  • Engineering team: 3 members assigned<br/>
                  • Customer impact: ~500 users affected<br/>
                  • Root cause: Database connection timeout<br/>
                  • Next update: In 15 minutes
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
          Notification Settings
        </h2>
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <input type="checkbox" defaultChecked />
              Email notifications for incidents
            </label>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <input type="checkbox" defaultChecked />
              SMS alerts for major outages
            </label>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <input type="checkbox" />
              Weekly status reports
            </label>
          </div>
        </div>
      </section>
      
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
          Recent Activity (Internal)
        </h2>
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '14px', marginBottom: '12px' }}>
            <span style={{ color: '#6b7280' }}>2 hours ago:</span> Database performance optimization completed
          </div>
          <div style={{ fontSize: '14px', marginBottom: '12px' }}>
            <span style={{ color: '#6b7280' }}>1 day ago:</span> Security patch deployed to API servers
          </div>
          <div style={{ fontSize: '14px', marginBottom: '12px' }}>
            <span style={{ color: '#6b7280' }}>3 days ago:</span> Scheduled maintenance window completed
          </div>
        </div>
      </section>

      <footer style={{ textAlign: 'center', marginTop: '40px', color: '#6b7280', fontSize: '14px' }}>
        <p>Last updated: {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
};

export default UserDashboard;