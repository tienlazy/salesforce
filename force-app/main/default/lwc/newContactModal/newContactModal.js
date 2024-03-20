import { LightningElement, track } from 'lwc';
import object from '@salesforce/schema/Contact';
import firtname from '@salesforce/schema/Contact.FirstName';
import lastname from '@salesforce/schema/Contact.LastName';
import bday from '@salesforce/schema/Contact.Birthdate';
import email from '@salesforce/schema/Contact.Email';
import department from '@salesforce/schema/Contact.Department';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class NewContactModal extends NavigationMixin(LightningElement) {
    @track fields = [firtname, lastname, bday, email, department];
    @track objectApiName = object;
    flag = false;
    showSuccessMessage = false;

    closeModal() {
        this.dispatchEvent(new CustomEvent('close', {
            detail: {
                isOpenModal: false
            }
        }));
    }

    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        this.template.querySelector('lightning-record-form').submit(fields);
    }

    handleSuccess(event) {
        this.flag = true; //track save success or not
        this.showSuccessMessage = true;

        const evt = new ShowToastEvent({
            title: 'Contact created',
            message: 'Contact is created successfully.',
            variant: 'success',
        });
        this.dispatchEvent(evt);

        this.dispatchEvent(new CustomEvent('recordsaved', {
            detail: {
                isOpenModal: false,
                flag: this.flag
            }
        }));
    }
}