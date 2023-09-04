/* eslint-disable implicit-arrow-linebreak */
import { clientCredentials } from '../utils/client';

const getUserCollaborativeTimelines = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/CollaborativeTimelines`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const userTimelines = Object.values(data).filter((item) => item.user1.id === id || item.user2.id === id);
      resolve(userTimelines);
    })
    .catch(reject);
});
const getUserCollaborativeTimelinesWithSearch = (id, searchQuery) => new Promise((resolve, reject) => {
  // Create a query parameter for the search
  const queryParams = searchQuery ? `?search=${searchQuery}` : '';

  fetch(`${clientCredentials.databaseURL}/CollaborativeTimelines${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Filter events based on the user_id and searchQuery
      let userTimelines = Object.values(data).filter((item) => item.user1.id === id || item.user2.id === id);

      // You can add additional filtering logic here if needed based on searchQuery
      if (searchQuery) {
        userTimelines = userTimelines.filter((timeline) =>
          timeline.title.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      resolve(userTimelines);
    })
    .catch(reject);
});

const getSingleCollaborativeTimeline = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/CollaborativeTimelines/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve((data)))
    .catch(reject);
});

const deleteCollaborativeTimeline = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/CollaborativeTimelines/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => resolve((data)))
    .catch(reject);
});
const updateCollaborativeTimeline = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/CollaborativeTimelines/${payload.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(resolve)
    .catch(reject);
});
const createCollaborativeTimeline = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/CollaborativeTimelines`, {
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
  deleteCollaborativeTimeline, getSingleCollaborativeTimeline, updateCollaborativeTimeline, createCollaborativeTimeline, getUserCollaborativeTimelinesWithSearch, getUserCollaborativeTimelines,
};
