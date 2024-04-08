import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import RegisterScreen from './RegisterScreen';
import * as authActions from '../../actions/auth';
import * as uiActions from '../../actions/ui';

// Setting up Redux store for testing
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('RegisterScreen', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      ui: { msgError: null }
    });

    jest.spyOn(authActions, 'startRegister').mockImplementation(() => () => {});
    jest.spyOn(uiActions, 'setError').mockImplementation(() => () => {});
    jest.spyOn(uiActions, 'removeError').mockImplementation(() => () => {});
  });

  const setup = () => render(
    <Provider store={store}>
      <Router>
        <RegisterScreen />
      </Router>
    </Provider>
  );

  test('creating a user with a weak password should fail', () => {
    setup();
    const validName = 'John';
    const validEmail = 'john@example.com';
    const weakPassword = 'weak';
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: validName } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: validEmail } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: weakPassword } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: weakPassword } });
    fireEvent.submit(screen.getByText('Register'));
    expect(uiActions.setError).toHaveBeenCalledWith("Password should be 8-32 characters long and include at least 1 number, 1 symbol, 1 lowercase, and 1 uppercase letter");
    expect(authActions.startRegister).not.toHaveBeenCalled();
  });

  test('creating a user with an invalid email address should fail', () => {
    setup();
    const validName = 'John';
    const invalidEmail = 'bademail';
    const validPassword = 'Password123!';
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: validName } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: invalidEmail } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: validPassword } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: validPassword } });
    fireEvent.submit(screen.getByText('Register'));
    expect(uiActions.setError).toHaveBeenCalledWith("Email is not valid");
    expect(authActions.startRegister).not.toHaveBeenCalled();
  });

  test('creating a user with a name too long should fail', () => {
    setup();
    const longName = 'ThisNameIsWayTooLongToBeConsideredValid';
    const validEmail = 'john@example.com';
    const validPassword = 'Password123!';
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: longName } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: validEmail } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: validPassword } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: validPassword } });
    fireEvent.submit(screen.getByText('Register'));
    expect(uiActions.setError).toHaveBeenCalledWith("Name length must be max 32 characters");
    expect(authActions.startRegister).not.toHaveBeenCalled();
  });
  test('creating a user with an invalid emails address should fail', () => {
    setup();
    const validName = 'John';
    const invalidEmail = 'bademail';
    const validPassword = 'Password123!';
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: validName } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: invalidEmail } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: validPassword } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: validPassword } });
    fireEvent.submit(screen.getByText('Register'));
    expect(uiActions.setError).toHaveBeenCalledWith("Email is not valid");
    expect(authActions.startRegister).not.toHaveBeenCalled();
  });
  test('Create user', () => {
    setup();
    const validName = 'John';
    const invalidEmail = 'bademail';
    const validPassword = 'Password123!';
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: validName } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: invalidEmail } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: validPassword } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: validPassword } });
    fireEvent.submit(screen.getByText('Register'));
    expect(authActions.startRegister).not.toHaveBeenCalled();
  });
  test('Create user successfully', () => {
    setup();
    const validName = 'John';
    const validEmail = 'john@example.com';
    const validPassword = 'Password123!';
    const validFamilyName = 'Doe';
    const validRoleInFamily = 'parent';
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: validName } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: validEmail } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: validPassword } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: validPassword } });
    fireEvent.change(screen.getByLabelText('Family Name'), { target: { value: validFamilyName } });
    fireEvent.change(screen.getByLabelText('Role in Family'), { target: { value: validRoleInFamily } });
    fireEvent.submit(screen.getByText('Register'));
    expect(uiActions.setError).not.toHaveBeenCalled();
    expect(uiActions.removeError).toHaveBeenCalled();
    expect(authActions.startRegister).toHaveBeenCalledWith(validName, validEmail, validPassword, validFamilyName, validRoleInFamily, '');
  });
  test('Create user2', () => {
    setup();
    const validName = 'don';
    const invalidEmail = 'bademail';
    const validPassword = 'Password123!';
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: validName } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: invalidEmail } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: validPassword } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: validPassword } });
    fireEvent.submit(screen.getByText('Register'));
    expect(authActions.startRegister).not.toHaveBeenCalled();
  });
  test('Create user3', () => {
    setup();
    const validName = 'dor';
    const invalidEmail = 'mail@';
    const validPassword = 'Password123!';
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: validName } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: invalidEmail } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: validPassword } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: validPassword } });
    fireEvent.submit(screen.getByText('Register'));
    expect(authActions.startRegister).not.toHaveBeenCalled();
  });
  test('Create user4', () => {
    setup();
    const validName = 'hadas';
    const invalidEmail = 'hadas@gmail.kcom';
    const validPassword = 'Pass';
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: validName } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: invalidEmail } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: validPassword } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: validPassword } });
    fireEvent.submit(screen.getByText('Register'));
    expect(authActions.startRegister).not.toHaveBeenCalled();
  });
  test('Create user5', () => {
    setup();
    const validName = 'shoam';
    const invalidEmail = 's@gmail.kcom';
    const validPassword = 'Pass';
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: validName } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: invalidEmail } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: validPassword } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: validPassword } });
    fireEvent.submit(screen.getByText('Register'));
    expect(authActions.startRegister).not.toHaveBeenCalled();
  });
});
