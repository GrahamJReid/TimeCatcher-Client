/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useAuth } from '../../utils/context/authContext';

export default function MyEvents() {
  const { user } = useAuth();
  console.warn(user);

  return (

    <div>

      <h1>My Events</h1>
      <h2>!{user.username}!</h2>
      <img src={user.image} />
    </div>

  );
}
