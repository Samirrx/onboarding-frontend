export const userLogout = () => {
  localStorage.clear();
  window.location.replace('/login');
};
