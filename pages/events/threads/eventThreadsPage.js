import React, { useEffect, useState } from 'react';
import EventThreadFormModal from '../../../components/eventThreads/EventThreadFormModal';
import EventThreadCard from '../../../components/eventThreads/EventThreadCard';
import { getThreadsWithSearch } from '../../../API/threadsData';
import threadPageStyle from '../../../styles/threads/eventThreadPage.module.css';

export default function EventThreadPage() {
  const [threads, setThreads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const displayThreads = () => {
    getThreadsWithSearch(searchQuery)
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

  useEffect(() => {
    displayThreads(); // Call displayThreads whenever searchQuery changes
  }, [searchQuery]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  return (

    <>
      <div className={threadPageStyle.ThreadPageContainer}>
        <h1>Event Threads</h1>
        <EventThreadFormModal />
        <input
          type="text"
          placeholder="Search Threads..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
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
                description={thread.description}
              />
            </section>
          ))}
        </div>
      </div>
    </>

  );
}
