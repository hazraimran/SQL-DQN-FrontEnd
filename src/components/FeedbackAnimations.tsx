import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface FeedbackAnimationsProps {
  showSuccess: boolean;
  showError: boolean;
}

export const FeedbackAnimations: React.FC<FeedbackAnimationsProps> = ({ 
  showSuccess, 
  showError 
}) => {
  return (
    <>
      {showSuccess && (
        <div className="success-animation">
          <CheckCircle size={80} color="#10b981" />
        </div>
      )}
      
      {showError && (
        <div className="error-animation">
          <XCircle size={80} color="#ef4444" />
        </div>
      )}
    </>
  );
};