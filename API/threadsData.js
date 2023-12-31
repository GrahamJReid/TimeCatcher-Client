/* eslint-disable implicit-arrow-linebreak */
import { clientCredentials } from '../utils/client';

const getSingleThread = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/threads/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve((data)))
    .catch(reject);
});

const deleteThread = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/threads/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => resolve((data)))
    .catch(reject);
});
const updateThread = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/threads/${payload.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(resolve)
    .catch(reject);
});
const createThread = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/threads`, {
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
const getUserThreads = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/threads`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const userEvents = Object.values(data).filter((item) => item.user.id === id);
      resolve(userEvents);
    })
    .catch(reject);
});
const getThreads = () => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/threads`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const userEvents = Object.values(data);
      resolve(userEvents);
    })
    .catch(reject);
});

const getThreadsWithSearch = (searchQuery) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/threads`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Filter threads based on the searchQuery
      const filteredThreads = Object.values(data).filter((thread) =>
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()));

      resolve(filteredThreads);
    })
    .catch(reject);
});

export {
  deleteThread, getSingleThread, updateThread, createThread, getUserThreads, getThreadsWithSearch, getThreads,
};
