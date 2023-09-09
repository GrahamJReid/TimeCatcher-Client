import React, { useEffect, useState } from 'react';
import EventThreadFormModal from '../../../components/eventThreads/EventThreadFormModal';
import EventThreadCard from '../../../components/eventThreads/EventThreadCard';
import { getThreads } from '../../../API/threadsData';

export default function EventThreadPage() {
  const [threads, setThreads] = useState([]);

  const displayThreads = () => {
    getThreads()
      .then((Data) => {
        setThreads(Data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

  useEffect(() => {
    displayThreads();
    document.title = 'Threads';
  }, []);
  return (

    <>
      <h1>Event Threads</h1>
      <EventThreadFormModal />
      <div>
        {threads.map((thread) => (
          <section
            key={`thread--${thread.id}`}
            className="thread"
            style={{ margin: '40px' }}
            id="thread-section"
          >
            <EventThreadCard
              id={thread.id}
              title={thread.title}
              event={thread.event}
              isUser={thread.user}
              date={thread.date}
            />
          </section>
        ))}
      </div>
    </>

  );
}
