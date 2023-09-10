/* eslint-disable implicit-arrow-linebreak */
import { clientCredentials } from '../utils/client';

const getSingleThreadComment = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/threadComments/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve((data)))
    .catch(reject);
});

const deleteThreadComment = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/threadComments/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => resolve((data)))
    .catch(reject);
});
const updateThreadComment = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/threadComments/${payload.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(resolve)
    .catch(reject);
});
const createThreadComment = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/threadComments`, {
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
const getThreadComments = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/threadComments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.warn(data[0].thread.id, id, id);
      const userEvents = Object.values(data).filter((item) => item.thread.id === parseInt(id, 10));
      console.warn('dataAfterFileter', userEvents);
      resolve(userEvents);
    })
    .catch(reject);
});

export {
  deleteThreadComment, getSingleThreadComment, updateThreadComment, createThreadComment, getThreadComments,
};
