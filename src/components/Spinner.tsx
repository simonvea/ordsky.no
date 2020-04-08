import React from 'react';
import './Spinner.css';

export interface SpinnerProps {
  message?: string;
}

export const Spinner: React.FC<SpinnerProps> = function Spinner({ message }) {
  return (
    <div className="loader">
      <span className="loader__spinner" />
      <span className="loader__text">{message && message}</span>
    </div>
  );
};
