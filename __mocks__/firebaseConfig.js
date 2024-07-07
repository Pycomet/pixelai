/* eslint-disable no-undef */
export const getAuth = jest.fn(() => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));

export const getFirestore = jest.fn(() => ({
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      set: jest.fn(),
      get: jest.fn(),
    })),
  })),
}));

export const initializeApp = jest.fn();
