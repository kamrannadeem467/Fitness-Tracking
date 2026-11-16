import { createContext, useEffect, useState } from 'react';
import API from '../api/axiosInstance';

// The context must be exported alongside its provider for consumers.
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const clearStoredSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getStoredSession = () => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!token || !storedUser) {
    if (token || storedUser) clearStoredSession();
    return { user: null, token: null };
  }

  try {
    const user = JSON.parse(storedUser);
    if (!user?._id || !['user', 'admin'].includes(user.role)) {
      clearStoredSession();
      return { user: null, token: null };
    }
    return { user, token };
  } catch {
    clearStoredSession();
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const storedSession = getStoredSession();
    return { ...storedSession, authReady: !storedSession.token };
  });

  useEffect(() => {
    if (!session.token) return undefined;
    let active = true;

    API.get('/user/profile')
      .then(({ data }) => {
        if (!active) return;
        if (!data?._id || !['user', 'admin'].includes(data.role)) {
          clearStoredSession();
          setSession({ user: null, token: null, authReady: true });
          return;
        }

        localStorage.setItem('user', JSON.stringify(data));
        setSession((current) => ({ ...current, user: data, authReady: true }));
      })
      .catch((error) => {
        if (!active) return;
        if (error.response?.status === 401) {
          clearStoredSession();
          setSession({ user: null, token: null, authReady: true });
          return;
        }

        setSession((current) => ({ ...current, authReady: true }));
      });

    return () => {
      active = false;
    };
  }, [session.token]);

  const login = (user, token) => {
    if (!user?._id || !['user', 'admin'].includes(user.role) || !token) {
      throw new Error('A valid user, role, and token are required to sign in.');
    }

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    setSession({ user, token, authReady: true });
  };

  const logout = () => {
    clearStoredSession();
    setSession({ user: null, token: null, authReady: true });
  };

  return (
    <AuthContext.Provider value={{ ...session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
