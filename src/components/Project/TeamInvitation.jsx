import React, { useState } from 'react';
import { invitationService } from '../../services/invitationService';

const TeamInvitation = ({ project, onInvitationSent }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter an email address');
      setMessageType('error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await invitationService.sendInvitation(project._id, email);    
      if (response.success) {
        setMessage(`✅ Invitation sent successfully to ${email}!`);
        setMessageType('success');
        setEmail(''); // Clear form
        
        // Call parent callback if provided
        if (onInvitationSent) {
          onInvitationSent(response.invitation);
        }
      } else {
        setMessage(response.message || 'Failed to send invitation');
        setMessageType('error');
      }
      
    } catch (error) {
      console.error('❌ Error sending invitation:', error);
      
      // Handle different error scenarios
      if (error.response?.status === 400) {
        setMessage(error.response.data.message || 'Invalid request');
      } else if (error.response?.status === 403) {
        setMessage('You do not have permission to send invitations for this project');
      } else if (error.response?.status === 404) {
        setMessage('Project not found');
      } else if (error.response?.status === 207) {
        // Partial success - invitation saved but email failed
        setMessage(`⚠️ ${error.response.data.message}`);
        setMessageType('warning');
      } else {
        setMessage('Failed to send invitation. Please try again.');
      }
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      setLoading(true);
      setMessage('Testing email configuration...');
      setMessageType('info');
      
      const response = await invitationService.testEmail();
      
      if (response.success) {
        setMessage('✅ Email test successful! Check your inbox.');
        setMessageType('success');
      } else {
        setMessage('❌ Email test failed: ' + response.error);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('❌ Email test failed: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="team-invitation">
      <div className="card">
        <div className="card-header">
          <h3>🚀 Invite Team Members</h3>
          <p>Invite collaborators to join "{project.title}"</p>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit} className="invitation-form">
            <div className="form-group">
              <label htmlFor="email">Email Address:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                disabled={loading}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                disabled={loading || !email.trim()}
                className="btn btn-primary"
              >
                {loading ? '📧 Sending...' : '📧 Send Invitation'}
              </button>
              
              <button 
                type="button" 
                onClick={handleTestEmail}
                disabled={loading}
                className="btn btn-outline"
              >
                🧪 Test Email
              </button>
            </div>
          </form>
          
          {message && (
            <div className={`message message-${messageType}`}>
              {message}
            </div>
          )}
          
          <div className="invitation-info">
            <h4>📋 How it works:</h4>
            <ul>
              <li>✉️ An invitation email will be sent to the provided address</li>
              <li>🔗 The recipient can click the link to accept and join</li>
              <li>⏰ Invitations expire after 7 days</li>
              <li>👥 Invited members will have "member" role by default</li>
            </ul>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .team-invitation {
          max-width: 500px;
          margin: 0 auto;
        }
        
        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .card-header {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          padding: 24px;
          text-align: center;
        }
        
        .card-header h3 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
        }
        
        .card-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }
        
        .card-body {
          padding: 24px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }
        
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #007bff;
        }
        
        .form-input:disabled {
          background: #f8f9fa;
          cursor: not-allowed;
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
        
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .btn-primary {
          background: #007bff;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }
        
        .btn-outline {
          background: transparent;
          color: #007bff;
          border: 2px solid #007bff;
        }
        
        .btn-outline:hover:not(:disabled) {
          background: #007bff;
          color: white;
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .message {
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-weight: 500;
        }
        
        .message-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .message-error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        
        .message-warning {
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        }
        
        .message-info {
          background: #cce5ff;
          color: #004085;
          border: 1px solid #99d3ff;
        }
        
        .invitation-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #007bff;
        }
        
        .invitation-info h4 {
          margin: 0 0 12px 0;
          color: #333;
          font-size: 16px;
        }
        
        .invitation-info ul {
          margin: 0;
          padding-left: 20px;
        }
        
        .invitation-info li {
          margin-bottom: 8px;
          color: #666;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default TeamInvitation;