import { LightningElement, wire, track, api } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';
import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';
import { refreshApex } from '@salesforce/apex';
import deleteSelectedContacts from '@salesforce/apex/ContactController.deleteSelectedContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class GetListContact extends NavigationMixin(LightningElement) {
    @track isOpenModal = false;
    @track contacts = [];
    @track error;
    @api objectApiName;
    @track isTrue = false;

    recordId = '';
    selectedRecordIds = [];
    flag = false;
    columns = [
        {
            label: 'Contact Name',
            fieldName: 'NameURL',
            type: 'url',
            typeAttributes: { label: { fieldName: 'Name' }, target: '_blank' }
        },
        { label: 'Contact Email', fieldName: 'Email', type: 'email', editable: true },
        { label: 'Contact Phone', fieldName: 'Phone', type: 'phone' },
        { label: 'Created Date', fieldName: 'CreatedDate', type: 'datetime' },
    ];

    wiredContactsResult;

    @wire(getContactList)
    wiredContacts(result) {
        this.wiredContactsResult = result;
        if (result.data) {
            var siteName = `${basePath}`.substring(0, `${basePath}`.indexOf('/s') + 1);
            var tempContacts = result.data.map(con => ({
                Id: con.Id,
                Name: con.Name,
                NameURL: window.location.hostname + siteName + con.Id,
                Email: con.Email,
                Phone: con.Phone,
                CreatedDate: con.CreatedDate
            }));
            this.contacts = tempContacts;
        } else if (result.error) {
            console.error('Error fetching contacts:', result.error);
        }
    }

    handleOpenNewContactModal() {
        this.isOpenModal = true;
    }

    handleCloseNewContactModal(event) {
        this.isOpenModal = event.detail.isOpenModal;
    }

    createRecordSuccess(event) {
        console.log('flag1: ' + this.flag);
        this.flag = event.detail.flag;
        console.log('flag: ' + this.flag);
        if (this.flag) {
            this.isOpenModal = false;
            this.refreshPage();
        }
    }

    refreshPage() {
        return refreshApex(this.wiredContactsResult);
    }

    getSelectedRecords(event) {
        const selectedRows = event.detail.selectedRows;
        //this.recordsCount = event.detail.selectedRows.length;
        this.selectedRecordIds = new Array();
        for (let i = 0; i < selectedRows.length; i++) {
            this.selectedRecordIds.push(selectedRows[i].Id);
        }
    }

    handleDelete(event) {
        console.log('recordId: ' + this.selectedRecordIds);

        if (this.selectedRecordIds) {
            //this.buttonLabel = 'Processing....';
            this.isTrue = true;
            deleteSelectedContacts({recordIds: this.selectedRecordIds}).then(result => {
                console.log('result ====> ' + JSON.stringify(result));
                //this.buttonLabel = 'Delete Records';
                this.isTrue = false;
                if(result) {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success!!',
                            //message: this.recordsCount + ' records are deleted.',
                            message: 'Delete successfully.',
                            variant: 'success'
                        }),
                    );
                    this.template.querySelector('lightning-datatable').selectedRows = [];
                    this.refreshPage();
                }else {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Fail!!',
                            //message: this.recordsCount + ' records are deleted.',
                            message: 'This contact is linked to Case.',
                            variant: 'error'
                        }),
                    );
                }
                
                //return refreshApex(this.wiredContactsResult);
                //this.recordsCount = 0;
            }).catch(error => {
                //this.buttonLabel = 'Delete Records';
                this.isTrue = false;                
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error while getting Contacts',
                        message: JSON.stringify(error),
                        variant: 'error'
                    }),
                );
            });
        }
    }
}