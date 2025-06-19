// src/components/Dashboard/PendingInvitations.jsx
import { useState, useEffect } from 'react';
import { getPendingInvitations, acceptInvitation } from '../../services/invitationService';

const PendingInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingInvitations();
  }, []);

  const fetchPendingInvitations = async () => {
    try {
      setLoading(true);
      const response = await getPendingInvitations();
      
      console.log('🔍 Pending invitations response:', response);
      
      // Handle different response structures
      let invitationsList = [];
      
      if (response && response.success && Array.isArray(response.invitations)) {
        invitationsList = response.invitations;
      } else if (response && Array.isArray(response.data)) {
        invitationsList = response.data;
      } else if (Array.isArray(response)) {
        invitationsList = response;
      } else if (response && response.invitations && Array.isArray(response.invitations)) {
        invitationsList = response.invitations;
      }
      setInvitations(invitationsList);
      setError('');
      
    } catch (error) {
      console.error('Error fetching invitations:', error);
      setError('Failed to load invitations');
      setInvitations([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (token) => {
    try {
      const response = await acceptInvitation(token);
      
      if (response && response.success) {
        // Remove from list
        setInvitations(prevInvitations => 
          prevInvitations.filter(inv => inv.token !== token)
        );
        
        // Show success message
        alert('✅ Invitation accepted successfully!');
        
        // Optionally refresh projects or redirect
        // window.location.reload(); // or use navigation
      } else {
        alert('❌ Failed to accept invitation: ' + (response?.message || 'Unknown error'));
      }
      
    } catch (error) {
      console.error('Error accepting invitation:', error);
      alert('❌ Error accepting invitation: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeclineInvitation = (token) => {
    if (window.confirm('Are you sure you want to decline this invitation?')) {
      // For now, just remove from UI
      setInvitations(prevInvitations => 
        prevInvitations.filter(inv => inv.token !== token)
      );
      // You can implement actual decline API call here if needed
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 border mb-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">Loading invitations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 border mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">❌</span>
            <span className="text-red-800">{error}</span>
          </div>
          <button 
            onClick={fetchPendingInvitations}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  // Don't render if no invitations
  if (!Array.isArray(invitations) || invitations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 border mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">📬 Pending Invitations</h3>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          {invitations.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {invitations.map((invitation, index) => (
          <div key={invitation.token || invitation.id || index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">
                {invitation.projectTitle || invitation.project?.title || 'Untitled Project'}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Invited by {invitation.invitedBy?.name || invitation.project?.owner?.name || 'Unknown'}
                {invitation.invitedBy?.email && (
                  <span className="text-gray-500"> ({invitation.invitedBy.email})</span>
                )}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>
                  📅 Sent: {new Date(invitation.createdAt).toLocaleDateString()}
                </span>
                <span>
                  ⏰ Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => handleAcceptInvitation(invitation.token)}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors font-medium"
              >
                ✅ Accept
              </button>
              <button 
                onClick={() => handleDeclineInvitation(invitation.token)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400 transition-colors"
              >
                ❌ Decline
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button 
          onClick={fetchPendingInvitations}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          🔄 Refresh Invitations
        </button>
      </div>
    </div>
  );
};

export default PendingInvitations;