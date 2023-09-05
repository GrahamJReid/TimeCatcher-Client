import { clientCredentials } from '../utils/client';

const getSingleCollaborativeTimelineEvents = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/collaborative-timeline-events/${id}/events-by-collaborative-timeline`, {
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
const createCollaborativeTimelineEvent = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/CollaborativeTimelineEvents`, {
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
const deleteCollaborativeTimelineEvent = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/CollaborativeTimelineEvents/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => resolve((data)))
    .catch(reject);
});
const getCollaborativeTimelineEventsByEventId = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/CollaborativeTimelineEvents`, {
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
const getCollaborativeTimelineEventsByTimelineId = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/CollaborativeTimelineEvents`, {
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
  getSingleCollaborativeTimelineEvents, createCollaborativeTimelineEvent, deleteCollaborativeTimelineEvent, getCollaborativeTimelineEventsByEventId, getCollaborativeTimelineEventsByTimelineId,
};
