import React from 'react';

export const CrossedSticks = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 5 L16 16 C18 18 20 16 21 14" />
    <path d="M19 5 L8 16 C6 18 4 16 3 14" />
  </svg>
);
