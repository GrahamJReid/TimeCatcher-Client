/* eslint-disable implicit-arrow-linebreak */
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
const getUserTimelines = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/timelines`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const userTimelines = Object.values(data).filter((item) => item.user_id.id === id);
      resolve(userTimelines);
    })
    .catch(reject);
});
const getUserTimelinesWithSearch = (id, searchQuery) => new Promise((resolve, reject) => {
  // Create a query parameter for the search
  const queryParams = searchQuery ? `?search=${searchQuery}` : '';

  fetch(`${clientCredentials.databaseURL}/timelines${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Filter events based on the user_id and searchQuery
      let userTimelines = Object.values(data).filter((item) => item.user_id.id === id);

      // You can add additional filtering logic here if needed based on searchQuery
      if (searchQuery) {
        userTimelines = userTimelines.filter((timeline) =>
          timeline.title.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      resolve(userTimelines);
    })
    .catch(reject);
});
const getUserGalleryTimelines = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/timelines`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const userTimelines = Object.values(data).filter((item) => item.user_id.id === id && item.gallery === true);
      resolve(userTimelines);
    })
    .catch(reject);
});
const getUserPublicTimelines = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/timelines`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const userTimelines = Object.values(data).filter((item) => item.user_id.id === id && item.public === true);
      resolve(userTimelines);
    })
    .catch(reject);
});
const getSingleTimeline = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/timelines/${id}`, {
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

const deleteTimeline = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/timelines/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => resolve((data)))
    .catch(reject);
});
const updateTimeline = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/timelines/${payload.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(resolve)
    .catch(reject);
});
const createTimeline = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/timelines`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

export {
  getAllProducts, deleteTimeline, getSingleTimeline, updateTimeline, createTimeline, getUserTimelines, getproductsByCategory, getUserPublicTimelines, getUserGalleryTimelines, getUserTimelinesWithSearch,
};
