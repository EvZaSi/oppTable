import { createElement } from 'lwc';
import StoreOpportunityTable from 'c/storeOpportunityTable'; 
import getOpportunitiesByCity from '@salesforce/apex/IceCreamSalesTableController.getOpportunitiesByCity';

jest.mock(
    '@salesforce/apex/IceCreamSalesTableController.getOpportunitiesByCity',
    () => ({
        default: jest.fn()
    }),
    { virtual: true }
);

describe('c-datatable', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty.
    // This is needed for promise timing.
    async function flushPromises() {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        return new Promise((resolve) => setTimeout(resolve, 0));
    }

    it('displays no records message when no opportunities are returned', () => {
        getOpportunitiesByCity.mockResolvedValue([]);
        const element = createElement('c-store-opportunity-table', {
            is: StoreOpportunityTable
        });

        document.body.appendChild(element);

        const noRecordsMessage = element.shadowRoot.querySelector('.slds-text-heading_medium');
        expect(noRecordsMessage.textContent).toBe('There are no records to display. Please change your filters.');
    });

    it('fetches opportunities and updates total amount when opportunities loaded', async () => {
        getOpportunitiesByCity.mockResolvedValue([{ opportunityName: 'Opportunity A', amount: 150 }, { opportunityName: 'Opportunity B', amount: 100 }]);

        const element = createElement('c-store-opportunity-table', {
            is: StoreOpportunityTable
        });
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Verify the rendered data
        const table = element.shadowRoot.querySelector('lightning-datatable');
        console.log(JSON.stringify(table.data));
        expect(table.data.length).toBe(2);
        
        // Verify total amount
        const totalAmount = element.shadowRoot.querySelector('lightning-formatted-number');
        expect(totalAmount.value).toBe(250);
    });

});