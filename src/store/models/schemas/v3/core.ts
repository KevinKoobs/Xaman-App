/**
 * App Core Schema v3
 */

import Realm from 'realm';
import { AppConfig, NetworkConfig } from '@common/constants';

/* Schema  ==================================================================== */
const CoreSchema = {
    schema: {
        name: 'Core',
        properties: {
            initialized: { type: 'bool', default: false },
            passcode: 'string?',
            minutesAutoLock: { type: 'int', default: 1 },
            lastPasscodeFailedTimestamp: 'int?',
            passcodeFailedAttempts: { type: 'int', default: 0 },
            lastUnlockedTimestamp: 'int?',
            purgeOnBruteForce: { type: 'bool', default: false },
            biometricMethod: 'string?',
            passcodeFallback: { type: 'bool', default: false },
            language: { type: 'string', default: AppConfig.defaultLanguage },
            defaultNode: { type: 'string', default: NetworkConfig.legacy.defaultNode },
            defaultExplorer: { type: 'string', default: NetworkConfig.legacy.defaultExplorer },
            hapticFeedback: { type: 'bool', default: true },
            theme: { type: 'string', default: AppConfig.defaultTheme },
        },
    },

    migration: (oldRealm: Realm, newRealm: Realm) => {
        /*  eslint-disable-next-line */
        console.log('migrating Core schema to v3');

        const newObjects = newRealm.objects(CoreSchema.schema.name) as any;

        for (let i = 0; i < newObjects.length; i++) {
            newObjects[i].hapticFeedback = true;
            newObjects[i].defaultExplorer = NetworkConfig.legacy.defaultExplorer;
        }
    },
};

export default CoreSchema;
