import { LightningElement, track, api, wire } from 'lwc';
import uploadFilesToSV from '@salesforce/apex/HelloWorld.uploadFiles'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class HelloWorld extends LightningElement {
    // Reactive properties using @track and @api decorators
    @track uploadPercentage = 0;
    @track uploadStatus = '';
    // @track loadedAndTotal = '';
    @track listFiles = [];
    @track numberStart = 0;
    @track errorMessage = '';
    @api recordId;
    documentFiles = [];
    @track isShowModal = false;
    total = 0;
    flag =  false;

    showModalBox() {
        this.isShowModal = true;
    }

    // Method to return accepted file formats
    get acceptedFormats() {
        return ['.jpg', '.png', '.csv', '.xlsx', '.xlsm'];
    }

    // Method triggered when files are selected for upload
    async handleFileChange(event) {
        this.flag = true;
        const fileInput = event.target;
        const files = Array.from(fileInput.files);
        if (files.length > 10 || files.length + this.total > 10) {
            this.errorMessage = 'You can only select a maximum of 10 files.';
            return;
        } else {
            if (this.flag) {
                this.uploadFilesSequentially(files);
            }
            this.errorMessage = null;
        }
    }

    // Method to upload files sequentially
    async uploadFilesSequentially(files) {
        let idCounter = this.listFiles.length + 1;

        for (const file of files) {
            // Add metadata about the file to the listFiles array for UI display
            let fileName = file.name;
            let fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);

            const fileLoad = {
                id: idCounter++,
                name: fileName,
                size: this.formatBytes(file.size),
                type: fileExtension,
                uploading: true
            };
            this.listFiles.push(fileLoad);
            this.numberStart = this.listFiles.length;

            // Upload the file and process it based on its type
            await this.uploadFile(file);
            await this.delay();
500
            // Reset upload progress and status
            this.uploadPercentage = 0;
            this.uploadStatus = '';
            // this.loadedAndTotal = '';
            this.total++;

            // Mark fileLoad.uploading as false to indicate upload completion
            fileLoad.uploading = false;
            if (this.uploadPercentage = 100) {
                await this.processAddFile(file);
            }
        }
    }

    // Method to process non-image files (CSV)
    async processAddFile(file) {
        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = reader.result.split(',')[1];
            const docFile = {
                base64: base64,
                filename: file.name
            };
            this.documentFiles.push(docFile);
        };
        await reader.readAsDataURL(file);
    }


    // Method to add a delay using a Promise
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    xhrHandler = null;

    // Method to upload a single file to the server using XMLHttpRequest
    uploadFile(file) {
        return new Promise((resolve) => {
            const formData = new FormData();
            formData.append('file', file);

            this.xhrHandler = new XMLHttpRequest();

            this.xhrHandler.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    // Update upload progress properties
                    this.uploadPercentage = Math.round((event.loaded / event.total) * 100);
                    this.uploadStatus = `${this.uploadPercentage}% uploaded...`;
                    // this.loadedAndTotal = `${this.formatBytes(event.loaded)} / ${this.formatBytes(event.total)}`;
                    this.animateProgressBar(this.uploadPercentage);
                }
            });

            this.xhrHandler.onload = () => {
                // Upload completed
                this.uploadPercentage = 100;
                this.uploadStatus = 'Upload completed!';
                resolve();
            };

            this.xhrHandler.open('POST', '/api/upload'); // Adjust the URL based on your server configuration
            this.xhrHandler.send(formData);
        });
    }

    // Method to format file size into human-readable format
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat(Math.round((bytes / Math.pow(k, i)).toFixed(2))) + sizes[i];
    }

    //Method executed after the component has finished rendering
    renderedCallback() {
        // Add custom styles to the file selector
        const styles = this.template.querySelectorAll('style');
        let styleExists = false;
        styles.forEach((style) => {
            if (style.innerText === '.slds-file-selector__dropzone{border: none;}' || style.innerText) {
                styleExists = true;
                return;
            }
        });

        if (!styleExists) {
            let style = document.createElement('style');
            style.innerText = '.slds-file-selector_files>.slds-file-selector__dropzone{border:none;}'
                + '.slds-file-selector__body>.slds-medium-show{display:none}'
                + '.slds-file-selector__body>.slds-button_neutral{border:1px solid;color:#0075FF;}'
                + '.cancle_button>.slds-button_outline-brand{width:100px;border:1px solid #111;border-radius:5px;height:35px;}'
                + '.add_button>.slds-button_brand{width:100px;background-color:#0075FF;border-radius:5px;float:right;height:35px}'
                + '.upload>.slds-form-element__label{display:none}';
            this.template.querySelector('[data-id="file-selector"]').appendChild(style);
        }
    }

    // Method to animate the progress bar during file upload
    animateProgressBar(targetPercentage) {
        const step = 1;
        const duration = 500;
        const numSteps = duration / step;
        const increment = (targetPercentage - this.uploadPercentage) / numSteps;

        const animate = () => {
            // this.uploadPercentage += increment;
            // if (this.uploadPercentage < targetPercentage) {
            //     requestAnimationFrame(animate);
            // } else {
            //     this.uploadPercentage = targetPercentage;
            // }
            if (this.uploadPercentage < 100) {
                this.uploadPercentage += increment;
                if (this.uploadPercentage < targetPercentage) {
                    requestAnimationFrame(animate);
                } else {
                    this.uploadPercentage = targetPercentage;
                }
            }
        };

        animate();
    }

    // Method executed when the "Upload" button is clicked
    handleClick() {
        if (this.documentFiles.length > 0) {
            let documents = this.documentFiles;
            // Call the Apex method to upload the files to the server
            uploadFilesToSV({ documentFiles: documents, recordId: this.recordId })
                .then((result) => {
                    let title = "Files uploaded successfully!!";
                    this.toast(title);
                    this.listFiles = [];
                    this.numberStart = 0;
                })
                .catch(error => {
                    console.error(error);
                    let title = "Error uploading files.";
                    this.toast(title);
                });
        } else {
            let title = "No document files to upload.";
            this.toast(title);
        }
    }

    // Method show message
    toast(title) {
        const toastEvent = new ShowToastEvent({
            title,
            variant: "success"
        })
        this.dispatchEvent(toastEvent)
    }

    hideModalBox() {
        this.listFiles = [];
        this.numberStart = 0;
        this.isShowModal = false;
        this.xhrHandler.abort();
        this.uploadPercentage = 0;
        this.uploadStatus = '';
        this.total = 0;
        this.documentFiles = [];
    }

    // Method to handle the close button click event
    handleCloseClick(event) {
        // Stop processing of progress bar
        this.xhrHandler.abort();
        // Get the file id from the data attribute
        const fileId = event.target.dataset.fileId;

        // Find the index of the file in the listFiles array
        const fileIndex = this.listFiles.findIndex(file => file.id == fileId);

        // Remove the file from the listFiles array
        this.listFiles.splice(fileIndex, 1);

        // Update the numberStart property
        this.numberStart = this.listFiles.length;

        // Update the total property
        this.total--;

        // Reset upload progress and status
        this.uploadPercentage = 0;
        this.uploadStatus = '';
    }

}