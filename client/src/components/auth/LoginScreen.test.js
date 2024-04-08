import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom'; // MemoryRouter is used for testing instead of BrowserRouter
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import LoginScreen from './LoginScreen'; // adjust the import path as necessary
import * as authActions from '../../actions/auth'; // adjust the import path as necessary
import * as uiActions from '../../actions/ui'; // adjust the import path as necessary

// Creating a mock store for the Redux state
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('LoginScreen', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      ui: { msgError: null }
    });
    // Mock the Redux actions used in the component
    jest.spyOn(authActions, 'startLogin').mockImplementation(() => () => {});
    jest.spyOn(uiActions, 'setError').mockImplementation(() => () => {});
    jest.spyOn(uiActions, 'removeError').mockImplementation(() => () => {});
  });

  const setup = () => render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>
    </Provider>
  );

  test('should render the login form correctly', () => {
    setup();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  test('should display error message when there is a msgError', () => {
    store = mockStore({
      ui: { msgError: 'Invalid credentials' }
    });
    setup();
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  test('should update input values on change', () => {
    setup();
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  test('should call startLogin when form is submitted with valid data', () => {
    setup();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(authActions.startLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  test('should dispatch setError when form is submitted with invalid data', () => {
    setup();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'bademail' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(uiActions.setError).toHaveBeenCalled();
    expect(authActions.startLogin).not.toHaveBeenCalled();
  });
});
