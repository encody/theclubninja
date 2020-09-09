import axios from 'axios';
import { useQuery } from 'react-query';

export async function testFunction() {
  const result = await axios.get('/api/terms');
  console.log(result);
}
