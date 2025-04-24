export const userLogout = () => {
    localStorage.removeItem('auth-token');
    sessionStorage.clear(); 
    window.location.replace('/login'); 
  };
  