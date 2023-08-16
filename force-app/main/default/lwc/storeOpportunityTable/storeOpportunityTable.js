import { LightningElement, track } from 'lwc';
import getOpportunitiesByCity from '@salesforce/apex/IceCreamSalesTableController.getOpportunitiesByCity';

const STORE_OPTIONS = [
    { label: 'None', value: '' },
    { label: 'Anaheim', value: 'Anaheim' },
    { label: 'Los Angeles', value: 'Los Angeles' },
    { label: 'Santa Monica', value: 'Santa Monica' }
];

const COLUMNS = [
    { label: 'Opportunity Name', fieldName: 'opportunityName', type: 'text' },
    { label: 'Stage', fieldName: 'stageName', type: 'text' },
    { label: 'Close Date', fieldName: 'closeDate', type: 'date' },
    { label: 'Store Name', fieldName: 'storeName', type: 'text' },
    { label: 'City', fieldName: 'city', type: 'text' },
    { label: 'State', fieldName: 'state', type: 'text' }
];

export default class StoreOpportunityTable extends LightningElement {
    @track selectedStore = '';
    @track storeOptions = STORE_OPTIONS;
    @track opportunityData = [];
    columns = COLUMNS;

    renderedCallback(){
        this.fetchOpportunities();
    }

    handleStoreChange(event) {
        this.selectedStore = event.detail.value;
        this.fetchOpportunities();
    }

    fetchOpportunities() {
        getOpportunitiesByCity({ city: this.selectedStore })
            .then((result) => {
                this.opportunityData = result;
            })
            .catch((error) => {
                console.error('Error fetching opportunities:', error);
            });
    }
    
}
