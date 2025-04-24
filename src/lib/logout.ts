export const userLogout = () => {
  localStorage.removeItem('auth-token');
  window.location.replace('/login');
};
