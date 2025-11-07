import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrganizationSelector = () => {
  const navigate = useNavigate();

  const organizations = [
    { slug: 'acme', name: 'Acme Corp', description: 'E-commerce platform services' },
    { slug: 'techstart', name: 'TechStart Inc', description: 'Mobile app and payment services' }
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Status Pages
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Select an organization to view their system status
        </p>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {organizations.map(org => (
          <div
            key={org.slug}
            onClick={() => navigate(`/status/${org.slug}`)}
            style={{
              padding: '24px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              ':hover': {
                borderColor: '#3b82f6',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', margin: 0 }}>
              {org.name}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '8px 0 0 0' }}>
              {org.description}
            </p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <a
          href="/login"
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          Organization Login
        </a>
      </div>
    </div>
  );
};

export default OrganizationSelector;