/* eslint-disable react/jsx-boolean-value */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { getUserGalleryTimelines } from '../../API/timelineData';
import TimelineCard from '../timelines/TimelineCard';

export default function GalleryCarousel() {
  const [timelines, setTimelines] = useState([]);
  const { user } = useAuth();

  const getGalleryTimelines = () => {
    getUserGalleryTimelines(user.id).then(setTimelines);
  };

  useEffect(() => {
    getGalleryTimelines();
  }, [user]);

  return (

    <Carousel interval={null} className="gallery-carousel-container">
      {timelines.map((timeline) => (
        <Carousel.Item key={timeline.id}>
          <div>
            <section
              key={`timeline--${timeline.id}`}
              className="carousel-card-container"
              id="timeline-section"
            >
              <TimelineCard
                id={timeline.id}
                title={timeline.title}
                imageUrl={timeline.image_url}
                ispublic={timeline.public}
                gallery={timeline.gallery}
                dateAdded={timeline.date_added}
                userId={timeline.user_id}
                onUpdate={getGalleryTimelines}
              />
            </section>
          </div>

        </Carousel.Item>
      ))}
    </Carousel>
  );
}
