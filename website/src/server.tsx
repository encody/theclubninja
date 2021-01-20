import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import firebase from './firebase';
import { IModel, mostRecentTerm } from './model/Model';
import { IUserProfile } from './model/UserProfile';

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
  profile: IUserProfile | null;
  profileId: string;
  user: firebase.User | null;
  blocking: Set<string>;
  nonBlocking: Set<string>;
  getTerms: () => Promise<IModel['terms']>;
  getMembers: () => Promise<IModel['members']>;
  getCreditTypes: () => Promise<IModel['creditTypes']>;
  getChargeTypes: () => Promise<IModel['chargeTypes']>;
  getMemberTypes: () => Promise<IModel['memberTypes']>;
  getMemberships: () => Promise<IModel['memberships']>;
  getCharges: () => Promise<IModel['charges']>;
  updateProfile: (newProfileId: string) => Promise<IServer['profile']>;
  updateModel: () => Promise<IModel>;
  clearModel: () => void;
  clearProfile: () => void;
  setMembers: (
    members: IModel['members'],
    doNotUpdateModel?: boolean,
  ) => Promise<boolean>;
  setCharges: (
    charges: IModel['charges'],
    doNotUpdateModel?: boolean,
  ) => Promise<boolean>;
  setTerms: (
    terms: IModel['terms'],
    doNotUpdateModel?: boolean,
  ) => Promise<boolean>;
  setTerm: (termId: string) => void;
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
  const [model, setModel]: [
    IServer['model'],
    React.Dispatch<React.SetStateAction<IServer['model']>>,
  ] = useState({
    chargeTypes: {},
    creditTypes: {},
    memberTypes: {},
    memberships: {},
    charges: {},
    members: {},
    terms: {},
  });
  const [profile, setProfile] = useState(null as IServer['profile']);
  const [profileId, setProfileId] = useState('' as IServer['profileId']);
  const [term, setTerm] = useState('' as IServer['term']);
  const [user, setUser] = useState(null as IServer['user']);

  function nonBlockingGet(path: string): () => Promise<any> {
    return async () => {
      nonBlocking.add(path);
      setNonBlocking(new Set(nonBlocking));
      try {
        const result = await axios.get('/api/' + path);
        nonBlocking.delete(path);
        setNonBlocking(new Set(nonBlocking));
        return result.data;
      } catch (e) {
        nonBlocking.delete(path);
        setNonBlocking(new Set(nonBlocking));
        return {};
      }
    };
  }

  const getTerms = nonBlockingGet('terms');
  const getMembers = nonBlockingGet('members');
  const getCreditTypes = nonBlockingGet('creditTypes');
  const getChargeTypes = nonBlockingGet('chargeTypes');
  const getMemberTypes = nonBlockingGet('memberTypes');
  const getMemberships = nonBlockingGet('memberships');
  const getCharges = nonBlockingGet('charges');

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
    return result.data;
  };

  const clearProfile = () => {
    setProfile(null);
    setProfileId('');
  };

  const setMembers: IServer['setMembers'] = async (
    members: IModel['members'],
    doNotUpdateModel?: boolean,
  ) => {
    nonBlocking.add('setMembers');
    setNonBlocking(new Set(nonBlocking));

    const result: IServerResponse = (await axios.post('/api/members', members))
      .data;
    if (result.success && !doNotUpdateModel) {
      updateModel();
    }

    nonBlocking.delete('setMembers');
    setNonBlocking(new Set(nonBlocking));
    return result.success;
  };

  const setCharges: IServer['setCharges'] = async (
    charges: IModel['charges'],
    doNotUpdateModel?: boolean,
  ) => {
    nonBlocking.add('setCharges');
    setNonBlocking(new Set(nonBlocking));

    const result: IServerResponse = (await axios.post('/api/charges', charges))
      .data;
    if (result.success && !doNotUpdateModel) {
      updateModel();
    }

    nonBlocking.delete('setCharges');
    setNonBlocking(new Set(nonBlocking));
    return result.success;
  };

  const setTerms: IServer['setTerms'] = async (
    terms: IModel['terms'],
    doNotUpdateModel?: boolean,
  ) => {
    nonBlocking.add('setTerms');
    setNonBlocking(new Set(nonBlocking));

    const result: IServerResponse = (await axios.post('/api/terms', terms))
      .data;
    if (result.success && !doNotUpdateModel) {
      updateModel();
    }

    nonBlocking.delete('setTerms');
    setNonBlocking(new Set(nonBlocking));
    return result.success;
  };

  const updateModel = async () => {
    nonBlocking.add('updateModel');
    setNonBlocking(new Set(nonBlocking));

    const model: IModel = {
      members: await getMembers(),
      terms: await getTerms(),
      creditTypes: await getCreditTypes(),
      chargeTypes: await getChargeTypes(),
      memberTypes: await getMemberTypes(),
      memberships: await getMemberships(),
      charges: await getCharges(),
    };
    const t = mostRecentTerm(model.terms).id;
    setTerm(t);
    setModel(model);

    nonBlocking.delete('updateModel');
    setNonBlocking(new Set(nonBlocking));
    return model;
  };

  const clearModel = () =>
    setModel({
      chargeTypes: {},
      creditTypes: {},
      memberTypes: {},
      memberships: {},
      charges: {},
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
    // eslint-disable-next-line
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
    getMemberTypes,
    getMemberships,
    getCharges,
    updateProfile,
    setMembers,
    setCharges,
    setTerms,
    setTerm,
    updateModel,
    clearModel,
    clearProfile,
    signIn,
    signOut,
  };
}

interface PrivateRouteProps extends RouteProps {}

export function PrivateRoute({ children, ...rest }: PrivateRouteProps) {
  let server = useServer();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        server.blocking.size > 0 ? (
          <></>
        ) : server.profile ? (
          children
        ) : server.user ? (
          <p>You do not have permission to access this resource.</p>
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
