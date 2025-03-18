import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { dependencies } from './package.json';

// Load app-level env vars to node-level env vars.
process.env = { ...process.env, ...loadEnv('production', process.cwd()) };

const REMOTE_ENTRY = process.env.VITE_REMOTE_ENTRY;
console.log('VITE_REMOTE_ENTRY', REMOTE_ENTRY);

export default defineConfig(() => ({
  server: { fs: { allow: ['.', '../shared'] } },
  build: {
    target: 'chrome89',
  },
  plugins: [
    federation({
      name: 'host',
      remotes: {
        remote: {
          type: 'module',
          name: 'remote',
          entry: REMOTE_ENTRY,
          entryGlobalName: 'remote',
          shareScope: 'default',
        },
      },
      exposes: {},
      filename: 'remoteEntry.js',
      shared: {
        react: {
          requiredVersion: dependencies.react,
          singleton: true,
        },
      },
    }),
    react(),
  ],
}));
