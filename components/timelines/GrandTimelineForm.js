/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
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
import { createTimelineEvent } from '../../API/timelineEvent';
import { createTimeline } from '../../API/timelineData';
import timelineFormStyle from '../../styles/forms/timelineForm.module.css';

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

    // Create the timeline
    const timelinePayload = {
      userId: user.id,
      title: formData.title,
      public: formData.public,
      gallery: formData.gallery,
      imageUrl: updatedImageUrl,
      dateAdded: Date.now(),

    };
    const createdTimeline = await createTimeline(timelinePayload);

    if (createdTimeline) {
      const { id: timelineId } = createdTimeline; // Extract the timelineId

      // Map through the events and create timeline events
      const timelineEventPayloads = events.map((event) => ({
        timelineId,
        eventId: event.id,
      }));

      // You can use a loop to create timeline events one by one
      for (const timelineEventPayload of timelineEventPayloads) {
        await createTimelineEvent(timelineEventPayload);
      }

      setLoading(false);

      setFormData({
        title: '',
        imageUrl: null,
        public: false,
        gallery: false,
      });

      router.push('/timelines/MyTimelines');
    } else {
      // Handle the case where timeline creation fails
      setLoading(false);
      // Display an error message or handle it in another way
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className={timelineFormStyle.FormContainer}
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

      {loading ? (
        <Loading /> // Show the Loading component when loading is true
      ) : (
        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className={timelineFormStyle.CreateButton}
        >
          Create Timeline
        </Button>
      )}
    </Form>
  );
}

GrandTimelineForm.propTypes = {
  events: PropTypes.array.isRequired,
};

export default GrandTimelineForm;
