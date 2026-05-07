export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

export function getCurrentUser() {
  const raw = localStorage.getItem('xapityUser');
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('xapityUser');
  window.location.href = '/login';
}