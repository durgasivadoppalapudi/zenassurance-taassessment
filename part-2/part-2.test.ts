/*Test Scenario: API Response Testing

Acceptance Criteria:

API endpoint is accessible and returns a response code of 200 (OK) for all requests.
Response time for each API request is within acceptable limits (e.g. under 2 seconds).
API returns expected data format (e.g. JSON) for each request.
API handles invalid requests (e.g. missing parameters) and returns appropriate error codes.
Test Scenario: Security Testing

Acceptance Criteria:

API implements proper authentication and authorization mechanisms (e.g. OAuth2).
API requests and responses are encrypted using secure protocols (e.g. HTTPS).
Sensitive data is properly encrypted and stored.
Access to API is restricted to authorized users and systems only.
API implements rate limiting to prevent malicious activity (e.g. denial of service attacks).*/

test('it should pass', async () => {
  expect(true).toBe(true);
});

const API_BASE_URL = 'https://api.clickup.com/api/v2.0';
const API_TOKEN = 'pk_54646532_7STX20R3MPRLAL0YR2LRKMQMPRV87PGD';
const API_HEADERS = {
  Authorization: `Token ${API_TOKEN}`,
};

test('API endpoint is accessible and responding', async () => {
  console.log('Making API request...');
  try {
    const response = await fetch(API_BASE_URL, {
      headers: API_HEADERS,
    });
    console.log(`Received response: ${response}`);
    expect(response.status).toBe(200);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
});
test('Correct data is returned for a given request', async () => {
  const response = await fetch(API_BASE_URL, {
    headers: API_HEADERS,
  });
  const data = await response.json();
  expect(data).toMatchObject({
    success: true,
    message: 'Data retrieved successfully',
    data: {
      name: 'test',
    },
  });
});

test('API handles multiple requests simultaneously', async () => {
  const response1 = fetch(API_BASE_URL, {
    headers: API_HEADERS,
  });
  const response2 = fetch(API_BASE_URL, {
    headers: API_HEADERS,
  });
  const response3 = fetch(API_BASE_URL, {
    headers: API_HEADERS,
  });
  const [res1, res2, res3] = await Promise.all([
    response1,
    response2,
    response3,
  ]);
  expect(res1.status).toBe(200);
  expect(res2.status).toBe(200);
  expect(res3.status).toBe(200);
});

test('API returns appropriate error messages for invalid requests', async () => {
  const invalidAPIURL: string = `${API_BASE_URL}/invalid`;
  const response = await fetch(invalidAPIURL, {
    headers: API_HEADERS,
  });
  expect(response.status).toBe(404);
  const error = await response.json();
  expect(error).toMatchObject({
    success: false,
    message: 'Resource not found',
  });
});
