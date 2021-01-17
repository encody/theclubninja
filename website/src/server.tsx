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
  blocking: Set<string>;
  nonBlocking: Set<string>;
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
  const [blocking, setBlocking] = useState(
    new Set(['auth']) as IServer['blocking'],
  );
  const [nonBlocking, setNonBlocking] = useState(
    new Set() as IServer['blocking'],
  );
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
    nonBlocking.add('getTerms');
    setNonBlocking(new Set(nonBlocking));
    const result = await axios.get('/api/terms');
    nonBlocking.delete('getTerms');
    setNonBlocking(new Set(nonBlocking));
    return result;
  };

  const getMembers: IServer['getMembers'] = async () => {
    nonBlocking.add('getMembers');
    setNonBlocking(new Set(nonBlocking));
    const result = await axios.get('/api/members');
    nonBlocking.delete('getMembers');
    setNonBlocking(new Set(nonBlocking));
    return result;
  };

  const getCreditTypes: IServer['getCreditTypes'] = async () => {
    nonBlocking.add('getCreditTypes');
    setNonBlocking(new Set(nonBlocking));
    const result = await axios.get('/api/creditTypes');
    nonBlocking.delete('getCreditTypes');
    setNonBlocking(new Set(nonBlocking));
    return result;
  };

  const getChargeTypes: IServer['getChargeTypes'] = async () => {
    nonBlocking.add('getChargeTypes');
    setNonBlocking(new Set(nonBlocking));
    const result = await axios.get('/api/chargeTypes');
    nonBlocking.delete('getChargeTypes');
    setNonBlocking(new Set(nonBlocking));
    return result;
  };

  const updateProfile: IServer['updateProfile'] = async (
    newProfileId: string,
  ) => {
    blocking.add('updateProfile');
    setBlocking(new Set(blocking));

    const result = await axios.get('/api/profile');
    setProfile(result.data);
    setProfileId(newProfileId);

    blocking.delete('updateProfile');
    setBlocking(new Set(blocking));
    return result;
  };

  const clearProfile = () => {
    setProfile(null);
    setProfileId('');
  };

  const setMembers: IServer['setMembers'] = async (
    members: IModel['members'],
  ) => {
    nonBlocking.add('setMembers');
    setNonBlocking(new Set(nonBlocking));

    const result: IServerResponse = (await axios.post('/api/members', members))
      .data;
    if (result.success) {
      updateModel();
    }

    nonBlocking.delete('setMembers');
    setNonBlocking(new Set(nonBlocking));
    return result.success;
  };

  const updateModel = async () => {
    nonBlocking.add('updateModel');
    setNonBlocking(new Set(nonBlocking));

    const model: IModel = {
      members: (await getMembers()).data,
      terms: (await getTerms()).data,
      creditTypes: (await getCreditTypes()).data,
      chargeTypes: (await getChargeTypes()).data,
    };
    setModel(model);
    const t = mostRecentTerm(model).id;
    setTerm(t);

    nonBlocking.delete('updateModel');
    setNonBlocking(new Set(nonBlocking));
    return model;
  };

  const clearModel = () =>
    setModel({
      chargeTypes: {},
      creditTypes: {},
      members: {},
      terms: {},
    });

  const signIn = async () => {
    blocking.add('signIn');
    setBlocking(new Set(blocking));

    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    const authPersistence = firebase.auth.Auth.Persistence.LOCAL;

    await firebase.auth().setPersistence(authPersistence);

    return firebase.auth().signInWithRedirect(googleAuthProvider);
  };

  const signOut = () => {
    blocking.add('signOut');
    setBlocking(new Set(blocking));
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
        blocking.delete('signOut');
        setBlocking(new Set(blocking));
      });
  };

  useEffect(
    () =>
      firebase.auth().onAuthStateChanged(async newUser => {
        blocking.add('auth');
        setBlocking(new Set(blocking));

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
        blocking.delete('auth');
        setBlocking(new Set(blocking));
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
        server.blocking.size > 0 ? (
          <></>
        ) : server.profile && server.profile.admin ? (
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
