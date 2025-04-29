export const userLogout = () => {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('current-user');
  localStorage.removeItem('env-type')
  window.location.replace('/login');
};
