/* eslint-env jest */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(() => Promise.resolve({didCancel: true})),
  launchImageLibrary: jest.fn(() => Promise.resolve({didCancel: true})),
}));
