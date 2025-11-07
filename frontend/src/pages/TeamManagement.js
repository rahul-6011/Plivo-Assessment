import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const TeamManagement = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');

  useEffect(() => {
    // Load team members based on organization
    const orgId = user?.organizationId;
    if (orgId === 'org-1') {
      setTeamMembers([
        { id: '1', email: 'admin@acme.com', role: 'admin', status: 'active' },
        { id: '2', email: 'manager@acme.com', role: 'manager', status: 'active' }
      ]);
    } else if (orgId === 'org-2') {
      setTeamMembers([
        { id: '3', email: 'admin@techstart.com', role: 'admin', status: 'active' },
        { id: '4', email: 'member@techstart.com', role: 'member', status: 'active' }
      ]);
    }
  }, [user]);

  const handleInvite = (e) => {
    e.preventDefault();
    // Add invite logic here
    console.log('Inviting:', inviteEmail, 'as', inviteRole);
    setInviteEmail('');
  };

  if (user?.role !== 'admin' && user?.role !== 'manager') {
    return <div>Access denied. Only admins and managers can manage teams.</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
          Team Management
        </h1>
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#f0f9ff', 
          borderRadius: '8px', 
          border: '1px solid #0ea5e9',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#0c4a6e' }}>
            Role Permissions:
          </h3>
          <div style={{ fontSize: '14px', color: '#0c4a6e' }}>
            <div><strong>Admin:</strong> Full access - manage services, incidents, team members</div>
            <div><strong>Manager:</strong> Manage services, view incidents, invite team members</div>
            <div><strong>Member:</strong> Internal dashboard, notifications, detailed metrics & activity feed</div>
          </div>
        </div>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
          Invite Team Member
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
          Send an invitation to add a new team member to your organization
        </p>
        <form onSubmit={handleInvite} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Email address"
            required
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
          >
            <option value="member">Member</option>
            <option value="manager">Manager</option>
            {user?.role === 'admin' && <option value="admin">Admin</option>}
          </select>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Invite
          </button>
        </form>
      </section>

      <section>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
          Team Members
        </h2>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          {teamMembers.map((member) => (
            <div
              key={member.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid #e5e7eb'
              }}
            >
              <div>
                <div style={{ fontWeight: '500' }}>{member.email}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  {member.role === 'admin' && ' - Full Access'}
                  {member.role === 'manager' && ' - Service Management'}
                  {member.role === 'member' && ' - Internal Access'}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  backgroundColor: member.status === 'active' ? '#dcfce7' : '#fef3c7',
                  color: member.status === 'active' ? '#166534' : '#92400e'
                }}>
                  {member.status}
                </div>
                {user?.role === 'admin' && member.email !== user.email && (
                  <button
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => console.log('Remove member:', member.email)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TeamManagement;