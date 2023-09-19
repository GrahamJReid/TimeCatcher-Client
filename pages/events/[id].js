/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSingleEvent } from '../../API/eventData';
import singleEventStyle from '../../styles/events/viewSingleEvent.module.css';

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
      <div className={singleEventStyle.ViewSingleEventContainer}>
        <h1 className={singleEventStyle.Title}>{event.title}</h1>
        <h3 className={singleEventStyle.Date}>{event.date} {event.BCE ? 'BCE' : 'CE'} </h3>
        <img src={event.image_url} width="300px" className={singleEventStyle.EventImage} />
        <h2 className={singleEventStyle.Description}>{event.description}</h2>

      </div>
    </>
  );
}
