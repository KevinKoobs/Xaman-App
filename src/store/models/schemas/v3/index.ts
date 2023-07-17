import { schemas as v2Schemas } from '@store/models/schemas/v2';

// ~ MODIFIED
import CoreSchema from '@store/models/schemas/v3/core';

// = NOT CHANGED
const { ContactSchema, CounterPartySchema, CurrencySchema, TrustLineSchema, ProfileSchema, AccountSchema } = v2Schemas;

/* Exports ==================================================================== */
export const schemaVersion = 3;
export const migration = (oldRealm: Realm, newRealm: Realm) => {
    CoreSchema.migration(oldRealm, newRealm);
};
export const schemas = {
    CounterPartySchema,
    CurrencySchema,
    ProfileSchema,
    TrustLineSchema,
    ContactSchema,
    AccountSchema,
    CoreSchema,
};
