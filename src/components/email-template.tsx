import React from 'react';

interface EmailTemplateProps {
  requestData: {
    title: string;
    request_type: string;
    description: string;
    location: string;
    number_of_trees: number;
    area_hectares: number;
    plan_start_date: string;
    plan_end_date: string;
  };
  approvalUrl: string;
  approver: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  requestData,
  approvalUrl,
  approver,
}) => (
  <div style={{ 
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#FFFFFF',
    color: '#403836'
  }}>
    <div style={{
      backgroundColor: '#E9F40B',
      padding: '20px',
      borderRadius: '8px 8px 0 0',
      marginBottom: '20px'
    }}>
      <h1 style={{ 
        color: '#403836',
        margin: '0',
        fontSize: '24px',
        textAlign: 'center'
      }}>
        Tree Cutting Request Approval
      </h1>
    </div>

    <div style={{ padding: '20px' }}>
      <p style={{ marginBottom: '20px' }}>
        Dear {approver.split('@')[0]},
      </p>
      
      <p style={{ marginBottom: '20px' }}>
        A new tree cutting request requires your approval:
      </p>

      <div style={{
        backgroundColor: '#f8f8f8',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          color: '#403836',
          fontSize: '20px',
          marginTop: '0'
        }}>
          {requestData.title}
        </h2>

        <div style={{ marginBottom: '10px' }}>
          <strong>Request Type:</strong> {requestData.request_type}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Location:</strong> {requestData.location}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Number of Trees:</strong> {requestData.number_of_trees}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Area (Hectares):</strong> {requestData.area_hectares}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Plan Period:</strong> {requestData.plan_start_date} to {requestData.plan_end_date}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Description:</strong>
          <p style={{ margin: '5px 0' }}>{requestData.description}</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <a
          href={approvalUrl}
          style={{
            backgroundColor: '#E9F40B',
            color: '#403836',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block'
          }}
        >
          Approve Request
        </a>
      </div>

      <p style={{ 
        marginTop: '30px',
        fontSize: '14px',
        color: '#666'
      }}>
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  </div>
);