import axios from 'axios';
import { useQuery } from 'react-query';
import { IModel } from './model/Model';

export function getTerms() {
  return axios.get('/api/terms');
}

export function getMembers() {
  return axios.get('/api/members');
}

export function getCreditTypes() {
  return axios.get('/api/creditTypes');
}

export async function getModel(): Promise<IModel> {
  return {
    members: (await getMembers()).data,
    terms: (await getTerms()).data,
    creditTypes: (await getCreditTypes()).data,
  };
}
