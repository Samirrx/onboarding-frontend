import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as AUTH_SERVICE from '@/services/controllers/auth';

import { notify } from '../../hooks/toastUtils';

const initialState = {
  isLoading: false,
  isError: false,
  isLogin: !!localStorage.getItem('auth-token'),
  currentUser: null,
  previousRole: localStorage.getItem('user-role')
    ? JSON.parse(localStorage.getItem('user-role'))
    : null,
  previousUsername: localStorage.getItem('username') || null,
  currentTheme: 'Light',
  themeLabel: null,
  localization: '',
  localizationJson: ''
};

export const userLogin = createAsyncThunk(
  'userLogin',
  async ({ username, password, persistent, tenantid }, { rejectWithValue }) => {
    try {
      localStorage.removeItem('auth-token');

      // Store the username being used for login to verify later
      localStorage.setItem('login-attempt-username', username);

      const bodyData = {
        username: username,
        password: password,
        persistent: persistent
      };

      const data = await AUTH_SERVICE.userLogin(tenantid, bodyData);

      // Verify username consistency in response
      if (
        data.result?.auth?.email &&
        data.result.auth.email.toLowerCase() !== username.toLowerCase()
      ) {
        notify.error('Username mismatch detected. Please contact support.');
        return rejectWithValue('Username mismatch detected');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const getLoggedInUser = createAsyncThunk(
  'getLoggedInUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await AUTH_SERVICE.getLoggedInUser();
      const result = data.result;

      // Parse localization JSON if present
      result.localizationJson = result?.localizationJson
        ? JSON.parse(result?.localizationJson)
        : '';

      // Verify username consistency
      const loginAttemptUsername = localStorage.getItem(
        'login-attempt-username'
      );
      const previousUsername = localStorage.getItem('username');

      if (
        loginAttemptUsername &&
        result.email &&
        result.email.toLowerCase() !== loginAttemptUsername.toLowerCase()
      ) {
        notify.error('Username mismatch detected. Please log in again.');
        return rejectWithValue('Username mismatch');
      }

      // Save the current username and role for future verification
      localStorage.setItem('username', result.email);
      localStorage.setItem('user-role', JSON.stringify(result.role));

      // Check if role has changed from previous login
      const previousRole = getState().auth.previousRole;
      if (previousRole && previousRole.roleUUID !== result.role.roleUUID) {
        notify.warning('Your user role has changed since your last login.');
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get user data');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const res = await AUTH_SERVICE.updateProfile(data);

      if (res.statusCode === 200) {
        notify.success('Profile updated successfully');
      } else {
        notify.error(res.message || 'Operation Failed');
        return rejectWithValue(res.message || 'Operation Failed');
      }
      return res.result;
    } catch (error) {
      notify.error(error.message || 'Operation Failed');
      return rejectWithValue(error.message);
    }
  }
);

export const updateTheme = createAsyncThunk(
  'updateTheme',
  async (data, { rejectWithValue }) => {
    try {
      const res = await AUTH_SERVICE.updateTheme(data);
      notify.success('Theme updated successfully');
      return res.result;
    } catch (error) {
      notify.error(error.message || 'Theme update failed');
      return rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // Store the current username before logging out
      const currentUser = state.currentUser?.email;
      if (currentUser) {
        localStorage.setItem('previous-user', currentUser.toLowerCase());
      }

      if (localStorage.getItem('auth-token')) {
        // Keep username and role data for verification on next login
        // but remove the auth token
        localStorage.removeItem('auth-token');

        // Save the last visited URL, but attach the current username to it
        localStorage.setItem('lastVisitedURL', window.location.href);
      }

      state.currentUser = null;
      state.isLogin = false;
      window.location.href = '/login';
    },
    clearLoginAttempt: (state) => {
      localStorage.removeItem('login-attempt-username');
    }
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLogin = true;
    });
    builder.addCase(userLogin.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
      state.isLogin = false;
      localStorage.removeItem('login-attempt-username');
    });

    builder.addCase(getLoggedInUser.pending, (state) => {
      state.isLoading = true;
      // Uncomment the following block when needed:
      // localStorage.setItem(
      //   'theme',
      //   action.payload.themeLabel === 'System'
      //     ? window.matchMedia('(prefers-color-scheme: dark)').matches
      //       ? 'Dark'
      //       : 'Light'
      //     : action.payload.themeLabel
      // );

      // state.currentTheme = localStorage.getItem('theme');
    });
    builder.addCase(getLoggedInUser.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.currentUser = {
          ...action.payload,
          ...(action.payload.cloudFrontUrl
            ? {
                cloudFrontUrl: action.payload.cloudFrontUrl.endsWith('/')
                  ? action.payload.cloudFrontUrl.slice(0, -1)
                  : action.payload.cloudFrontUrl
              }
            : {})
        };
        state.themeLabel = action.payload?.themeLabel;

        // Set the current username and role for consistency checks
        state.previousUsername = action.payload.email;
        state.previousRole = action.payload.role;

        state.isLogin = true;
      }
    });

    builder.addCase(getLoggedInUser.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
      state.isLogin = false;
    });

    builder.addCase(updateTheme.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateTheme.fulfilled, (state, theme) => {
      state.isLoading = false;
      state.themeLabel = theme.payload?.themeLabel;
      // localStorage.setItem(
      //   'theme',
      //   theme.payload?.themeLabel === 'System'
      //     ? window.matchMedia('(prefers-color-scheme: dark)').matches
      //       ? 'Dark'
      //       : 'Light'
      //     : theme.payload?.themeLabel
      // );

      // state.currentTheme = localStorage.getItem('theme');
    });
    builder.addCase(updateTheme.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export const { logout, clearLoginAttempt } = authSlice.actions;

export default authSlice.reducer;
