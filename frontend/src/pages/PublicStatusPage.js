import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { serviceAPI, incidentAPI } from '../services/api';
import ServiceStatus from '../components/ServiceStatus';
import IncidentCard from '../components/IncidentCard';
import socketService from '../services/socket';

const PublicStatusPage = () => {
  const { org } = useParams();
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Connect to socket for real-time updates
    const socket = socketService.connect();
    
    socket.on('statusUpdated', (data) => {
      console.log('Status updated:', data);
      setServices(prev => prev.map(service => 
        service.id === data.serviceId ? { ...service, status: data.status } : service
      ));
    });

    socket.on('serviceCreated', (service) => {
      console.log('Service created:', service);
      setServices(prev => [...prev, service]);
    });

    socket.on('serviceDeleted', (data) => {
      console.log('Service deleted:', data);
      setServices(prev => prev.filter(service => service.id !== data.serviceId));
    });

    socket.on('incidentCreated', (incident) => {
      setIncidents(prev => [incident, ...prev]);
    });

    socket.on('incidentUpdated', (incident) => {
      setIncidents(prev => prev.map(inc => inc.id === incident.id ? incident : inc));
    });

    return () => {
      socketService.disconnect();
    };
  }, [org]);

  const loadData = async () => {
    try {
      const orgSlug = 'acme';
      console.log('Loading data for org:', orgSlug);
      
      const servicesRes = await serviceAPI.getPublicServices(orgSlug);
      const incidentsRes = await incidentAPI.getPublicIncidents(orgSlug);
      
      console.log('Services response:', servicesRes.data);
      console.log('Incidents response:', incidentsRes.data);
      
      setServices(servicesRes.data || []);
      setIncidents(incidentsRes.data || []);
      setMaintenances([]);
    } catch (error) {
      console.error('API Error:', error);
      setServices([]);
      setIncidents([]);
      setMaintenances([]);
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
      <header style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>
            System Status
          </h1>
          <a 
            href="/login" 
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Admin Login
          </a>
        </div>
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
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
          Services
        </h2>
        {services.map(service => (
          <ServiceStatus key={service.id} service={service} />
        ))}
      </section>

      {incidents.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
            Active Incidents
          </h2>
          {incidents.filter(inc => inc.status !== 'resolved').map(incident => (
            <IncidentCard key={incident.id} incident={incident} services={services} />
          ))}
        </section>
      )}

      {maintenances.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
            Scheduled Maintenance
          </h2>
          {maintenances.filter(m => m.status === 'scheduled').map(maintenance => (
            <div key={maintenance.id} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
              backgroundColor: '#fef3c7'
            }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                {maintenance.title}
              </h3>
              <p style={{ margin: '8px 0', fontSize: '14px' }}>
                {maintenance.description}
              </p>
              <div style={{ fontSize: '12px', color: '#92400e' }}>
                Scheduled: {new Date(maintenance.scheduledStart).toLocaleString()} - {new Date(maintenance.scheduledEnd).toLocaleString()}
              </div>
            </div>
          ))}
        </section>
      )}

      <footer style={{ textAlign: 'center', marginTop: '40px', color: '#6b7280', fontSize: '14px' }}>
        <p>Last updated: {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
};

export default PublicStatusPage;