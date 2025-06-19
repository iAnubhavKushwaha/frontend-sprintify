import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import invitationService from '../../services/invitationService';

const AcceptInvitation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [invitationData, setInvitationData] = useState(null);

  useEffect(() => {
    if (!token) {
      setMessage('Invalid invitation link');
      setMessageType('error');
      setLoading(false);
      return;
    }

    // Check if user is logged in
    const userToken = localStorage.getItem('token');
    if (!userToken) {
      setMessage('Please log in to accept this invitation');
      setMessageType('warning');
      setLoading(false);
      return;
    }

    // Move handleAcceptInvitation inside useEffect
    const handleAcceptInvitation = async () => {
      try {
        setLoading(true);
        setMessage('Processing your invitation...');
        setMessageType('info');

        console.log('🔍 Accepting invitation with token:', token);
        
        const response = await invitationService.acceptInvitation(token);
        
        console.log('✅ Invitation accepted:', response);
        
        if (response.success) {
          setMessage(response.message || 'Invitation accepted successfully!');
          setMessageType('success');
          setInvitationData(response.project);
          
          // Redirect to project or dashboard after 3 seconds
          setTimeout(() => {
            if (response.project?.id) {
              navigate(`/projects/${response.project.id}`);
            } else {
              navigate('/projects');
            }
          }, 3000);
        } else {
          setMessage(response.message || 'Failed to accept invitation');
          setMessageType('error');
        }
        
      } catch (error) {
        console.error('❌ Error accepting invitation:', error);
        
        let errorMessage = 'Failed to accept invitation';
        
        if (error.response?.status === 400) {
          errorMessage = error.response.data.message || 'Invalid or expired invitation';
        } else if (error.response?.status === 403) {
          errorMessage = 'This invitation was sent to a different email address';
        } else if (error.response?.status === 401) {
          errorMessage = 'Please log in to accept this invitation';
        } else {
          errorMessage = error.response?.data?.message || 'Something went wrong';
        }
        
        setMessage(errorMessage);
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    handleAcceptInvitation();
  }, [token, navigate]); // Include navigate in the dependency array

  const handleRetry = () => {
    setLoading(true);
    setMessage('Processing your invitation...');
    setMessageType('info');
    
    // Call the API again
    invitationService.acceptInvitation(token)
      .then(response => {
        if (response.success) {
          setMessage(response.message || 'Invitation accepted successfully!');
          setMessageType('success');
          setInvitationData(response.project);
          
          setTimeout(() => {
            if (response.project?.id) {
              navigate(`/projects/${response.project.id}`);
            } else {
              navigate('/projects');
            }
          }, 3000);
        } else {
          setMessage(response.message || 'Failed to accept invitation');
          setMessageType('error');
        }
      })
      .catch(error => {
        console.error('❌ Error accepting invitation:', error);
        setMessage('Failed to accept invitation');
        setMessageType('error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLogin = () => {
    // Store the invitation token to redirect back after login
    localStorage.setItem('pendingInvitation', token);
    navigate('/login');
  };

  const handleGoToProjects = () => {
    navigate('/projects');
  };

  return (
    <div className="accept-invitation">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h1>🚀 Project Invitation</h1>
          </div>
          
          <div className="card-body">
            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Processing your invitation...</p>
              </div>
            )}
            
            {!loading && (
              <>
                <div className={`message message-${messageType}`}>
                  {messageType === 'success' && <div className="success-icon">🎉</div>}
                  {messageType === 'error' && <div className="error-icon">❌</div>}
                  {messageType === 'warning' && <div className="warning-icon">⚠️</div>}
                  {messageType === 'info' && <div className="info-icon">ℹ️</div>}
                  
                  <p>{message}</p>
                </div>
                
                {invitationData && (
                  <div className="project-info">
                    <h3>📋 Project Details</h3>
                    <p><strong>Project:</strong> {invitationData.title}</p>
                    <p><strong>Description:</strong> {invitationData.description}</p>
                    <p><strong>Owner:</strong> {invitationData.owner}</p>
                    <p className="redirect-info">
                      You'll be redirected to the project in a few seconds...
                    </p>
                  </div>
                )}
                
                <div className="actions">
                  {messageType === 'error' && !message.includes('log in') && (
                    <button onClick={handleRetry} className="btn btn-primary">
                      🔄 Try Again
                    </button>
                  )}
                  
                  {message.includes('log in') && (
                    <button onClick={handleLogin} className="btn btn-primary">
                      🔐 Go to Login
                    </button>
                  )}
                  
                  {messageType === 'success' && (
                    <button onClick={handleGoToProjects} className="btn btn-outline">
                      📁 View All Projects
                    </button>
                  )}
                  
                  <button onClick={handleGoToProjects} className="btn btn-secondary">
                    🏠 Go to Dashboard
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .accept-invitation {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .container {
          max-width: 600px;
          width: 100%;
        }
        
        .card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .card-header {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        
        .card-header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 300;
        }
        
        .card-body {
          padding: 40px 30px;
        }
        
        .loading {
          text-align: center;
          padding: 40px 0;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .message {
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          text-align: center;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        
        .message-success {
          background: #d4edda;
          color: #155724;
          border: 2px solid #c3e6cb;
        }
        
        .message-error {
          background: #f8d7da;
          color: #721c24;
          border: 2px solid #f5c6cb;
        }
        
        .message-warning {
          background: #fff3cd;
          color: #856404;
          border: 2px solid #ffeaa7;
        }
        
        .message-info {
          background: #cce5ff;
          color: #004085;
          border: 2px solid #99d3ff;
        }
        
        .success-icon, .error-icon, .warning-icon, .info-icon {
          font-size: 24px;
        }
        
        .project-info {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 30px;
          border-left: 5px solid #007bff;
        }
        
        .project-info h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 20px;
        }
        
        .project-info p {
          margin: 8px 0;
          color: #666;
        }
        
        .redirect-info {
          margin-top: 20px;
          font-style: italic;
          color: #007bff !important;
          font-weight: 500;
        }
        
        .actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .btn {
          padding: 14px 28px;
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
          min-width: 140px;
        }
        
        .btn-primary {
          background: #007bff;
          color: white;
        }
        
        .btn-primary:hover {
          background: #0056b3;
          transform: translateY(-2px);
        }
        
        .btn-outline {
          background: transparent;
          color: #007bff;
          border: 2px solid #007bff;
        }
        
        .btn-outline:hover {
          background: #007bff;
          color: white;
        }
        
        .btn-secondary {
          background: #6c757d;
          color: white;
        }
        
        .btn-secondary:hover {
          background: #545b62;
        }
        
        @media (max-width: 768px) {
          .accept-invitation {
            padding: 10px;
          }
          
          .card-header {
            padding: 30px 20px;
          }
          
          .card-header h1 {
            font-size: 24px;
          }
          
          .card-body {
            padding: 30px 20px;
          }
          
          .actions {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AcceptInvitation;