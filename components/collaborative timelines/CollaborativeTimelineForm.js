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
import awsCredentials from '../../.awsCred';
import Loading from '../Loading';
import { createCollaborativeTimeline, updateCollaborativeTimeline } from '../../API/collaborativeTimelineData';
import { getOtherUsers } from '../../API/userData';
import collaborativeFormStyle from '../../styles/forms/collaborativeForm.module.css';

function CollaborativeTimelineForm({ obj }) { // Pass the list of users as a prop
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: obj ? obj.title : '',
    imageUrl: null,
    public: obj ? obj.ispublic : false,
    gallery: obj ? obj.gallery : false,
    user2: null, // Initialize user2 as null
  });
  useEffect(() => {
    getOtherUsers(user.id).then(setUsers);
  }, [obj]);

  useEffect(() => {
    if (obj) {
      setFormData({
        title: obj.title,
        imageUrl: obj.imageUrl,
        public: obj.ispublic,
        gallery: obj.gallery,
        user2: obj.user2 ? obj.user2.id : null, // Initialize user2 from obj or as null
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
      gallery: false,
      imageUrl: updatedImageUrl,
      dateAdded: Date.now(),
      user1: user.id,
      user2: formData.user2, // Include user2 in the payload
    };

    if (obj) {
      timelineData.id = obj.id;
      timelineData.public = formData.public;
      timelineData.gallery = false;
      await updateCollaborativeTimeline(timelineData);
    } else {
      await createCollaborativeTimeline(timelineData);
    }
    setLoading(false);
    window.location.reload(true);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className={collaborativeFormStyle.FormContainer}
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

      {obj ? '' : (
        <Form.Group className="mb-3">
          <Form.Label>Select Collaborator</Form.Label>
          <Form.Control
            as="select"
            name="user2"
            value={formData.user2}
            onChange={handleInputChange}
          >
            <option value={null}>Select Collaborator</option>
            {users.map((user2) => (
              <option key={user2.id} value={user2.id}>
                {user2.username}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      ) }

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

      <Button
        variant="primary"
        type="submit"
        disabled={loading}
        className={collaborativeFormStyle.CreateButton}
      >
        {loading ? (
          <Loading />
        ) : (
          obj ? 'Edit Timeline' : 'Create Timeline'
        )}
      </Button>
    </Form>
  );
}

CollaborativeTimelineForm.propTypes = {
  obj: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    ispublic: PropTypes.bool.isRequired,
    gallery: PropTypes.bool.isRequired,
    dateAdded: PropTypes.number.isRequired,
    user1: PropTypes.object.isRequired,
    user2: PropTypes.object.isRequired, // Update the PropTypes for user2
    onUpdate: PropTypes.func.isRequired,
  }),
  users: PropTypes.arrayOf(PropTypes.object).isRequired, // Add PropTypes for users
};

export default CollaborativeTimelineForm;
