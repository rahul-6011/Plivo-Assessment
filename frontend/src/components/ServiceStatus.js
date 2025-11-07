import React from 'react';

const statusColors = {
  operational: '#10B981',
  'degraded-performance': '#F59E0B',
  'partial-outage': '#EF4444',
  'major-outage': '#DC2626'
};

const statusLabels = {
  operational: 'Operational',
  'degraded-performance': 'Degraded Performance',
  'partial-outage': 'Partial Outage',
  'major-outage': 'Major Outage'
};

const ServiceStatus = ({ service, showControls = false, onStatusChange }) => {
  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(service.id, newStatus);
    }
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      backgroundColor: 'white'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
          {service.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: statusColors[service.status] || '#6B7280'
            }}
          />
          <span style={{ 
            fontSize: '14px', 
            fontWeight: '500',
            color: statusColors[service.status] || '#6B7280'
          }}>
            {statusLabels[service.status] || service.status}
          </span>
        </div>
      </div>
      
      {showControls && (
        <div style={{ marginTop: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
            Update Status:
          </label>
          <select
            value={service.status}
            onChange={(e) => handleStatusChange(e.target.value)}
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
      )}
    </div>
  );
};

export default ServiceStatus;