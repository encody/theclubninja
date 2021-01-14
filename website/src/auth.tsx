import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import firebase from './firebase';
import { getProfile } from './server';

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
  profile: {
    admin: boolean;
  } | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

function useProvideAuth(): IAuth {
  const [user, setUser] = useState(null as IAuth['user']);
  const [profile, setProfile] = useState(null as IAuth['profile']);

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
        setProfile(null);
      });
  };

  useEffect(
    () =>
      firebase.auth().onAuthStateChanged(async user => {
        if (user) {
          axios.defaults.headers = {
            Authorization: 'Bearer ' + (await user.getIdToken()),
          };

          setProfile((await getProfile()).data);
        } else {
          setProfile(null);
        }

        setUser(user);
      }),
    [],
  );

  return {
    user,
    profile,
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
        auth.profile && auth.profile.admin ? (
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
