import React from 'react';

interface SafeAreaViewProps {
  children: React.ReactNode;
  className?: string;
}

export const SafeAreaView: React.FC<SafeAreaViewProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`flex-1 ${className} ios-safe-area`} 
      style={{
        minHeight: '100vh',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {children}
    </div>
  );
};
