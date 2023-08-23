/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/context/authContext';

import UserCard from '../../components/users/UserCard';
import { getOtherUsers } from '../../API/userData';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  const displayUsers = () => {
    getOtherUsers(user.id)
      .then((Data) => {
        setUsers(Data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

  useEffect(() => {
    displayUsers();
  }, [user.id]);

  return (

    <div>
      <head>
        <title>Users Page</title>
      </head>
      <h1>Users Page</h1>
      <div className="text-center my-4 d-flex">
        {users.map((singleUser) => (
          <section
            key={`singleUser--${singleUser.id}`}
            className="singleUser"
            style={{ margin: '40px' }}
            id="user-section"
          >
            <UserCard
              id={singleUser.id}
              username={singleUser.username}
              imageUrl={singleUser.image_url}
              email={singleUser.email}
              uid={singleUser.uid}
            />
          </section>
        ))}
      </div>
    </div>

  );
}
