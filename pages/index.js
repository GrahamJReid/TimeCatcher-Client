/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { signOut } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';
import getSingleUser from '../utils/data/userData';

function Home() {
  const { user } = useAuth();
  const [singleUser, setSingleUser] = useState({});
  console.warn('this is me singleUser', singleUser);
  const absoluteImageUrl = `${singleUser.image}`;

  useEffect(() => {
    getSingleUser(user.id).then(setSingleUser);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="text-center d-flex flex-column justify-content-center align-content-center"
      style={{
        height: '90vh',
        padding: '30px',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <h1>Hello {user.username}! </h1>

      <img src={absoluteImageUrl} />
      <p>Your Bio: {user.bio}</p>
      <p>Click the button below to logout!</p>
      <Button variant="danger" type="button" size="lg" className="copy-btn" onClick={signOut}>
        Sign Out
      </Button>
    </div>
  );
}

export default Home;
