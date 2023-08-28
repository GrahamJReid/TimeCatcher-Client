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
const getSingleEvent = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/events/${id}`, {
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

const deleteEvent = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/events/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => resolve((data)))
    .catch(reject);
});
const updateEvent = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/events/${payload.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(resolve)
    .catch(reject);
});
const createEvent = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/events`, {
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
const getUserEvents = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/events`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const userEvents = Object.values(data).filter((item) => item.user_id.id === id);
      resolve(userEvents);
    })
    .catch(reject);
});
const getUserEventsWithSearch = (id, searchQuery) => new Promise((resolve, reject) => {
  // Create a query parameter for the search
  const queryParams = searchQuery ? `?search=${searchQuery}` : '';

  fetch(`${clientCredentials.databaseURL}/events${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Filter events based on the user_id and searchQuery
      let userEvents = Object.values(data).filter((item) => item.user_id.id === id);

      // You can add additional filtering logic here if needed based on searchQuery
      if (searchQuery) {
        userEvents = userEvents.filter((event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase())
          || event.description.toLowerCase().includes(searchQuery.toLowerCase())
          || event.date.toLowerCase().includes(searchQuery.toLowerCase())
          || (event.BCE ? 'BCE' : 'CE').toLowerCase().includes(searchQuery.toLowerCase()));
      }

      resolve(userEvents);
    })
    .catch(reject);
});

export {
  getAllProducts, deleteEvent, getSingleEvent, updateEvent, createEvent, getUserTimelines, getproductsByCategory, getUserEvents, getUserEventsWithSearch,
};
