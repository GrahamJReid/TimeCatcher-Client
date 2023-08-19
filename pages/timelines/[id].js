/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

function Timeline() {
  const [sortedEventArray, setSortedEventArray] = useState([]);

  const eventArray = [
    {
      id: 1,
      title: 'title 1',
      date: '2023-05-19',
      imageUrl: 'https://t3.ftcdn.net/jpg/03/41/22/66/360_F_341226661_rH9SmwMoNxShy66rJ9Zy1m7zQCJfaXvH.jpg',
      description: 'this is an apple that was the first apple ever',
      color: 'red',
    },
    {
      id: 2,
      title: 'title 2',
      date: '2000-06-10',
      imageUrl: 'https://spaces-cdn.clipsafari.com/548zvxnhj2o3ayw92sf7q5d0t66q',
      description: 'this is an banana that was the first banana ever',
      color: 'orange',
    },
    {
      id: 3,
      title: 'title 3',
      date: '2002-09-09',
      imageUrl: 'https://clipartix.com/wp-content/uploads/2016/08/Grapes-clipart-3.png',
      description: 'grapes are great for real',
      color: 'purple',
    },
  ];
  useEffect(() => {
    // Create a copy of the eventArray and sort it by date
    const sortedEvents = [...eventArray].sort((a, b) => new Date(a.date) - new Date(b.date));
    setSortedEventArray(sortedEvents);
  }, []);

  return (
    <div>
      <input type="color" />
      <VerticalTimeline>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
          date="2011 - present"
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
        >
          <h3 className="vertical-timeline-element-title">Creative Director</h3>
          <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
          <p>
            Creative Direction, User Experience, Visual Design, Project Management, Team Leading
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="2010 - 2011"
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
        >
          <h3 className="vertical-timeline-element-title">Art Director</h3>
          <h4 className="vertical-timeline-element-subtitle">San Francisco, CA</h4>
          <p>
            Creative Direction, User Experience, Visual Design, SEO, Online Marketing
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="2008 - 2010"
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
        >
          <h3 className="vertical-timeline-element-title">Web Designer</h3>
          <h4 className="vertical-timeline-element-subtitle">Los Angeles, CA</h4>
          <p>
            User Experience, Visual Design
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="2006 - 2008"
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
        >
          <h3 className="vertical-timeline-element-title">Web Designer</h3>
          <h4 className="vertical-timeline-element-subtitle">San Francisco, CA</h4>
          <p>
            User Experience, Visual Design
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          date="April 2013"
          iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
        >
          <h3 className="vertical-timeline-element-title">Content Marketing for Web, Mobile and Social Media</h3>
          <h4 className="vertical-timeline-element-subtitle">Online Course</h4>
          <p>
            Strategy, Social Media
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          date="November 2012"
          iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
        >
          <h3 className="vertical-timeline-element-title">Agile Development Scrum Master</h3>
          <h4 className="vertical-timeline-element-subtitle">Certification</h4>
          <p>
            Creative Direction, User Experience, Visual Design
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          date="2002 - 2006"
          iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
        >
          <h3 className="vertical-timeline-element-title">Bachelor of Science in Interactive Digital Media Visual Imaging</h3>
          <h4 className="vertical-timeline-element-subtitle">Bachelor Degree</h4>
          <p>
            Creative Direction, Visual Design
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: 'green', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
          date="2023 - present"
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
        >
          <h3 className="vertical-timeline-element-title">Timeline test 1</h3>

          <p>
            this timeline app gonna blow your mind
          </p>
        </VerticalTimelineElement>

        <div>
          {sortedEventArray.map((event) => (
            <VerticalTimelineElement
              contentStyle={{ background: `${event.color}`, color: '#fff' }}
              contentArrowStyle={{ borderRight: `7px solid  ${event.color}` }}
              date={event.date}
              iconStyle={{ background: `${event.color}`, color: '#fff' }}
            >
              <h3 className="vertical-timeline-element-title">{event.title}</h3>
              <img src={event.imageUrl} />
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
