import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import NewRoleModal from '../NewRoleModal';
import rolesPermissionsReducer from '../../store/slices/rolesPermissionsSlice';
import alertReducer from '../../store/slices/alertSlice';
import authReducer from '../../store/slices/authSlice';

global.fetch = jest.fn();

const createStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      rolesPermissions: rolesPermissionsReducer,
      alert: alertReducer,
    },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        user: null,
        token: 'test-token',
        refreshToken: null,
        expiresIn: 900,
        loading: false,
        error: null,
        initialized: true,
        formData: { email: '', password: '', rememberMe: false },
      },
    },
  });

describe('NewRoleModal', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockReset();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          id: 'role-1',
          name: 'field_viewer',
          description: 'Can view field data',
        },
      }),
    });
  });

  it('New Role button opens modal when user has create_roles permission', () => {
    const onClose = jest.fn();
    render(
      <Provider store={createStore()}>
        <NewRoleModal show={true} onClose={onClose} />
      </Provider>
    );

    expect(screen.getByText('Create New Role')).toBeInTheDocument();
    expect(screen.getByLabelText(/Role Name/i)).toBeInTheDocument();
  });

  it('submitting valid form dispatches createRole and calls onSuccess', async () => {
    const onClose = jest.fn();
    const onSuccess = jest.fn();
    const store = createStore();

    render(
      <Provider store={store}>
        <NewRoleModal show={true} onClose={onClose} onSuccess={onSuccess} />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Role Name/i), {
      target: { name: 'name', value: 'field_viewer' },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { name: 'description', value: 'Can view field data' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Create Role/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/roles'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'field_viewer',
            description: 'Can view field data',
          }),
        })
      );
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('modal shows validation error for empty role name', async () => {
    const onClose = jest.fn();

    render(
      <Provider store={createStore()}>
        <NewRoleModal show={true} onClose={onClose} />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Create Role/i }));

    expect(await screen.findByText('Role name is required')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
