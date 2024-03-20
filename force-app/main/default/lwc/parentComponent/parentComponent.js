import { LightningElement, track } from 'lwc';

export default class ParentComponent extends LightningElement {
    @track filter = '';

    handleAccountSelect(event) {
        console.log('Selected Account Id: ', event.detail.accountId);

        this.filter = event.detail.accountId;
    }
}
