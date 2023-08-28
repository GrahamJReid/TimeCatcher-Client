import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import { createEvent } from '../../API/eventData';

function WikipediaEvents() {
  useEffect(() => {
    document.title = 'TimeCatcher';
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventDate, setEventDate] = useState(null);
  const [isBCE, setIsBCE] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSearch = async () => {
    // Make a request to Wikipedia's API to search for articles
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&origin=*&list=search&srsearch=${searchQuery}&format=json`,
      );
      const data = await response.json();
      const results = data.query.search;
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching Wikipedia:', error);
    }
  };

  const handleArticleSelect = async (title) => {
    // Fetch the content of the selected article, including images
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts|pageimages&exintro&explaintext&piprop=original&titles=${title}&format=json`,
      );
      const data = await response.json();
      const { pages } = data.query;
      const selectedPageId = Object.keys(pages)[0];
      const selectedPage = pages[selectedPageId];

      // Extract relevant information, such as title, extract (description), image URL, and date
      const articleTitle = selectedPage.title;
      const articleExtract = selectedPage.extract;
      const articleImageURL = selectedPage.original.source; // Image URL
      const articleDate = new Date(); // You can add your logic to extract the date here

      // Create the payload
      const payload = {
        title: articleTitle,
        extract: articleExtract,
        imageUrl: articleImageURL,
        date: articleDate, // Add your extracted date here
      };

      // Log the payload to the console
      console.warn(payload);

      // Update the state with the payload
      setSelectedArticle(payload);
    } catch (error) {
      console.error('Error fetching article content:', error);
    }
  };

  const handleCreateEvent = async () => {
    // Construct the payload
    const payload = {
      title: selectedArticle.title,
      description: selectedArticle.extract,
      imageUrl: selectedArticle.imageUrl,
      color: '#CE9A40', // Add your default color in hex
      userId: user.id, // Replace with the actual user ID
      date: eventDate,
      BCE: isBCE,
    };

    await createEvent(payload);
    // Make an API call to create the event with the payload
    // Handle success and error cases

    // Close the modal
    setModalIsOpen(false);
    router.push('/events/MyEvents');
  };

  return (
    <>
      <h1>Wikipedia Data</h1>
      <div>
        <input
          type="text"
          placeholder="Search Wikipedia"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <ul>
        {searchResults.map((result) => (
          <li key={result.pageid}>
            {result.title}{' '}
            <Button onClick={() => handleArticleSelect(result.title)}>Select</Button>
          </li>
        ))}
      </ul>
      {selectedArticle && (
        <div>
          <h2>{selectedArticle.title}</h2>
          <p>{selectedArticle.extract}</p>
          {/* You can add logic to extract date, image, and other relevant information */}
          <Button onClick={() => setModalIsOpen(true)}>Create Event</Button>
        </div>
      )}
      <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              placeholder="Select Event Date"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="BCE"
              name="BCE"
              label="BCE"
              checked={isBCE}
              onChange={(e) => setIsBCE(e.target.checked)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateEvent}>Create Event</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default WikipediaEvents;
