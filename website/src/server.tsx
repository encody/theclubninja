import axios, { AxiosResponse } from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { IModel, mostRecentTerm } from './model/Model';
import firebase from './firebase';
import { Redirect, Route } from 'react-router-dom';

const serverContext = createContext({} as IServer);

export function ProvideServer({ children }: { children: React.ReactNode }) {
  const server = useProvideServer();

  return (
    <serverContext.Provider value={server}>{children}</serverContext.Provider>
  );
}

export const useServer = () => {
  return useContext(serverContext);
};

export interface IServer {
  model: IModel;
  term: string;
  profile: {
    admin: boolean;
  } | null;
  profileId: string;
  user: firebase.User | null;
  blocking: boolean;
  nonBlocking: boolean;
  getTerms: () => Promise<AxiosResponse<IModel['terms']>>;
  getMembers: () => Promise<AxiosResponse<IModel['members']>>;
  getCreditTypes: () => Promise<AxiosResponse<IModel['creditTypes']>>;
  getChargeTypes: () => Promise<AxiosResponse<IModel['chargeTypes']>>;
  updateProfile: (
    newProfileId: string,
  ) => Promise<AxiosResponse<IServer['profile']>>;
  updateModel: () => Promise<IModel>;
  clearModel: () => void;
  clearProfile: () => void;
  setMembers: (members: IModel['members']) => Promise<boolean>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export interface IServerResponse {
  success: boolean;
}

function useProvideServer(): IServer {
  const [blocking, setBlocking] = useState(true as IServer['blocking']);
  const [nonBlocking, setNonBlocking] = useState(true as IServer['blocking']);
  const [model, setModel] = useState({
    chargeTypes: {},
    creditTypes: {},
    members: {},
    terms: {},
  } as IServer['model']);
  const [profile, setProfile] = useState(null as IServer['profile']);
  const [profileId, setProfileId] = useState('' as IServer['profileId']);
  const [term, setTerm] = useState('' as IServer['term']);
  const [user, setUser] = useState(null as IServer['user']);

  const getTerms: IServer['getTerms'] = async () => {
    setNonBlocking(true);
    const result = await axios.get('/api/terms');
    setNonBlocking(false);
    return result;
  };

  const getMembers: IServer['getMembers'] = async () => {
    setNonBlocking(true);
    const result = await axios.get('/api/members');
    setNonBlocking(false);
    return result;
  };

  const getCreditTypes: IServer['getCreditTypes'] = async () => {
    setNonBlocking(true);
    const result = await axios.get('/api/creditTypes');
    setNonBlocking(false);
    return result;
  };

  const getChargeTypes: IServer['getChargeTypes'] = async () => {
    setNonBlocking(true);
    const result = await axios.get('/api/chargeTypes');
    setNonBlocking(false);
    return result;
  };

  const updateProfile: IServer['updateProfile'] = async (
    newProfileId: string,
  ) => {
    setBlocking(true);
    const result = await axios.get('/api/profile');
    setProfile(result.data);
    setProfileId(newProfileId);
    setBlocking(false);
    return result;
  };

  const clearProfile = () => {
    setProfile(null);
    setProfileId('');
  };

  const setMembers: IServer['setMembers'] = async (
    members: IModel['members'],
  ) => {
    setNonBlocking(true);
    const result: IServerResponse = (await axios.post('/api/members', members))
      .data;
    if (result.success) {
      updateModel();
    }
    setNonBlocking(false);
    return result.success;
  };

  const updateModel = async () => {
    const model: IModel = {
      members: (await getMembers()).data,
      terms: (await getTerms()).data,
      creditTypes: (await getCreditTypes()).data,
      chargeTypes: (await getChargeTypes()).data,
    };
    setModel(model);
    const t = mostRecentTerm(model).id;
    setTerm(t);
    return model;
  };

  const clearModel = () => setModel({
    chargeTypes: {},
    creditTypes: {},
    members: {},
    terms: {},
  });

  const signIn = async () => {
    setBlocking(true);
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    const authPersistence = firebase.auth.Auth.Persistence.LOCAL;

    await firebase.auth().setPersistence(authPersistence);

    return firebase.auth().signInWithRedirect(googleAuthProvider);
  };

  const signOut = () => {
    setBlocking(true);
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
        setBlocking(false);
      });
  };

  useEffect(
    () =>
      firebase.auth().onAuthStateChanged(async newUser => {
        setBlocking(true);

        if (newUser) {
          axios.defaults.headers = {
            Authorization: 'Bearer ' + (await newUser.getIdToken()),
          };

          if (profileId !== newUser.uid) {
            updateProfile(newUser.uid);
            updateModel();
          }
        } else {
          clearProfile();
          clearModel();
        }

        setUser(newUser);
        setBlocking(false);
      }),
    [],
  );

  return {
    model,
    profile,
    profileId,
    term,
    user,
    blocking,
    nonBlocking,
    getTerms,
    getMembers,
    getCreditTypes,
    getChargeTypes,
    updateProfile,
    setMembers,
    updateModel,
    clearModel,
    clearProfile,
    signIn,
    signOut,
  };
}

export function PrivateRoute({ children, ...rest }: any) {
  let server = useServer();

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
