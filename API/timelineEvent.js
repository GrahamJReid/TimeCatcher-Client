import { clientCredentials } from '../utils/client';

const getSingleUser = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/users/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve((data)))
    .catch(reject);
});
const getOtherUsers = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const users = Object.values(data).filter((item) => item.id !== id);
      resolve(users);
    })
    .catch(reject);
});
const getSingleTimelineEvents = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/timeline-events/${id}/events-by-timeline`, {
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

export { getSingleUser, getOtherUsers, getSingleTimelineEvents };