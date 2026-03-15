import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="working-wrapper">
      <div className="content">
        {/* Hammer Icon */}
        <div className="hammer">🔨</div>

        {/* Title */}
        <h1>
          Page <span>Under</span>
          <br />
          Working
        </h1>

        {/* Description */}
        <p className="desc">
          We're working hard to bring you this amazing experience!
          <br />
          Our team is building something special just for you.
        </p>

        {/* Animated Dots */}
        <div className="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <p className="status">Building in progress...</p>

        {/* Progress Bar */}
        <div className="progress">
          <span></span>
        </div>

        {/* Actions */}
        <div className="actions">
          <button className="primary" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>

        <p className="footer-text">More exciting features launching soon 🚀</p>
      </div>
    </div>
  );
};

export default NotFound;
