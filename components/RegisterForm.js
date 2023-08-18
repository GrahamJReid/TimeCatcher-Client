/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Head from 'next/head';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import PropTypes from 'prop-types';
import { registerUser } from '../utils/auth';
import { clientCredentials } from '../utils/client';
import awsCredentials from '../awsCred';

const RegisterForm = ({ user }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    image: null, // Change from '' to null
    uid: user.uid,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        image: file,
      }));
    }
  };

  const uploadImageToS3 = async (file) => {
    const s3 = new S3Client({
      region: awsCredentials.awsRegion, // Replace with your AWS region
      credentials: {
        accessKeyId: awsCredentials.awsAccessKeyId,
        secretAccessKey: awsCredentials.awsSecretAccessKey,
      },
    });

    const params = {
      Bucket: 'timecatchertestbucket',
      Key: `profileImages/${file.name}`,
      Body: file,
    };

    try {
      const command = new PutObjectCommand(params);
      const response = await s3.send(command);
      return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.image) {
      const imageUrl = await uploadImageToS3(formData.image);

      if (imageUrl) {
        const formDataToSend = {
          username: formData.username,
          image_url: imageUrl,
          email: formData.email,
          uid: user.uid,
        };

        // Perform your registerUser logic here
        console.warn('Form data with image URL:', formDataToSend);
        await registerUser(formDataToSend);
        window.location.reload(true);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Profile Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            onChange={handleFileChange}
            required
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          style={{ backgroundColor: '#003049', marginTop: '20px' }}
        >
          Register
        </Button>
      </Form>
    </>
  );
};

RegisterForm.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
};

export default RegisterForm;
