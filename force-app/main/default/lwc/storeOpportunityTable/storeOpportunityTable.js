import { LightningElement,wire, track } from 'lwc';
import getOpportunitiesByCity from '@salesforce/apex/IceCreamSalesTableController.getOpportunitiesByCity';
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CITY_FIELD from "@salesforce/schema/Store__c.City__c";
import STORE_OBJECT from '@salesforce/schema/Store__c';

const COLUMNS = [
    { label: 'Opportunity Name', fieldName: 'opportunityName', type: 'text' , sortable: true},
    { label: 'Stage', fieldName: 'stageName', type: 'text' , sortable: true},
    { label: 'Close Date', fieldName: 'closeDate', type: 'date' , sortable: true},
    { label: 'Store Name', fieldName: 'storeName', type: 'text' , sortable: true},
    { label: 'City', fieldName: 'city', type: 'text' , sortable: true},
    { label: 'State', fieldName: 'state', type: 'text' , sortable: true},
    {
        label: 'Amount',
        fieldName: 'amount',
        type: 'currency',
        sortable: true,
        typeAttributes: { currencyCode: 'USD' }
    }
];

export default class StoreOpportunityTable extends LightningElement {

    @track selectedStore = '';
    @track opportunityData = [];
    columns = COLUMNS;
    @track totalAmount = 0;
    @track sortBy='Amount'; 
    @track sortDirection='asc';

    renderedCallbackCalled = false;

    @wire(getObjectInfo, { objectApiName: STORE_OBJECT})
    storeInfo;

    @wire(getPicklistValues, { recordTypeId: '$storeInfo.data.defaultRecordTypeId', fieldApiName: CITY_FIELD})
    cityPicklistValues;


    get cityOptions() {
        let options = [];
        if (this.cityPicklistValues && this.cityPicklistValues.data) {
            options.push({ label: 'All Cities', value: '' });
            options = options.concat(this.cityPicklistValues.data.values);
        }
        return options;
    }

    //Fetches data after rendering complete and sums up total amount
    renderedCallback(){
        if(!this.renderedCallbackCalled){
            this.fetchOpportunities();
            this.renderedCallbackCalled = true;
        }
    }

    handleStoreChange(event) {
        try {
            this.selectedStore = event.detail.value;
            this.fetchOpportunities();
        } catch (error) {
            console.error('Error handling store change:', error);
        }
    }

    fetchOpportunities() {
        getOpportunitiesByCity({ city: this.selectedStore })
            .then((result) => {
                this.opportunityData = result;
                this.calculateTotalAmount();
            })
            .catch((error) => {
                console.error('Error fetching opportunities:', error);
            });
    }
    
    calculateTotalAmount() {
        try {
            let total = 0;
            this.opportunityData.forEach((opp) => {
                total += opp.amount || 0; // Handle null values
            });
            this.totalAmount = total;
        } catch (error) {
            console.error('Error calculating total amount:', error);
        }
    }

    handleSort(event) {
        try {
            this.sortBy = event.detail.fieldName;
            this.sortDirection = event.detail.sortDirection;
            this.sortData(this.sortBy, this.sortDirection);
        } catch (error) {
            console.error('Error with handle sort function:', error);
        }
    }

    sortData(fieldname, direction) {
        const cloneData = [...this.opportunityData];
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        cloneData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.opportunityData = cloneData;
    }
    
}
