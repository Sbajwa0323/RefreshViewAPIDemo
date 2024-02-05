/**
 * @description       : 
 * @author            : Surinderjit Singh Bajwa
 * @group             : 
 * @last modified on  : 02-05-2024
 * @last modified by  : Surinderjit Singh Bajwa
**/
public with sharing class ListContactController {
    
    @AuraEnabled(cacheable=true)
    public static list<Contact> getRelatedContacts(string accountId){
        try {
            return [SELECT Id, Name, Email, Phone, AccountId FROM Contact WHERE AccountId = :accountId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}