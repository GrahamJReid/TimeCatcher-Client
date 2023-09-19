/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Modal, Table } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import { createEvent } from '../../API/eventData';
import wikiEventsStyle from '../../styles/events/wikiEvents.module.css';

function WikipediaEvents() {
  useEffect(() => {
    document.title = 'TimeCatcher';
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [createEventModalIsOpen, setCreateEventModalIsOpen] = useState(false);
  const [eventDate, setEventDate] = useState(null);
  const [isBCE, setIsBCE] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
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
    // Fetch the content of the selected article including extract and images
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=parse&origin=*&page=${title}&format=json&prop=text|images|extracts&pageimages&exintro&explaintext&piprop=original`,
      );
      const extractresponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts|pageimages&exintro&explaintext&piprop=original&titles=${title}&format=json`,
      );
      const dataExtract = await extractresponse.json();
      const { pages } = dataExtract.query;
      const selectedPageId = Object.keys(pages)[0];
      const selectedPage = pages[selectedPageId];

      const data = await response.json();

      const articleText = data.parse.text['*'];
      const articleTitle = data.parse.title;
      const articleExtract = selectedPage.extract;

      // Remove [edit] from headings
      const cleanedText = articleText.replace(/\[edit\]/g, '');

      // Create the payload
      const payload = {
        title: articleTitle,
        content: cleanedText,
        extract: articleExtract,
        imageUrl: data.parse.images.length > 0 ? `https://en.wikipedia.org/wiki/File:${data.parse.images[0].title}` : '',
      };

      // Log the payload to the console
      console.warn(payload);

      // Update the state with the payload
      setSelectedArticle(payload);
      setSearchResults([]);
      setSearchQuery('');
      setCreateEventModalIsOpen(false);
      // setCreateEventModalIsOpen(false); // Close the create event modal
    } catch (error) {
      console.error('Error fetching article content:', error);
    }
  };

  const handleCreateEvent = async () => {
    // Extract a user-friendly description from the article.extract
    const description = selectedArticle && selectedArticle.extract ? selectedArticle.extract : '';
    console.warn('this is the extract to use as description', description);

    // Extract the first image URL from the article, if available
    const imageUrlMatch = selectedArticle.content.match(/<img[^>]+src="([^">]+)"/);
    const imageUrl = imageUrlMatch ? imageUrlMatch[1] : '';

    // Construct the payload
    const payload = {
      title: selectedArticle.title,
      description,
      imageUrl,
      color: '#CE9A40',
      userId: user.id,
      date: eventDate,
      BCE: isBCE,
      isPrivate,
    };

    await createEvent(payload);
    // Make an API call to create the event with the payload
    // Handle success and error cases

    // Close the create event modal
    setCreateEventModalIsOpen(false);
    router.push('/events/MyEvents');
  };

  return (
    <>
      <div className={wikiEventsStyle.WikiEventsContainer}>
        <h1 className={wikiEventsStyle.Title}>WikiEvents</h1>
        <div className={wikiEventsStyle.SearchBarDiv}>
          <InputGroup className="m-auto">
            <input
              type="text"
              placeholder="Search Wikipedia"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={wikiEventsStyle.SearchBar}
            />
            <Button onClick={handleSearch} className={wikiEventsStyle.SearchBarButton}>Search</Button>
          </InputGroup>
        </div>
        {selectedArticle && (
          <div>
            <h2 className={wikiEventsStyle.ArticleTitle}>{selectedArticle.title}</h2>
            <Button onClick={() => setCreateEventModalIsOpen(true)} className={wikiEventsStyle.Button}>Create Event</Button>
            <div
              onClick={(e) => e.preventDefault()} // Disable click events on the entire div
              dangerouslySetInnerHTML={{
                __html: selectedArticle.content
                  .replace(/\[edit\]/g, '')
                  .replace(/\[.*?\]/g, '')
                  .replace(/<a\b[^>]*>/g, '<span>') // Replace <a> tags with <span> to disable links
                  .replace(/<\/a>/g, '</span>'), // Replace </a> tags with </span>
              }}
            />
            {/* You can add logic to extract other information if needed */}
          </div>
        )}
      </div>
      <Modal show={createEventModalIsOpen} onHide={() => setCreateEventModalIsOpen(false)}>
        <Modal.Header closeButton className={wikiEventsStyle.ModalHeader}>
          <Modal.Title>{selectedArticle ? `Create ${selectedArticle.title} Event` : 'Create Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={wikiEventsStyle.ModalBody}>
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
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="isPrivate"
              name="isPrivate"
              label="Private"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className={wikiEventsStyle.ModalFooter}>
          <Button onClick={handleCreateEvent} className={wikiEventsStyle.Button}>Create Event</Button>
        </Modal.Footer>
      </Modal>
      <Modal
        className={wikiEventsStyle.SelectArticleTableModal}
        show={searchResults.length > 0}
        onHide={() => {
          console.warn('onHide called');
          setSearchResults([]);
          setSearchQuery('');
          setCreateEventModalIsOpen(false);
        }}
      >
        <Modal.Header closeButton className={wikiEventsStyle.ModalHeader}>
          <Modal.Title>Search Results</Modal.Title>
        </Modal.Header>
        <Modal.Body className={wikiEventsStyle.ModalBody}>
          <Table striped bordered hover className={wikiEventsStyle.SelectArticleTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result) => (
                <tr key={result.pageid}>
                  <td>{result.title}</td>
                  <td>
                    <Button onClick={() => handleArticleSelect(result.title)} className={wikiEventsStyle.Button}>Select</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default WikipediaEvents;
