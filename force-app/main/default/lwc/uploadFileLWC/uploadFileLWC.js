import { LightningElement, track, api } from 'lwc';
import fetchFiles from '@salesforce/apex/uploadFileLWC.fetchFiles';

export default class uploadFileLWC extends LightningElement {
    @api recordId;
    @track lstAllFiles;
    @track error;
    @track progress; // declare a property to store the progress value

    get acceptedFormats() {
        return ['.pdf', '.png', '.jpg'];
    }

    connectedCallback() {
        this.fetchFilesList();
    }

    fetchFilesList() {
        fetchFiles({ recordId: this.recordId })
            .then(result => {
                this.lstAllFiles = result;
                this.error = undefined;
            })
            .catch(error => {
                this.lstAllFiles = undefined;
                this.error = error;
            });
    }

    handleProgress(event) {
        // get the file size and bytes transferred from the event data
        let fileSize = event.detail.file.size;
        let bytesTransferred = event.detail.bytesTransferred;
        // calculate the progress value as a percentage
        this.progress = Math.round((bytesTransferred / fileSize) * 100);
    }

    // define a function to handle the upload success event
    handleSuccess(event) {
        this.fetchFilesList();
    }
}
