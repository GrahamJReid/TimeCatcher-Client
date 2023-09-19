/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { useAuth } from '../../utils/context/authContext';
import { createTimeline, updateTimeline } from '../../API/timelineData';
import awsCredentials from '../../.awsCred';
import Loading from '../Loading';
import timelineFormStyle from '../../styles/forms/timelineForm.module.css';

function TimelineForm({ obj }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    let updatedImageUrl = formData.imageUrl;

    if (formData.image) {
      const awsImageUrl = await uploadImageToS3(formData.image);

      if (awsImageUrl) {
        updatedImageUrl = awsImageUrl;
      }
    }

    const timelineData = {
      title: formData.title,
      public: formData.public,
      gallery: formData.gallery,
      imageUrl: updatedImageUrl,
      dateAdded: Date.now(),
      userId: user.id,
    };

    if (obj) {
      timelineData.id = obj.id;
      timelineData.ispublic = formData.public;
      timelineData.gallery = formData.gallery;
      await updateTimeline(timelineData);
    } else {
      await createTimeline(timelineData);
    }
    setLoading(false);
    window.location.reload(true);
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

      {loading ? (
        <Loading /> // Show the Loading component when loading is true
      ) : (
        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className={timelineFormStyle.CreateButton}
        >
          {obj ? 'Edit Timeline' : 'Create Timeline'}
        </Button>
      )}
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

  }),
};

export default TimelineForm;
