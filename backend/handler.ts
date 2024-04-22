import { server } from './src/server';
import ServerlessHttp from 'serverless-http';

export const main = ServerlessHttp(server as any);
