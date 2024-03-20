import { LightningElement, track } from 'lwc';

export default class Detail extends LightningElement {
    @track data = [
        { id: '1', name: 'John Doe', age: 30 },
        { id: '2', name: 'Jane Smith', age: 25 },
        { id: '3', name: 'Bob Johnson', age: 40 }
    ];

    columns = [
        { label: 'Name', fieldName: 'name', type: 'text' },
        { label: 'Age', fieldName: 'age', type: 'number' }
    ];

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        console.log('selectedRows: ' + JSON.stringify(selectedRows));
        alert();
    }
}
