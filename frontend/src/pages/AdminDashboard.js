import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { serviceAPI, incidentAPI } from '../services/api';
import ServiceStatus from '../components/ServiceStatus';
import IncidentCard from '../components/IncidentCard';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    serviceIds: []
  });
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

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    if (!newIncident.title.trim() || !newIncident.description.trim()) return;

    try {
      const response = await incidentAPI.createIncident(
        newIncident.title,
        newIncident.description,
        newIncident.serviceIds
      );
      setIncidents(prev => [response.data, ...prev]);
      setNewIncident({ title: '', description: '', serviceIds: [] });
    } catch (error) {
      console.error('Error creating incident:', error);
    }
  };

  const handleResolveIncident = async (incidentId) => {
    try {
      await incidentAPI.resolveIncident(incidentId);
      setIncidents(prev => prev.map(inc => 
        inc.id === incidentId ? { ...inc, status: 'resolved' } : inc
      ));
    } catch (error) {
      console.error('Error resolving incident:', error);
    }
  };

  const handleAddIncidentUpdate = async (incidentId, message) => {
    try {
      await incidentAPI.addIncidentUpdate(incidentId, message);
      // Reload incidents to get updated data
      const response = await incidentAPI.getIncidents();
      setIncidents(response.data);
    } catch (error) {
      console.error('Error adding incident update:', error);
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
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
            Admin Dashboard
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <section>
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
            <div key={service.id} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px',
              backgroundColor: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                    {service.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: {
                          operational: '#10B981',
                          'degraded-performance': '#F59E0B',
                          'partial-outage': '#EF4444',
                          'major-outage': '#DC2626'
                        }[service.status] || '#6B7280'
                      }}
                    />
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: {
                        operational: '#10B981',
                        'degraded-performance': '#F59E0B',
                        'partial-outage': '#EF4444',
                        'major-outage': '#DC2626'
                      }[service.status] || '#6B7280'
                    }}>
                      {{
                        operational: 'Operational',
                        'degraded-performance': 'Degraded Performance',
                        'partial-outage': 'Partial Outage',
                        'major-outage': 'Major Outage'
                      }[service.status] || service.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  style={{
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
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                  Update Status:
                </label>
                <select
                  value={service.status}
                  onChange={(e) => handleStatusChange(service.id, e.target.value)}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="operational">Operational</option>
                  <option value="degraded-performance">Degraded Performance</option>
                  <option value="partial-outage">Partial Outage</option>
                  <option value="major-outage">Major Outage</option>
                </select>
              </div>
            </div>
          ))}
        </section>

        <section>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
            Incident Management
          </h2>
          
          <form onSubmit={handleCreateIncident} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '12px' }}>
              <input
                type="text"
                value={newIncident.title}
                onChange={(e) => setNewIncident(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Incident title"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <textarea
                value={newIncident.description}
                onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Incident description"
                rows="3"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                Affected Services:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {services.map(service => (
                  <label key={service.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      checked={newIncident.serviceIds.includes(service.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewIncident(prev => ({ ...prev, serviceIds: [...prev.serviceIds, service.id] }));
                        } else {
                          setNewIncident(prev => ({ ...prev, serviceIds: prev.serviceIds.filter(id => id !== service.id) }));
                        }
                      }}
                    />
                    {service.name}
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Create Incident
            </button>
          </form>

          {incidents.map(incident => (
            <div key={incident.id} style={{ position: 'relative' }}>
              <IncidentCard 
                incident={incident} 
                services={services}
                onAddUpdate={handleAddIncidentUpdate}
              />
              {incident.status !== 'resolved' && (
                <button
                  onClick={() => handleResolveIncident(incident.id)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    padding: '4px 8px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                >
                  Resolve
                </button>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;