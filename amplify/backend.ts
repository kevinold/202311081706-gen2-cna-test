import { defineBackend } from '@aws-amplify/backend';
import { BackupStack } from './BackupStack.js';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';

const backend = defineBackend({
  auth,
  data,
});

new BackupStack(backend.getStack('BackupStack'), 'Backup', { database: backend.data.resources.database })

