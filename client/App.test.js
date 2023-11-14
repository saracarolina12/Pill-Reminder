const axios = require('axios');
import { URL } from './util/configurations.js';

test('Request time should be less than 3000 ms', async () => {
  const startTime = performance.now();
  await axios.get(URL);
  const endTime = performance.now();
  const requestTime = endTime - startTime;
  expect(requestTime).toBeLessThan(3000);
});