/* eslint-disable implicit-arrow-linebreak */
import { clientCredentials } from '../utils/client';

const getFollowUser = () => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/followUsers`, {
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

const getSingleFollowUser = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/followUsers/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve((data)))
    .catch(reject);
});

const getUserFollowUser = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/followUsers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const followuser = Object.values(data).filter((item) => item.followingUser.id === id);
      resolve(followuser);
    })
    .catch(reject);
});

const createFollowUser = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/followUsers`, {
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
const deleteFollowUser = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/followUsers/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => resolve((data)))
    .catch(reject);
});

export {
  createFollowUser, deleteFollowUser, getSingleFollowUser, getUserFollowUser, getFollowUser,
};
