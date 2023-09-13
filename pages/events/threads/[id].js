/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button } from 'react-bootstrap';
import { getSingleThread } from '../../../API/threadsData';
import ThreadCommentFormModal from '../../../components/threadComment.js/ThreadCommentFormModal';
import { getThreadComments } from '../../../API/threadCommentData';
import ThreadCommentCard from '../../../components/threadComment.js/ThreadCommentCard';
import { createFollowThread, deleteFollowThread, getUserFollowThreads } from '../../../API/followThreadsData';
import { useAuth } from '../../../utils/context/authContext';

export default function ViewThread() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const [thread, setThread] = useState({});

  const defineThread = () => {
    getSingleThread(id)
      .then((Data) => {
        setThread(Data);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  };
  const defineThreadComments = () => {
    getThreadComments(id)
      .then((Data) => {
        setComments(Data);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  };

  useEffect(() => {
    defineThread();
    defineThreadComments();
    document.title = 'View Thread';
  }, [id]);

  useEffect(() => {
    const integerId = parseInt(id, 10);
    async function checkIfFollowing() {
      try {
        const isCurrentlyFollowing = await getUserFollowThreads(user.id);
        console.warn(isCurrentlyFollowing);

        // Check if there's any followUser object where followedUser.id === integerId
        const isFollowing = isCurrentlyFollowing.some(
          (followThread) => followThread.thread.id === integerId,
        );

        setIsFollowing(isFollowing);
      } catch (error) {
        console.error('Error checking if following:', error);
      }
    }

    checkIfFollowing();
  }, [user.id, id]);
  const toggleFollow = async () => {
    try {
      // Check if the user is following the thread
      const userFollowThreads = await getUserFollowThreads(user.id); // Assuming you have the user object in scope
      const isFollowingThread = userFollowThreads.some((followThread) => followThread.thread.id === parseInt(id, 10));

      if (isFollowingThread) {
        // If following, unfollow the thread
        const followThreadToDelete = userFollowThreads.find((followThread) => followThread.thread.id === parseInt(id, 10));
        await deleteFollowThread(followThreadToDelete.id);
        setIsFollowing(false);
      } else {
        // If not following, follow the thread
        const payload = {
          user: user.id,
          thread: id,
        };
        await createFollowThread(payload);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };
  console.warn('these are the comments that you are looking for', thread);
  return (
    <>
      <div>
        <h1>{thread.title} Thread</h1>
        <h3>{thread.description}</h3>
        <Button onClick={toggleFollow}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
        <h2>Event</h2>
        {thread.event && thread.event.image_url && (
          <>
            <div>
              <div>
                <h3>{thread.event.title}</h3><img src={thread.event.image_url} width="300px" /><h4>{thread.event.date}</h4>
              </div>
              <h4>Accordian of event description</h4>
            </div>
            <ThreadCommentFormModal />
            <div>
              {comments.map((comment) => (
                <section
                  key={`comment--${comment.id}`}
                  className="comment"
                  style={{ margin: '40px' }}
                  id="comment-section"
                >
                  <ThreadCommentCard
                    id={comment.id}
                    content={comment.content}
                    isUser={comment.user}
                    thread={comment.thread}
                    date={comment.date}
                    onUpdate={defineThreadComments}
                  />
                </section>
              ))}
            </div>
          </>
        )}

      </div>
    </>
  );
}
