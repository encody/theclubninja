import React, { useState, useEffect, useContext, createContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import firebase from './firebase';

const authContext = createContext({} as IAuth);

export function ProvideAuth({ children }: { children: React.ReactNode }) {
  const auth = useProvideAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

export interface IAuth {
  user: firebase.User | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

function useProvideAuth(): IAuth {
  const [user, setUser] = useState(null as firebase.User | null);

  const signIn = async () => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    const authPersistence = firebase.auth.Auth.Persistence.LOCAL;

    await firebase.auth().setPersistence(authPersistence);

    return firebase.auth().signInWithRedirect(googleAuthProvider);
  };

  const signOut = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
      });
  };

  useEffect(
    () =>
      firebase.auth().onAuthStateChanged(user => {
        setUser(user);
      }),
    [],
  );

  return {
    user,
    signIn,
    signOut,
  };
}

export function PrivateRoute({ children, ...rest }: any) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
