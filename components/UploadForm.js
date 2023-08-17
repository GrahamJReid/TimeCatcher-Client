/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import Head from 'next/head';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const initialState = {
  image: null, // Change from '' to null
  name: '',
  role: '',
  team_id: '',
};

export default function UplaodForm() {
  const [formInput, setFormInput] = useState(initialState);
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormInput((prevState) => ({
        ...prevState,
        image: file,
      }));
    }
  };

  const uploadImageToS3 = async (file) => {
    const s3 = new S3Client({
      region: 'us-east-2', // Replace with your AWS region
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });

    const params = {
      Bucket: 'timecatchertestbucket',
      Key: `test1/${file.name}`,
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

    if (formInput.image) {
      const imageUrl = await uploadImageToS3(formInput.image);

      if (imageUrl) {
        // You can now use the imageUrl in your payload
        console.warn('Uploaded image URL:', imageUrl);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Create/Edit Member</title>
      </Head>

      <img src="https://timecatchertestbucket.s3.amazonaws.com/uploads/swirl.png" />
      <Form onSubmit={handleSubmit}>
        <h2>Member</h2>
        <div className="member-form-container">
          {/* ... other inputs ... */}
          <FloatingLabel controlId="floatingInput2" label="Image" className="mb-3">
            <Form.Control
              type="file"
              accept="image/*"
              name="image"
              onChange={handleFileChange}
              required
            />
          </FloatingLabel>
        </div>
        <Button className="member-form-submitbtn" type="submit">
          submit
        </Button>
      </Form>
    </>
  );
}
