import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import firebase from './firebase';
import { useServer } from './server';

const authContext = createContext({} as IAuth);

function ProvideAuth({ children }: { children: React.ReactNode }) {
  const auth = useProvideAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

const useAuth = () => {
  return useContext(authContext);
};

interface IAuth {
  user: firebase.User | null;
  processing: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

function useProvideAuth(): IAuth {
  const [user, setUser] = useState(null as IAuth['user']);
  const [processing, setProcessing] = useState(false as IAuth['processing']);
  const server = useServer();

  const signIn = async () => {
    setProcessing(true);
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    const authPersistence = firebase.auth.Auth.Persistence.LOCAL;

    await firebase.auth().setPersistence(authPersistence);
    console.log('Signing in...');

    return firebase.auth().signInWithRedirect(googleAuthProvider);
  };

  const signOut = () => {
    setProcessing(true);
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
        setProcessing(false);
      });
  };

  useEffect(
    () =>
      firebase.auth().onAuthStateChanged(async newUser => {
        setProcessing(true);

        console.log('Auth State Changed');

        if (newUser) {
          axios.defaults.headers = {
            Authorization: 'Bearer ' + (await newUser.getIdToken()),
          };
          
          if (!server.model) {}
        }

        setUser(newUser);
        setProcessing(false);
      }),
    [],
  );

  return {
    user,
    processing,
    signIn,
    signOut,
  };
}

function PrivateRoute({ children, ...rest }: any) {
  let server = useServer();
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        server.profile && server.profile.admin ? (
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
