/*
 * Primary file for the API
 *
 */

// Dependencies
const http = require('http');
const url = require('url');

// The server should respond to all requests with a string
const server = http.createServer((req, res) => {

  // Get request URL and parse it
  // Sets parsedURL.queryString to true as if we had sent it to the queryString module
  // (works w/url module)
  // The parsedURL object contains metadata on the user request URL
  const parsedURL = url.parse(req.url, true);
  // Get (untrimmed) path
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  // Send response
  res.end('Hello, World!\n');
  // Log request
  console.log(`Request received on path: ${trimmedPath}`);
});
// Start the server, and have it listen on port 3000
server.listen(3008, () => {
  console.log('The server is now listening on port 3008');
});
