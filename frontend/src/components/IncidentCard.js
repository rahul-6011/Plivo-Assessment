import React, { useState } from 'react';

const statusColors = {
  investigating: '#F59E0B',
  identified: '#EF4444',
  monitoring: '#3B82F6',
  resolved: '#10B981'
};

const IncidentCard = ({ incident, services = [], onAddUpdate }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  // Parse serviceIds from JSON string if needed
  const serviceIds = typeof incident.serviceIds === 'string' 
    ? JSON.parse(incident.serviceIds || '[]') 
    : incident.serviceIds || [];

  const handleAddUpdate = (e) => {
    e.preventDefault();
    if (updateMessage.trim() && onAddUpdate) {
      onAddUpdate(incident.id, updateMessage);
      setUpdateMessage('');
      setShowUpdateForm(false);
    }
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      backgroundColor: 'white'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
          {incident.title}
        </h3>
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: statusColors[incident.status] + '20',
          color: statusColors[incident.status]
        }}>
          {incident.status.toUpperCase()}
        </span>
      </div>
      
      <p style={{ margin: '8px 0', color: '#6b7280', fontSize: '14px' }}>
        {incident.description}
      </p>
      
      {serviceIds && serviceIds.length > 0 && (
        <div style={{ margin: '8px 0' }}>
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}>Affected Services: </span>
          {serviceIds.map(serviceId => {
            const service = services.find(s => s.id === serviceId);
            return service ? (
              <span key={serviceId} style={{
                display: 'inline-block',
                padding: '2px 6px',
                backgroundColor: '#f3f4f6',
                borderRadius: '4px',
                fontSize: '11px',
                marginRight: '4px'
              }}>
                {service.name}
              </span>
            ) : null;
          })}
        </div>
      )}
      
      <div style={{ fontSize: '12px', color: '#9ca3af' }}>
        Created: {new Date(incident.createdAt).toLocaleString()}
      </div>
      
      {incident.updates && incident.updates.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Updates:</h4>
          {incident.updates.slice(-3).map((update) => (
            <div key={update.id} style={{
              padding: '8px',
              backgroundColor: '#f9fafb',
              borderRadius: '4px',
              marginBottom: '4px',
              fontSize: '14px'
            }}>
              <div>{update.message}</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                {new Date(update.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {onAddUpdate && incident.status !== 'resolved' && (
        <div style={{ marginTop: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
          {!showUpdateForm ? (
            <button
              onClick={() => setShowUpdateForm(true)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Add Update
            </button>
          ) : (
            <form onSubmit={handleAddUpdate} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={updateMessage}
                onChange={(e) => setUpdateMessage(e.target.value)}
                placeholder="Add an update..."
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
                autoFocus
              />
              <button
                type="submit"
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Post
              </button>
              <button
                type="button"
                onClick={() => { setShowUpdateForm(false); setUpdateMessage(''); }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default IncidentCard;