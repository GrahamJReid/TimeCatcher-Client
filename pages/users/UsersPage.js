/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useAuth } from '../../utils/context/authContext';

export default function UsersPage() {
  const { user } = useAuth();
  console.warn(user);

  return (

    <div>

      <h1>Users Page</h1>
      <h2> all users go here</h2>
    </div>

  );
}
