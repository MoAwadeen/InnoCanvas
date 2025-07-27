import React from 'react';

type InteractiveCardProps = {
  title: string;
  description: string;
};

const InteractiveCard = ({ title, description }: InteractiveCardProps) => {
  return (
    <div className="interactive-card-container noselect">
      <div className="interactive-card-canvas">
        {/* 25 tracker divs for hover effect */}
        {[...Array(25)].map((_, i) => (
          <div key={i} className={`tracker tr-${i + 1}`} />
        ))}
        <div className="interactive-card">
          <p className="interactive-card-prompt">{description}</p>
          <div className="title">{title}</div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCard;
