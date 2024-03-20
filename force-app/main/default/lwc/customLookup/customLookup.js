import { LightningElement, api, wire } from 'lwc';
import getFilteredAccounts from '@salesforce/apex/AccountController.getFilteredAccounts';

export default class CustomLookup extends LightningElement {
    @api filter;

    handleAccountChange(event) {
        const accountId = event.detail.value;
        // handle account selection change
        this.dispatchEvent(new CustomEvent('accountselect', { detail: { accountId: accountId } }));
    }

    @wire(getFilteredAccounts, { filter: '$filter' })
    wiredAccounts({ error, data }) {
        if (data) {
            // handle retrieved accounts
            console.log(data);
        } else if (error) {
            // handle error
            console.error(error);
        }
    }
}
