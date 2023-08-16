/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useAuth } from '../../utils/context/authContext';
import TimelineFormModal from '../../components/timelines/TimeLineFormModal';

export default function MyTimelines() {
  const { user } = useAuth();
  console.warn(user);

  return (

    <div>

      <h1>My Timelines</h1>
      <TimelineFormModal />
    </div>

  );
}
