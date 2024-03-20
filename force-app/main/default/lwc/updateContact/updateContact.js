import { LightningElement, track, api } from 'lwc';

export default class UpdateContact extends LightningElement {
    @track isModalOpen = false;
    @api listContactSelected = [];

    connectedCallback() {
        //this.isModalOpen = true;
        console.log('listContactSelected: ' + JSON.stringify(this.listContactSelected));
    }
}
