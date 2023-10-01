/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../utils/context/authContext';
import RegisterForm from '../../components/RegisterForm';
import { getCurrentUserFollowCount } from '../../API/followUserData';
import profilePageStyle from '../../styles/profile/profilePage.module.css';

export default function UsersPage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [followCount, setFollowCount] = useState(0);

  useEffect(() => {
    document.title = 'User Profile';
    getCurrentUserFollowCount(user.id).then(setFollowCount);
  }, [user.id]);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className={profilePageStyle.ProfilePageContainer}>
      <img className={profilePageStyle.ProfileImage} src={user.image_url} width="200" />
      <h1 className={profilePageStyle.UserName}>{user.username}</h1>
      <h2 className={profilePageStyle.Email}>{user.email}</h2>
      <h3 className={profilePageStyle.Followers}>Followers: {followCount}</h3>
      <Button className={profilePageStyle.Button} onClick={handleModalOpen}>Update User</Button>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton className={profilePageStyle.ModalHeader}>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body className={profilePageStyle.ModalBody}>
          <RegisterForm user={user} />
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </div>
  );
}
