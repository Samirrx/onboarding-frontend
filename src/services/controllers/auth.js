import axios from 'axios';
import makeHttpCall from '../../utils/axios';

export const userLogin = async (tenantid, data) => {
  try {
    const response = await makeHttpCall({
      method: 'POST',
      url: '/user/login',
      data: data,
      headers: { 'X-TenantID': tenantid, username: data?.username }
    });

    // Handle two-factor authentication
    if (response?.result?.auth?.isTwoFactorAuthentication) {
      const username = response?.result?.auth?.email;
      window.location.href = `/login?twostep=${username}&t=${response?.result?.tenantId}`;
      return response;
    }

    if (response.status) {
      // Check username consistency
      const loginUsername = data.username.toLowerCase();
      const responseUsername = response?.result?.auth?.email?.toLowerCase();

      if (responseUsername && loginUsername !== responseUsername) {
        console.error('Username mismatch detected in login response');
        alert(
          'Security alert: Username mismatch detected. Please contact support.'
        );
        return { status: false, message: 'Username mismatch detected' };
      }

      // Store auth token
      localStorage.setItem(
        'auth-token',
        JSON.stringify(response.result.tokenDetail)
      );

      // Store tenant ID
      localStorage.setItem('tenantid', response?.result?.tenantId);

      // Store the current username
      localStorage.setItem('current-user', loginUsername);

      // Handle theme
      const themeMode = response?.result?.auth?.theme;
      const themes = ['default', 'forest', 'ruby', 'solar', 'ocean'];
      document.documentElement.className = themes[themeMode - 1] || 'default';
      localStorage.setItem('mode', themeMode);

      // Check if this is a different user than the previous session
      const previousUser = localStorage.getItem('previous-user');
      let shouldNavigateToLastVisited = true;

      if (previousUser && previousUser !== loginUsername) {
        // Reset last visited URL for different users
        shouldNavigateToLastVisited = false;
        // Store new user as previous for next login
        localStorage.setItem('previous-user', loginUsername);
      } else if (!previousUser) {
        // First login, store this username
        localStorage.setItem('previous-user', loginUsername);
      }

      // Check previous role data if available
      const previousRoleData = localStorage.getItem('user-role');
      if (previousRoleData) {
        try {
          const previousRole = JSON.parse(previousRoleData);
          const currentRole = response?.result?.auth?.role;

          if (
            previousRole &&
            currentRole &&
            previousRole.roleUUID !== currentRole.roleUUID
          ) {
            shouldNavigateToLastVisited = false;
            console.warn('User role has changed since last login');
          }
        } catch (e) {
          console.error('Error comparing role data:', e);
        }
      }

      // Save current role data
      if (response?.result?.auth?.role) {
        localStorage.setItem(
          'user-role',
          JSON.stringify(response.result.auth.role)
        );
      }

      // Handle redirect
      const redirectIndex = window.location.search.indexOf('redirect=');
      let redirectURL = null;

      if (redirectIndex !== -1) {
        redirectURL = decodeURIComponent(
          window.location.search.substring(redirectIndex + 9)
        ); // 'redirect='.length = 9
      }

      // Get last visited URL, but only use it if we're the same user or if there's a redirect parameter
      let targetUrl = '/'; // Default to home

      if (redirectURL) {
        // Explicit redirect takes precedence
        targetUrl = redirectURL.startsWith('/')
          ? `${window.location.origin}${redirectURL}`
          : redirectURL;
      } else if (shouldNavigateToLastVisited) {
        // Only use lastVisited if same user and no explicit redirect
        const lastVisitedUrl = localStorage.getItem('lastVisitedURL');
        if (lastVisitedUrl) {
          targetUrl = lastVisitedUrl;
        }
      }

      window.location.href = targetUrl;

      // Handle persistent login
      if (data?.persistent !== undefined && data?.persistent) {
        localStorage.setItem('persistent', btoa(JSON.stringify(data)));
      } else {
        localStorage.removeItem('persistent');
      }

      return response.result.tokenDetail;
    } else {
      if (response?.status === false) {
        // alert(response?.message);
      }
      return response;
    }
  } catch (error) {
    console.error('Login error:', error);
    // alert('Error during login. Please try again.');
    return {
      status: false,
      message: error?.msg?.message || 'Incorrect username or password.'
    };
  }
};
