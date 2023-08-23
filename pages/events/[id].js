/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { getSingleEvent } from '../../API/eventData';

export default function ViewEvent() {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState({});

  const defineEvent = () => {
    getSingleEvent(id)
      .then((Data) => {
        setEvent(Data);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  };

  useEffect(() => {
    defineEvent();
    document.title = 'View Event';
  }, [id]);

  return (
    <>
      <div>
        <h1>{event.title}</h1>
        <img src={event.image_url} width="300px" />
        <h2>{event.description}</h2>
        <h3>{event.date}</h3>
      </div>
    </>
  );
}
