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

    @wire(getObjectInfo, { objectApiName: STORE_OBJECT})
    storeInfo;

    @wire(getPicklistValues, { recordTypeId: '$storeInfo.data.defaultRecordTypeId', fieldApiName: CITY_FIELD})
    cityPicklistValues;

    renderedCallback(){
        this.fetchOpportunities();
        this.calculateTotalAmount();
    }

    handleStoreChange(event) {
        this.selectedStore = event.detail.value;
        this.fetchOpportunities();
        this.calculateTotalAmount();
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
    
    calculateTotalAmount() {
        let total = 0;
        this.opportunityData.forEach((opp) => {
            total += opp.amount; // Replace 'amount' with the actual API name of the Amount field
        });
        this.totalAmount = total;
    }
    
}
