@isTest
private class IceCreamSalesTableControllerTest {
    @isTest
    static void testGetOpportunitiesByCity() {
        // Create test data: Opportunity and related Store__c records
        Store__c testStore1 = new Store__c(Name = 'Test Store 1', City__c = 'Test City', State__c = 'Test State');
        Store__c testStore2 = new Store__c(Name = 'Test Store 2', City__c = 'Another City', State__c = 'Another State');
        insert new List<Store__c>{testStore1, testStore2};
        
        Opportunity testOpportunity1 = new Opportunity(
            Name = 'Test Opportunity 1',
            StageName = 'Closed Won',
            CloseDate = Date.today(),
            Store__c = testStore1.Id,
            Amount = 1000.00
        );
        Opportunity testOpportunity2 = new Opportunity(
            Name = 'Test Opportunity 2',
            StageName = 'Closed Lost',
            CloseDate = Date.today(),
            Store__c = testStore1.Id,
            Amount = -500.00
        );
        Opportunity testOpportunity3 = new Opportunity(
            Name = 'Test Opportunity 3',
            StageName = 'Closed Won',
            CloseDate = Date.today(),
            Store__c = testStore2.Id,
            Amount = 2000.00
        );
        insert new List<Opportunity>{testOpportunity1, testOpportunity2, testOpportunity3};
        
        // Test scenarios
        // Scenario 1: No Matching Opportunities by City
        List<IceCreamSalesTableController.OpportunityStoreWrapper> result1 = IceCreamSalesTableController.getOpportunitiesByCity('Nonexistent City');
        System.assertEquals(0, result1.size(), 'Expected 0 result for nonexistent city');
        
        // Scenario 2: Multiple Opportunities in the Same City
        List<IceCreamSalesTableController.OpportunityStoreWrapper> result2 = IceCreamSalesTableController.getOpportunitiesByCity('Test City');
        System.assertEquals(2, result2.size(), 'Expected 2 results for Test City');
        
        // Scenario 3: Opportunities in Different Cities
        List<IceCreamSalesTableController.OpportunityStoreWrapper> result3 = IceCreamSalesTableController.getOpportunitiesByCity('Another City');
        System.assertEquals(1, result3.size(), 'Expected 1 result for Another City');
        
        // Scenario 4: Empty City Parameter
        List<IceCreamSalesTableController.OpportunityStoreWrapper> result4 = IceCreamSalesTableController.getOpportunitiesByCity('');
        System.assertEquals(3, result4.size(), 'Expected 3 results for empty city');
        
        // Scenario 5: Null City Parameter
        List<IceCreamSalesTableController.OpportunityStoreWrapper> result5 = IceCreamSalesTableController.getOpportunitiesByCity(null);
        System.assertEquals(3, result5.size(), 'Expected 3 results for null city');
        
        // Scenario 6: Special Characters in City Name
        List<IceCreamSalesTableController.OpportunityStoreWrapper> result6 = IceCreamSalesTableController.getOpportunitiesByCity('Special#City');
        System.assertEquals(0, result6.size(), 'Expected 0 results for special character city');
        
        // Scenario 7: Negative Amounts
        List<IceCreamSalesTableController.OpportunityStoreWrapper> result7 = IceCreamSalesTableController.getOpportunitiesByCity('Test City');
        System.assertEquals(2, result7.size(), 'Expected 2 results for Test City');
        Boolean negativeAmountPresent = false;
        for(IceCreamSalesTableController.OpportunityStoreWrapper wrapper : result7){
            if(wrapper.Amount < 0){
                negativeAmountPresent = true;
            }
        }
        System.assertEquals(true, negativeAmountPresent, 'Expected negative amount in results');
    }
}
