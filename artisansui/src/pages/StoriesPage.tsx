import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StoriesPage.css";

const stories = [
  {
    id: 1,
    title: "The sunset faded to twilight",
    date: "April 11, 2019",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    excerpt: "I began walking, therefore, in a big curve seeking some point of vantage..."
  },
  {
    id: 2,
    title: "Then going through some small strange motions",
    date: "April 8, 2019",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    excerpt: "A moderate incline runs towards the foot of Mabury Hill..."
  },
  {
    id: 3,
    title: "Two long weeks I wandered",
    date: "April 8, 2019",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    excerpt: "Through two long weeks I wandered guided only by the stars..."
  },
  {
    id: 4,
    title: "A quiet forest morning",
    date: "April 2, 2019",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    excerpt: "The forest was silent except for the wind brushing leaves..."
  },
  {
    id: 5,
    title: "City lights at midnight",
    date: "March 28, 2019",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
    excerpt: "Cars moved slowly through the quiet midnight streets..."
  },
  {
    id: 6,
    title: "A walk beside the river",
    date: "March 21, 2019",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    excerpt: "Water reflected the evening sky as we walked..."
  }
];

const StoriesPage: React.FC = () => {

  const navigate = useNavigate();

  const [visibleCount, setVisibleCount] = useState(6);

  const loadMoreStories = () => {
    setVisibleCount(prev => prev + 3);
  };

  return (
    <div className="stories-page">
        <div className="stories-header">
        <h2 className="stories-title">
          Latest Stories
        </h2>
      </div>

      <div className="stories-grid">

        {stories.slice(0, visibleCount).map(story => (

          <div key={story.id} className="story-card">

            <div className="story-image-wrapper">
              <img src={story.image} alt={story.title} className="story-image"/>
            </div>

            <div className="story-content">

              <h3 className="story-title">{story.title}</h3>

              <p className="story-date">{story.date}</p>

              <div className="story-divider"></div>

              <p className="story-excerpt">{story.excerpt}</p>

              <button
                className="read-more"
                onClick={() => navigate(`/story/${story.id}`)}
              >
                Read More →
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* LOAD MORE BUTTON */}

      {visibleCount < stories.length && (

        <div className="load-more-container">

          <button
            className="load-more-btn"
            onClick={loadMoreStories}
          >
            More Stories
          </button>

        </div>

      )}

    </div>
  );
};

export default StoriesPage;