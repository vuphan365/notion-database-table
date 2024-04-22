import { SortingState } from '@tanstack/react-table';
import axios from 'axios';

const NOTION_DATABASE_URL = `${import.meta.env.VITE_API_HOST}/database`;

interface QueryNotionDatabaseParams {
  sorts: SortingState;
  filter: string;
}
export const queryNotionDatabase = async ({
  sorts,
  filter,
}: QueryNotionDatabaseParams) => {
  let params = {};
  if (sorts?.[0]) {
    params = {
      sort: sorts?.[0]?.id,
      dir: sorts?.[0]?.desc ? 'descending' : 'ascending',
    };
  }
  if (filter) {
    params = {
      ...params,
      filter: encodeURIComponent(filter),
    };
  }
  const { data } = await axios.get(NOTION_DATABASE_URL, {
    params,
  });
  return data;
};
