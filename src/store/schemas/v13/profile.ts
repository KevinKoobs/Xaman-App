import Realm from 'realm';

/**
 * XUMM Profile Model
 */
class Profile extends Realm.Object {
    public static schema: Realm.ObjectSchema = {
        name: 'Profile',
        properties: {
            username: 'string?', //  username
            slug: 'string?', // slug
            uuid: 'string?', // uuid
            deviceUUID: 'string?', // device uuid
            signedTOSVersion: 'int?', // last signed agreement version
            signedTOSDate: 'date?', // signed agreement date
            accessToken: 'string?', // API access token
            refreshToken: 'string?', // API refresh token
            bearerHash: 'string?', // API  bearer hash
            idempotency: { type: 'int', default: 0 }, // API calls idempotency
            hasPro: { type: 'bool', default: false }, // indicates if use have XUMM pro
            registerAt: { type: 'date', default: new Date() },
            lastSync: { type: 'date', default: new Date() },
        },
    };

    public username: string;
    public slug: string;
    public uuid: string;
    public deviceUUID: string;
    public signedTOSVersion: number;
    public signedTOSDate: Date;
    public accessToken: string;
    public refreshToken: string;
    public bearerHash: string;
    public idempotency: number;
    public registerAt?: Date;
    public lastSync?: Date;
    public hasPro?: boolean;

    public static migration(oldRealm: any, newRealm: any) {
        /*  eslint-disable-next-line */
        console.log('migrating Profile model to 13');

        const newObjects = newRealm.objects('Profile') as Profile[];

        for (let i = 0; i < newObjects.length; i++) {
            newObjects[i].refreshToken = undefined;
            newObjects[i].bearerHash = undefined;
        }
    }
}

export default Profile;
