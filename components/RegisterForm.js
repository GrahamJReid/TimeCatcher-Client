import PropTypes from 'prop-types';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { registerUser } from '../utils/auth';

function RegisterForm({ user }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    image: '',
    uid: user.uid,
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

    // Create a FormData object to send the form data
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('uid', user.uid);
    formDataToSend.append('image', formData.image, formData.imageName); // Assuming formData.image is a File object

    console.warn(formDataToSend);
    registerUser(formDataToSend);
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
        <Form.Label>username</Form.Label>
        <Form.Control
          name="username"
          required
          value={formData.username}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>email</Form.Label>
        <Form.Control
          name="email"
          required
          value={formData.email}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Profile Image Url</Form.Label>
        <Form.Control
          name="image"
          required
          type="file"
          onChange={handleInputChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit" style={{ backgroundColor: '#003049', marginTop: '20px' }}>
        Register
      </Button>
    </Form>
  );
}

RegisterForm.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
};

export default RegisterForm;
