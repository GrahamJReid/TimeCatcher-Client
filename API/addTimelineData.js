import { clientCredentials } from '../utils/client';

const addTimeline = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/api/create_timeline_and_events`, {
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
export default addTimeline;
