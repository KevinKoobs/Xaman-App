import { get, isUndefined } from 'lodash';

import BaseTransaction from './base';

/* Types ==================================================================== */
import { TransactionJSONType, TransactionTypes } from '../types';

/* Class ==================================================================== */
class SetRegularKey extends BaseTransaction {
    public static Type = TransactionTypes.SetRegularKey as const;
    public readonly Type = SetRegularKey.Type;

    constructor(tx?: TransactionJSONType, meta?: any) {
        super(tx, meta);

        // set transaction type if not set
        if (isUndefined(this.TransactionType)) {
            this.TransactionType = SetRegularKey.Type;
        }

        this.fields = this.fields.concat(['RegularKey']);
    }

    get RegularKey(): string {
        return get(this, ['tx', 'RegularKey']);
    }
}

/* Export ==================================================================== */
export default SetRegularKey;
