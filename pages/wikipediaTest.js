/* eslint-disable no-restricted-globals */
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

function Wikipedia() {
  useEffect(() => {
    document.title = 'TimeCatcher';
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

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

  console.warn('selected Article', selectedArticle);
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
        </div>
      )}
    </>
  );
}

export default Wikipedia;
