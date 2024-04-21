require('dotenv').config();

import http from 'http';
import url from 'url';
import { Client, LogLevel } from '@notionhq/client';

// The dotenv library will read from your .env file into these values on `process.env`
const notionDatabaseId = process.env.NOTION_DATABASE_ID;
const notionSecret = process.env.NOTION_SECRET;

// Will provide an error to users who forget to create the .env file
// with their Notion data in it
if (!notionDatabaseId || !notionSecret) {
  throw Error('Must define NOTION_SECRET and NOTION_DATABASE_ID in env');
}

// Initializing the Notion client with your secret
const notion = new Client({
  auth: notionSecret,
  logLevel: LogLevel.ERROR,
});

const host = 'localhost';
const port = 8000;

process.on('uncaughtException', function (err) {
  console.log(err);
});

const getNotionDatabase = async (req: http.IncomingMessage) => {
  // const { sort, dir } = req.query;
  // Query the database and wait for the result
  const { sort, dir } = url.parse(req.url as string, true).query;
  const query = await notion.databases.query({
    database_id: notionDatabaseId,
    sorts: sort ? [{ property: sort as string, direction: dir as any }] : [],
  });
  return query.results;
};
// Require an async function here to support await with the DB query
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const urlData = url.parse(req.url as string, true);
  // console.log('req', req);

  switch (urlData.pathname) {
    case '/database':
      try {
        const list = await getNotionDatabase(req);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(list));
      } catch (error) {
        console.log('error', error);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(404);
        res.end(JSON.stringify([]));
      }
      break;

    default:
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Resource not found' }));
  }
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
