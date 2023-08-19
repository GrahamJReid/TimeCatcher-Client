/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { useRouter } from 'next/router';
import { getSingleTimelineEvents } from '../../API/timelineEvent';

function Timeline() {
  const [sortedEventArray, setSortedEventArray] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    getSingleTimelineEvents(id).then((data) => {
      const sortedEvents = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
      setSortedEventArray(sortedEvents);
    });
    // Create a copy of the eventArray and sort it by date
  }, []);

  return (
    <div>

      <VerticalTimeline>

        <div>
          {sortedEventArray.map((event) => (
            <VerticalTimelineElement
              contentStyle={{ background: `${event.color}`, color: '#fff' }}
              contentArrowStyle={{ borderRight: `7px solid  ${event.color}` }}
              date={event.date}
              iconStyle={{ background: `${event.color}`, color: '#fff' }}
            >
              <h3 className="vertical-timeline-element-title">{event.title}</h3>
              <img src={event.image_url} width="200px" />
              <h5>description: {event.description}</h5>

              <p>
                {event.date}
              </p>
            </VerticalTimelineElement>

          ))}
        </div>
      </VerticalTimeline>

    </div>
  );
}

export default Timeline;
