/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../utils/context/authContext';
import RegisterForm from '../../components/RegisterForm';

export default function UsersPage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.title = 'User Profile';
  }, [user.id]);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div>
      <img src={user.image_url} width="200" />
      <h1>{user.username}</h1>
      <h2>{user.email}</h2>
      <Button onClick={handleModalOpen}>Update User</Button>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegisterForm user={user} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
