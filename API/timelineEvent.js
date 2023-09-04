import { clientCredentials } from '../utils/client';

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
const createTimelineEvent = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/timelineEvents`, {
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
const deleteTimelineEvent = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/timelineEvents/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => resolve((data)))
    .catch(reject);
});
const getTimelineEventsByEventId = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/timelineEvents`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const usersproducts = Object.values(data).filter((item) => item.event_id.id === id);
      resolve(usersproducts);
    })
    .catch(reject);
});
const getTimelineEventsByTimelineId = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/timelineEvents`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const usersproducts = Object.values(data).filter((item) => item.timeline_id.id === id);
      resolve(usersproducts);
    })
    .catch(reject);
});

export {
  getSingleTimelineEvents, createTimelineEvent, deleteTimelineEvent, getTimelineEventsByEventId, getTimelineEventsByTimelineId,
};
