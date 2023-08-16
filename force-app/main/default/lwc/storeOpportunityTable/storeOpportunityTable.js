import { LightningElement, wire, track } from 'lwc';
import gatherIceCreamSales from '@salesforce/apex/IceCreamSalesTableController.gatherIceCreamSales';

const STORE_OPTIONS = [
    { label: 'Anaheim', value: 'Anaheim' },
    { label: 'Los Angeles', value: 'Los Angeles' },
    { label: 'Santa Monica', value: 'Santa Monica' }
];

const COLUMNS = [
    { label: 'Store Name', fieldName: 'Store__r.Name', type: 'text' },
    { label: 'State', fieldName: 'Store__r.State__c', type: 'text' },
    { label: 'City', fieldName: 'Store__r.City__c', type: 'text' },
    { label: 'Amount', fieldName: 'Amount', type: 'currency',typeAttributes: { currencyCode: 'USD', step: '0.001' },},
    { label: 'Close Date', fieldName: 'CloseDate', type: 'date' }
];

export default class StoreOpportunityTable extends LightningElement {
    @track selectedStore = 'Anaheim';
    @track storeOptions = STORE_OPTIONS;
    @track opportunityData = [];
    columns = COLUMNS;

    handleStoreChange(event) {
        this.selectedStore = event.detail.value;
        this.fetchOpportunities();
    }

    @wire(gatherIceCreamSales, { storeName: '$selectedStore' })
    wiredOpportunities({ error, data }) {
        if (data) {
            this.opportunityData = data;
        }
    }

    fetchOpportunities() {
        gatherIceCreamSales({ storeName: this.selectedStore })
            .then((result) => {
                this.opportunityData = result;
            })
            .catch((error) => {
                console.error('Error fetching opportunities:', error);
            });
    }
}
