import React from 'react';
import { Link } from 'react-router-dom';
import './TermsBanner.css';

type TermsBannerProps = {
  onClose: () => void;
};

export const TermsBanner: React.FC<TermsBannerProps> = function TermsBanner({
  onClose,
}) {
  return (
    <div className="terms">
      <p>
        Dette nettstedet bruker informasjonskapsler for trafikkanalyse.{' '}
        <Link to="/about#cookies">Finn ut mer</Link>.
      </p>
      <button
        type="button"
        className="button button--secondary button--small"
        onClick={onClose}
      >
        Lukk
      </button>
    </div>
  );
};
