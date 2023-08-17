public with sharing class IceCreamSalesTableController {
    public class OpportunityStoreWrapper {
        @AuraEnabled public String opportunityId { get; set; }
        @AuraEnabled public String opportunityName { get; set; }
        @AuraEnabled public String stageName { get; set; }
        @AuraEnabled public Date closeDate { get; set; }
        @AuraEnabled public String storeName { get; set; }
        @AuraEnabled public String city { get; set; }
        @AuraEnabled public String state { get; set; }
        @AuraEnabled public Decimal amount {get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static List<OpportunityStoreWrapper> getOpportunitiesByCity(String city) {
        String query = 'SELECT Id, Name, StageName, CloseDate, Store__c, Store__r.Name, Store__r.City__c, Store__r.State__c,Amount FROM Opportunity';
        
        if (!String.isBlank(city)) {
            query += ' WHERE Store__r.City__c = \'' + city + '\'';
        }

        query += ' ORDER BY Amount DESC';

        List<OpportunityStoreWrapper> result = new List<OpportunityStoreWrapper>();
        for (Opportunity opp : Database.query(query)) {
            OpportunityStoreWrapper wrapper = new OpportunityStoreWrapper();
            wrapper.opportunityId = opp.Id;
            wrapper.opportunityName = opp.Name;
            wrapper.stageName = opp.StageName;
            wrapper.closeDate = opp.CloseDate;
            wrapper.storeName = opp.Store__r.Name;
            wrapper.city = opp.Store__r.City__c;
            wrapper.state = opp.Store__r.State__c;
            wrapper.amount = opp.Amount;
            
            result.add(wrapper);
        }
        
        return result;
    }
}
