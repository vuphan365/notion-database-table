/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API_HOST: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
