/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { useAuth } from '../../utils/context/authContext';
// Update with your event data API file
import awsCredentials from '../../.awsCred';
import { createEvent, updateEvent } from '../../API/eventData';

function EventForm({ obj }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: obj ? obj.title : '',
    description: obj ? obj.description : '',
    imageUrl: null,
    date: obj ? obj.date : '',
    color: obj ? obj.color : '',
  });

  useEffect(() => {
    if (obj) {
      setFormData({
        title: obj.title,
        description: obj.description,
        imageUrl: obj.imageUrl,
        date: obj.date,
        color: obj.color,
      });
    }
  }, [obj]);

  const handleInputChange = (e) => {
    const {
      name, value, type, files,
    } = e.target;

    if (type === 'file') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: files[0],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const uploadImageToS3 = async (file) => {
    const s3 = new S3Client({
      region: awsCredentials.awsRegion,
      credentials: {
        accessKeyId: awsCredentials.awsAccessKeyId,
        secretAccessKey: awsCredentials.awsSecretAccessKey,
      },
    });

    const params = {
      Bucket: 'timecatchertestbucket',
      Key: `eventImages/${file.name}`,
      Body: file,
    };

    try {
      const command = new PutObjectCommand(params);
      await s3.send(command);
      return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.warn('form data before submit', formData);

    let updatedImageUrl = obj.imageUrl; // Use obj.imageUrl as the default

    if (formData.image) {
      const awsImageUrl = await uploadImageToS3(formData.image);

      if (awsImageUrl) {
        updatedImageUrl = awsImageUrl; // Update the image URL if a new image is uploaded
      }
    }

    const eventData = {
      title: formData.title,
      description: formData.description,
      imageUrl: updatedImageUrl,
      date: formData.date,
      color: formData.color,
      userId: user.id,
    };

    if (obj) {
      eventData.id = obj.id;
      await updateEvent(eventData);
    } else {
      await createEvent(eventData);
    }

    window.location.reload(true);
  };

  return (

    <Form
      onSubmit={handleSubmit}
      className="text-center d-flex flex-column justify-content-center align-content-center"
      style={{
        height: '90vh',
        padding: '30px',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          name="title"
          required
          value={formData.title}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          name="description"
          required
          value={formData.description}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          name="date"
          type="date"
          required
          value={formData.date}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Color</Form.Label>
        <Form.Control
          name="color"
          type="color"
          required
          value={formData.color}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Image</Form.Label>
        <Form.Control
          name="image"
          {...obj ? '' : { required: true }}
          type="file"
          onChange={handleInputChange}
        />
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        style={{ backgroundColor: '#003049', marginTop: '20px' }}
      >
        {obj ? 'Edit Event' : 'Create Event'}
      </Button>
    </Form>
  );
}

EventForm.propTypes = {
  obj: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    userId: PropTypes.object.isRequired,
  }).isRequired,
};

export default EventForm;
