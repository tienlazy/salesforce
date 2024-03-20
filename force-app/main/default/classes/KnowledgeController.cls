public without sharing class KnowledgeController {
    public static final String PUBLISH_STATUS_ONLINE = 'Online';

    // @AuraEnabled(cacheable = true)
    // public static List<Contact> getKnowLedge() {
    //     // List<Knowledge__kav> articles = [SELECT Id, Title, CreatedDate, RecordType.Name, Question__c FROM Knowledge__kav WHERE PublishStatus = :PUBLISH_STATUS_ONLINE limit 50];
    //     List<Contact> articles = [SELECT id, Type__c, Create_Date__c, Detail__c, Title__c FROM Contact limit 12];
    //     return articles;
    // }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getKnowLedge(String pageNumber, String pageSize) {
        Integer limitRecord = Integer.valueof(pageSize);
        Integer offset = (Integer.valueof(pageNumber) - 1) * limitRecord;
        List<Contact> articles = [SELECT id, Type__c, Create_Date__c, Detail__c, Title__c FROM Contact ORDER BY Create_Date__c DESC LIMIT :limitRecord OFFSET :offset];
        return articles;
    }

    @AuraEnabled(cacheable=true)
    public static Integer getTotalArticlesCount() {
        return [SELECT COUNT() FROM Contact];
    }
 }