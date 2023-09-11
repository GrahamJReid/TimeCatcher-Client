import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/context/authContext';
// Import your ThreadCard component
import { getUserFollowThreads } from '../../API/followThreadsData';
import { getSingleThread } from '../../API/threadsData';
import EventThreadCard from '../eventThreads/EventThreadCard';

export default function FollowedThreads() {
  const [threads, setThreads] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch the followThread nodes for the current user
    getUserFollowThreads(user.id)
      .then((followThreads) => {
        // Extract the followedThread IDs from the followThread nodes
        const followedThreadIds = followThreads.map((followThread) => followThread.thread.id);

        // Fetch the thread data for the followed threads
        const promises = followedThreadIds.map((followedThreadId) => getSingleThread(followedThreadId));

        Promise.all(promises)
          .then((results) => {
            // Set the fetched threads in state
            setThreads(results);
          })
          .catch((error) => {
            console.error('Error fetching followed threads:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching followThread nodes:', error);
      });
  }, [user]);

  return (
    <div>
      <h1>Threads Followed by Current User</h1>
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
    </div>
  );
}
