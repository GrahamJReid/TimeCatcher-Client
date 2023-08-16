import PropTypes from 'prop-types';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../../utils/context/authContext';
import { createTimeline } from '../../API/timelineData';

function TimelineForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    image: null,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.warn('formData before submit:', formData);

    // Create a new FormData object and populate it with existing formData fields
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('image', formData.image, formData.imageName);
    formDataToSend.append('public', formData.public);
    formDataToSend.append('gallery', formData.gallery);

    // Add additional fields using the append method
    formDataToSend.append('dateAdded', Date.now());
    formDataToSend.append('userId', user.id);

    console.warn('formDataToSend entries:', [...formDataToSend.entries()]);

    // Call the createTimeline function with the updated formData
    await createTimeline(formDataToSend);
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
