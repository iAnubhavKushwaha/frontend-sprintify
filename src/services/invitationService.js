//client\src\services\invitationService.js
import API from '../utils/axios';

// Test email configuration
export const testEmail = async () => {
  try {
    const response = await API.get('/invitations/test-email');
    return response.data;
  } catch (error) {
    console.error('Email test failed:', error);
    throw error;
  }
};

// Send invitation
export const sendInvitation = async (projectId, email) => {
  try {
    console.log('📤 Sending invitation request:', { projectId, email });
    
    const response = await API.post('/invitations/send', {
      projectId,
      email
    });
    
    console.log('✅ Invitation sent successfully:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Failed to send invitation:', error.response?.data || error.message);
    throw error;
  }
};

// Accept invitation
export const acceptInvitation = async (token) => {
  try {
    const response = await API.post(`/invitations/accept/${token}`);
    return response.data;
  } catch (error) {
    console.error('Failed to accept invitation:', error);
    throw error;
  }
};

// Get pending invitations for current user
export const getPendingInvitations = async () => {
  try {
    const response = await API.get('/invitations/pending');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pending invitations:', error);
    throw error;
  }
};

// Get project invitations (for project owners)
export const getProjectInvitations = async (projectId) => {
  try {
    const response = await API.get(`/invitations/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch project invitations:', error);
    throw error;
  }
};

// Resend invitation
export const resendInvitation = async (projectId, email) => {
  try {
    const response = await API.post('/invitations/resend', {
      projectId,
      email
    });
    return response.data;
  } catch (error) {
    console.error('Failed to resend invitation:', error);
    throw error;
  }
};

// Cancel invitation
export const cancelInvitation = async (projectId, email) => {
  try {
    const response = await API.delete('/invitations/cancel', {
      data: { projectId, email }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to cancel invitation:', error);
    throw error;
  }
};

// Default export with all functions (for backward compatibility)
export const invitationService = {
  testEmail,
  sendInvitation,
  acceptInvitation,
  getPendingInvitations,
  getProjectInvitations,
  resendInvitation,
  cancelInvitation
};

// Make it default export too
export default invitationService;