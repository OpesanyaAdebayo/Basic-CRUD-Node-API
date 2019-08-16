import { MONGODB_URI, TOKEN_SECRET } from '../../src/util/secrets';

const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('process exited'); } );
test('process should crash if secrets are undefined', () => {
  if (!MONGODB_URI || !TOKEN_SECRET) {
    expect(mockExit).toHaveBeenCalledWith(1);
  }
  mockExit.mockRestore();
});
