import React from "react";
import { useParams } from "react-router-dom";
import "./StoryDetailPage.css";

const StoryDetailPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="story-detail">

      <h1 className="story-detail-title">
        Story #{id}
      </h1>

      <img
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
        alt="story"
        className="story-detail-image"
      />

      <p className="story-detail-text">
        ARTISANS’ celebrates India’s handmade heritage not just as a legacy, 
        but as its most valuable resource. We believe in the potential of craft 
        to change lives through creative livelihoods, in a world where the future is handmade. 
      </p>

    </div>
  );
};

export default StoryDetailPage;