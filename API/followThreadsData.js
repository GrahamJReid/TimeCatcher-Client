/* eslint-disable implicit-arrow-linebreak */
import { clientCredentials } from '../utils/client';

const getFollowThreads = () => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/followThreads`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const users = Object.values(data);
      resolve(users);
    })
    .catch(reject);
});

const getSingleFollowThread = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/followThreads/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve((data)))
    .catch(reject);
});

const getUserFollowThreads = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/followThreads`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const followuser = Object.values(data).filter((item) => item.user.id === id);
      resolve(followuser);
    })
    .catch(reject);
});

const createFollowThread = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/followThreads`, {
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
const deleteFollowThread = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/followThreads/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => resolve((data)))
    .catch(reject);
});

export {
  createFollowThread, deleteFollowThread, getSingleFollowThread, getUserFollowThreads, getFollowThreads,
};
