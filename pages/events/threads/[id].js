/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { getSingleThread } from '../../../API/threadsData';
import ThreadCommentFormModal from '../../../components/threadComment.js/ThreadCommentFormModal';

export default function ViewThread() {
  const router = useRouter();
  const { id } = router.query;

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

  useEffect(() => {
    defineThread();
    document.title = 'View Thread';
  }, [id]);
  console.warn(thread);
  return (
    <>
      <div>
        <h1>{thread.title} Thread</h1>
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
          </>
        )}

      </div>
    </>
  );
}
