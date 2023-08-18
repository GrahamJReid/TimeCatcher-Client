/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { useAuth } from '../../utils/context/authContext';
import { createTimeline, updateTimeline } from '../../API/timelineData';
import awsCredentials from '../../awsCred';

function TimelineForm({ obj }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: obj ? obj.title : '',
    imageUrl: null,
    public: obj ? obj.ispublic : false,
    gallery: obj ? obj.gallery : false,
  });

  useEffect(() => {
    if (obj) {
      setFormData({
        title: obj.title,
        imageUrl: obj.imageUrl,
        public: obj.ispublic,
        gallery: obj.gallery,
      });
    }
  }, [obj]);
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

    let updatedImageUrl = formData.imageUrl; // Default to the existing image URL

    if (formData.image) {
      const awsImageUrl = await uploadImageToS3(formData.image);

      if (awsImageUrl) {
        updatedImageUrl = awsImageUrl; // Update the image URL if a new image is uploaded
      }
    }

    const timelineData = {
      title: formData.title,
      public: formData.public,
      gallery: formData.gallery,
      imageUrl: updatedImageUrl, // Use the existing or updated image URL
      dateAdded: Date.now(),
      userId: user.id,
    };

    if (obj) {
      // If obj is present, update the timeline
      timelineData.id = obj.id; // Add the timeline ID for update
      timelineData.ispublic = formData.public; // Update the 'ispublic' field
      timelineData.gallery = formData.gallery; // Update the 'gallery' field
      await updateTimeline(timelineData);
    } else {
      // If obj is not present, create a new timeline
      await createTimeline(timelineData);
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
        <Form.Label>Image</Form.Label>
        <Form.Control
          name="image"
          {...obj ? '' : { required: true }}
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
        {obj ? 'Edit Timeline' : 'Create Timeline'}
      </Button>
    </Form>
  );
}

TimelineForm.propTypes = {
  obj: PropTypes.shape({

    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    ispublic: PropTypes.bool.isRequired,
    gallery: PropTypes.bool.isRequired,
    dateAdded: PropTypes.number.isRequired,
    userId: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,

  }).isRequired,
};

export default TimelineForm;
