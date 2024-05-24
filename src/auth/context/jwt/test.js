import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo, useState } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios';
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [authError, setAuthError] = useState(''); 


// Modify the initialize function to always check for stored user data
const initialize = useCallback(async () => {
  try {
    const accessToken = localStorage.getItem(STORAGE_KEY); 
    const getUser = localStorage.getItem('user'); 

    const user = JSON.parse(getUser);
    const isEmptyUser = JSON.stringify(user) === '{}';

    const accessTokenSession = sessionStorage.getItem(STORAGE_KEY);
    const getUserSession = sessionStorage.getItem('user');
    const userSession = JSON.parse(getUserSession);
    const isEmptyUserSession = JSON.stringify(userSession) === '{}';

    if (accessToken && isValidToken(accessToken) && user && !isEmptyUser) {
      setSession(accessToken, user.token_lifespan_in_minutes, user);

      dispatch({
        type: 'INITIAL',
        payload: {
          user: {
            ...user,
            accessToken,
          },
        },
      });
    } else if (accessTokenSession && isValidToken(accessTokenSession) && userSession && !isEmptyUserSession) {
      setSession(accessTokenSession, userSession.token_lifespan_in_minutes, userSession);

      dispatch({
        type: 'INITIAL',
        payload: {
          user: {
            ...userSession,
            accessToken: accessTokenSession,
          },
        },
      });
    } else {
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  } catch (error) {
    console.error(error);
    dispatch({
      type: 'INITIAL',
      payload: {
        user: null,
      },
    });
  }
}, []);


  useEffect(() => {
    console.log(authError);
    initialize();
  }, [initialize,authError]);

  const login = useCallback(async (mobile, password, country, rememberMe) => {
    try {
      const data = {
        mobile,
        password,
        country,
      };
  
      const response = await axios.post(endpoints.auth.login, data);
  
      const user = response.data.data;
      const accessToken = user.token;
      delete user.token;
  
      if (user.email_verified !== 1 || user.mobile_verified !== 1) {
        throw new Error('Your email or mobile number is not verified.');
      }
  
      // Set session
      localStorage.setItem(STORAGE_KEY, accessToken);
      localStorage.setItem('user', JSON.stringify(user));  
      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            ...user,
            accessToken,
          },
        },
      });
  
      // Store data in localStorage if Remember Me is selected
      // sessionStorage.setItem(STORAGE_KEY, accessToken);
      // sessionStorage.setItem('user', JSON.stringify(user));

      // if (!rememberMe) {
       
  
      //   // Remove from localStorage on page close
      //   window.addEventListener('beforeunload', () => {
      //     setSession(null); 
      //     localStorage.removeItem(STORAGE_KEY);
      //     localStorage.removeItem('user');
      //   });
      // }
    } catch (error) {
      if (error) {
        setAuthError("Your mobile number or password is invalid");
      }
      console.error(error?.message);
    }
  }, []);
  
  
  

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    const response = await axios.post(endpoints.auth.register, data);

    const { accessToken, user } = response.data;

    localStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY); // Remove token from local storage
    localStorage.removeItem('user'); // Remove user data from local storage

    setSession(null); // Clear session

    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
      authError, // Pass authError down as a prop
    }),
    [login, logout, register, state.user, status, authError]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
