import { createElement } from 'lwc';
import StoreOpportunityTable from 'c/storeOpportunityTable';
import { createApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getOpportunitiesByCity from '@salesforce/apex/IceCreamSalesTableController.getOpportunitiesByCity';

// Mock the Apex method using registerApexTestWireAdapter
const getOpportunitiesByCityAdapter = createApexTestWireAdapter(getOpportunitiesByCity);

describe('c-store-opportunity-table', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('displays opportunities with total amount', async () => {

        // Mock the data returned by the Apex method
        const mockOpportunityData = [
            { opportunityName: 'Test Opportunity 1', stageName: 'Closed Won', closeDate: '2023-08-01', storeName: 'Anaheim', city: 'Anaheim', state: 'CA', amount: 100 },
            { opportunityName: 'Test Opportunity 2', stageName: 'Prospecting', closeDate: '2023-08-15', storeName: 'Los Angeles', city: 'Los Angeles', state: 'CA', amount: 200 }
        ];
        getOpportunitiesByCityAdapter.emit(mockOpportunityData);

        // Create the component
        const element = createElement('c-store-opportunity-table', {
            is: StoreOpportunityTable
        });
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await Promise.resolve();

        // Validate that total amount is displayed correctly
        const datatable = element.shadowRoot.querySelector('lightning-datatable');
        expect(datatable.data.length).toBe(mockOpportunityData.length);

        const totalAmount = element.shadowRoot.querySelector('p');
        expect(totalAmount.textContent).toBe(`Total Amount: ${mockOpportunityData.reduce((sum, opp) => sum + opp.amount, 0)}`);
    });

});
