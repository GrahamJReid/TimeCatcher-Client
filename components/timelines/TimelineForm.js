/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { useAuth } from '../../utils/context/authContext';
import { createTimeline } from '../../API/timelineData';
import awsCredentials from '../../awsCred';

function TimelineForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: null,
    public: false,
    gallery: false,
  });

  const handleInputChange = (e) => {
    const {
      name, value, type, files,
    } = e.target;

    // Handle file input separately
    if (type === 'file') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0], // Assign the File object to the image field
        imageName: files[0].name, // Store the image file name
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
      region: awsCredentials.awsRegion, // Replace with your AWS region
      credentials: {
        accessKeyId: awsCredentials.awsAccessKeyId,
        secretAccessKey: awsCredentials.awsSecretAccessKey,
      },
    });

    const params = {
      Bucket: 'timecatchertestbucket',
      Key: `timelineImages/${file.name}`,
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
      const awsImageUrl = await uploadImageToS3(formData.image);

      if (awsImageUrl) {
        const formDataToSend = {
          title: formData.title,
          public: formData.public,
          gallery: formData.gallery,
          imageUrl: awsImageUrl, // Use the S3 image URL here
          dateAdded: Date.now(),
          userId: user.id,
        };

        // Perform your createTimeline logic here
        console.warn('Form data with S3 image URL:', formDataToSend);
        await createTimeline(formDataToSend);
        window.location.reload(true);
      }
    }
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
        <Form.Label>Image</Form.Label>
        <Form.Control
          name="image"
          required
          type="file"
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Check
        type="switch"
        id="public"
        name="public"
        label="Make public?"
        checked={formData.public}
        onChange={(e) => {
          setFormData((prevState) => ({
            ...prevState,
            public: e.target.checked,
          }));
        }}
      />
      <Form.Check
        type="switch"
        id="gallery"
        name="gallery"
        label="Gallery?"
        checked={formData.gallery}
        onChange={(e) => {
          setFormData((prevState) => ({
            ...prevState,
            gallery: e.target.checked,
          }));
        }}
      />

      <Button variant="primary" type="submit" style={{ backgroundColor: '#003049', marginTop: '20px' }}>
        Create Timeline
      </Button>
    </Form>
  );
}

TimelineForm.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default TimelineForm;
