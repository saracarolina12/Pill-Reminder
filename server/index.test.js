const index = require('./index');

test('adds 1 + 2 to equal 3', () => {
    expect(index.toTimestamp(1)).toBe(3600000);
  });

index.app.close();  