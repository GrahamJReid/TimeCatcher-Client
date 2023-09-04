/* eslint-disable no-trailing-spaces */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';
import { getSingleUser } from '../API/userData';

function OffCanvas({ name, ...props }) {
  const [show, setShow] = useState(false);
  const [singleUser, setSingleUser] = useState({});
  const { user } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const router = useRouter();

  useEffect(() => {
    getSingleUser(user.id).then(setSingleUser);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <>
      <Button variant="dark" onClick={handleShow} className="off-canvas-show-button">
        <div className="off-canvas-show-button-div">
          <img src="/menu2.png" width="70px" />
        </div>
      </Button>
      <Offcanvas show={show} onHide={handleClose} {...props} className="off-canvas-container">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="OffCanvas-title">TimeCatcher</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>

          <img src={singleUser.image_url} width="200px" className="OffCanvas-user-image" /> 
          <h1 className="OffCanvas-username">{user.username}</h1>

          <nav onClick={handleClose}>
            <ul className="navbar-nav me-auto">
              <div className="NavLinkList">
                <li className="NavLink" id="NavLink1">
                  <Link passHref href="/">
                    <a className="NavLink">
                      Home
                    </a>
                  </Link>
                </li>

                <li className="NavLink" id="NavLink2">
                  <Link passHref href="/timelines/MyTimelines">
                    <a className="NavLink">
                      My Timelines
                    </a>
                  </Link>
                </li>
                <li className="NavLink" id="NavLink3">
                  <Link passHref href="/collaborativeTimelines/collaborativeTimelines">
                    <a className="NavLink">
                      Collaborative
                    </a>
                  </Link>
                </li>
                <li className="NavLink" id="NavLink2">
                  <Link passHref href="/events/MyEvents">
                    <a className="NavLink">
                      My Events
                    </a>
                  </Link>
                </li>
                <li className="NavLink" id="NavLink3">
                  <Link passHref href="/wikievents/WikiEvents">
                    <a className="NavLink">
                      WikiEvents
                    </a>
                  </Link>
                </li>

                <li className="NavLink" id="NavLink3">
                  <Link passHref href="/users/UsersPage">
                    <a className="NavLink">
                      Users
                    </a>
                  </Link>
                </li>
                <li className="NavLink" id="NavLink3">
                  <Link passHref href="/timelines/grandTimeline">
                    <a className="NavLink">
                      GrandTimeline
                    </a>
                  </Link>
                </li>
                <li className="NavLink" id="NavLink3">
                  <Link passHref href="/users/UserProfile">
                    <a className="NavLink">
                      Profile
                    </a>
                  </Link>
                </li>
               
              </div>
              <button
                type="button"
                className="btn navbar-signout-btn SignOutButton"
                onClick={() => {
                  router.push('/');
                  signOut();
                }}
              >
                Sign Out
              </button>
            </ul>
          </nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default OffCanvas;

OffCanvas.propTypes = {

  name: PropTypes.string.isRequired,

};
