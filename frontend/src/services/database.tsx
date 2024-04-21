import { SortingState } from '@tanstack/react-table';
import axios from 'axios';

const NOTION_DATABASE_URL = `${import.meta.env.VITE_API_HOST}/database`;

interface QueryNotionDatabaseParams {
  sorts: SortingState;
}
export const queryNotionDatabase = async ({
  sorts,
}: QueryNotionDatabaseParams) => {
  let params = {};
  if (sorts?.[0]) {
    params = {
      sort: sorts?.[0]?.id,
      dir: sorts?.[0]?.desc ? 'descending' : 'ascending',
    };
  }
  const { data } = await axios.get(NOTION_DATABASE_URL, {
    params,
  });
  return data;
};
