import axios from 'axios';

const NOTION_DATABASE_URL = `${import.meta.env.VITE_API_HOST}/database`;

export const queryNotionDatabase = async () => {
  const { data } = await axios.get(NOTION_DATABASE_URL);
  return data;
};
