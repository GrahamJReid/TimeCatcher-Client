import { clientCredentials } from '../utils/client';

const getAllProducts = () => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        resolve(Object.values(data));
      } else {
        resolve([]);
      }
    })
    .catch(reject);
});
const getMyProducts = (uid) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const usersproducts = Object.values(data).filter((item) => item.seller_id.uid === uid);
      resolve(usersproducts);
    })
    .catch(reject);
});
const getSingleProduct = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/products/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve((data)))
    .catch(reject);
});

const getproductsByCategory = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const usersproducts = Object.values(data).filter((item) => item.category_id.id === id);
      resolve(usersproducts);
    })
    .catch(reject);
});

const deleteProducts = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => resolve((data)))
    .catch(reject);
});
const updateTimeline = (updatedData) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/timelines/${updatedData.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json', // Set the content type appropriately
    },
    body: JSON.stringify(updatedData), // Convert the data to JSON
  })
    .then((resp) => resolve(resp.json()))
    .catch(reject);
});
const createTimeline = (formData) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/createtimeline`, {
    method: 'POST',
    body: formData, // Use the FormData object directly
  })
    .then((resp) => resolve(resp.json()))
    .catch(reject);
});

export {
  getAllProducts, deleteProducts, getSingleProduct, updateTimeline, createTimeline, getMyProducts, getproductsByCategory,
};
