const index = require('./index');

// TODO: Static test; revealed secrot
// TODO: test
test('Converts hours to unix time (miliseconds)', () => {
  expect(index.toTimestamp(1)).toBe(3600000);
});
// TODO: test and add to defectos encontrados: not all scenarios were handled
// TODO: test
// TODO: Static test; revealed secrot
// TODO: test
// TODO: test w empty 
// TODO: Static test; revealed secrot
// TODO: Static test; revealed secrot
// TODO: Static test; revealed secrot
// TODO: test w empty 
// TODO: test w empty 
// TODO: test w empty 
// TODO: test w empty 

index.server.close();  