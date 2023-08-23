/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Button, Dropdown } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { getUserTimelines } from '../../API/eventData';
import { getSingleTimelineEvents } from '../../API/timelineEvent';
import { useAuth } from '../../utils/context/authContext';

function GrandTimeline() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedTimelines, setSelectedTimelines] = useState([]);
  const [userTimelines, setUserTimelines] = useState([]);
  const [selectedTimelinesEvents, setSelectedTimelinesEvents] = useState([]); // State for selected timeline events

  // Fetch user timelines when the component mounts
  useEffect(() => {
    getUserTimelines(user.id).then(setUserTimelines);
  }, []);

  // Function to handle timeline selection
  const handleTimelineSelect = async (timeline) => {
    // Check if the timeline is already selected
    const timelineIds = selectedTimelines.map((t) => t.id);
    if (!timelineIds.includes(timeline.id)) {
      // Add the selected timeline to the list
      setSelectedTimelines([...selectedTimelines, timeline]);

      // Fetch and merge events for the selected timeline
      const events = await getSingleTimelineEvents(timeline.id);

      // Sort the events by date
      const sortedEvents = [...selectedTimelinesEvents, ...events].sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );

      setSelectedTimelinesEvents(sortedEvents);
    }
  };

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Select Timelines
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {userTimelines.map((timeline) => (
            <Dropdown.Item key={timeline.id} onClick={() => handleTimelineSelect(timeline)}>
              {timeline.title}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {/* Display the selected timeline events here */}
      <VerticalTimeline>
        <div>
          {selectedTimelinesEvents.map((event, index) => (
            <VerticalTimelineElement
              key={`${event.id}-${index}`}
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
              <Button
                onClick={() => {
                  router.push(`/events/${event.id}`);
                }}
              >
                View
              </Button>

            </VerticalTimelineElement>

          ))}
        </div>
      </VerticalTimeline>
    </div>
  );
}

export default GrandTimeline;
