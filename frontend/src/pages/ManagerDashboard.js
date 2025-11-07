import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { serviceAPI, incidentAPI } from '../services/api';
import ServiceStatus from '../components/ServiceStatus';
import IncidentCard from '../components/IncidentCard';

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
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

  const handleStatusChange = async (serviceId, newStatus) => {
    try {
      await serviceAPI.updateServiceStatus(serviceId, newStatus);
      setServices(prev => prev.map(service => 
        service.id === serviceId ? { ...service, status: newStatus } : service
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    try {
      const response = await serviceAPI.createService(newServiceName);
      setServices(prev => [...prev, response.data]);
      setNewServiceName('');
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceAPI.deleteService(serviceId);
        setServices(prev => prev.filter(service => service.id !== serviceId));
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
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
            Manager Dashboard
          </h1>
          <p style={{ color: '#6b7280' }}>Welcome, {user?.email}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="/team"
            style={{
              padding: '6px 12px',
              backgroundColor: '#10b981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            Team
          </a>
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
        </div>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
          Services Management
        </h2>
        
        <form onSubmit={handleCreateService} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Service name"
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Service
            </button>
          </div>
        </form>

        {services.map(service => (
          <div key={service.id} style={{ position: 'relative' }}>
            <ServiceStatus
              service={service}
              showControls={true}
              onStatusChange={handleStatusChange}
            />
            <button
              onClick={() => handleDeleteService(service.id)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '4px 8px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </section>

      <section>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
          Active Incidents
        </h2>
        {incidents.filter(inc => inc.status !== 'resolved').map(incident => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </section>
    </div>
  );
};

export default ManagerDashboard;