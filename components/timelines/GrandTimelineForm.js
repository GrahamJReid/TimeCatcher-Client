/* eslint-disable no-unused-vars */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import awsCredentials from '../../.awsCred';
import Loading from '../Loading';
import addTimeline from '../../API/addTimelineData';

function GrandTimelineForm({ events }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

    if (type === 'file') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
        imageName: files[0].name,
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
    setLoading(true);
    let updatedImageUrl = formData.imageUrl;

    if (formData.image) {
      const awsImageUrl = await uploadImageToS3(formData.image);

      if (awsImageUrl) {
        updatedImageUrl = awsImageUrl;
      }
    }

    const payload = {

      userId: user.id,
      timeline: {
        title: formData.title,
        public: formData.public,
        gallery: formData.gallery,
        image_url: updatedImageUrl,
        date_added: Date.now(),
      },
      events: events.map((event) => ({
        title: event.title,
        description: event.description,
        date: event.date,
        color: event.color,
        image_url: event.image_url,
      })),
    };
    await addTimeline(payload);

    setLoading(false);

    setFormData({
      title: '',
      imageUrl: null,
      public: false,
      gallery: false,
    });
    router.push('/timelines/MyTimelines');
  };
  console.warn(events);
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

      <Button
        variant="primary"
        type="submit"
        style={{ backgroundColor: '#003049', marginTop: '20px' }}
        disabled={loading}
      >
        {loading ? <Loading /> : 'Create Timeline'}
      </Button>
    </Form>
  );
}

GrandTimelineForm.propTypes = {
  events: PropTypes.array.isRequired,
};

export default GrandTimelineForm;
