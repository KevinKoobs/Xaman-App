/**
 * App Core Schema v2
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
            theme: { type: 'string', default: AppConfig.defaultTheme },
            showMemoAlert: { type: 'bool', default: true },
        },
    },

    migration: (oldRealm: Realm, newRealm: Realm) => {
        /*  eslint-disable-next-line */
        console.log('migrating Core schema to v2');

        const newObjects = newRealm.objects(CoreSchema.schema.name) as any;

        for (let i = 0; i < newObjects.length; i++) {
            newObjects[i].lastPasscodeFailedTimestamp = 0;
            newObjects[i].passcodeFailedAttempts = 0;
            newObjects[i].lastUnlockedTimestamp = 0;
            newObjects[i].purgeOnBruteForce = false;
            newObjects[i].theme = AppConfig.defaultTheme;
        }
    },
};

export default CoreSchema;
