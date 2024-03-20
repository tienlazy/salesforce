/*
 *********************************************************
 Apex Class Name    : SendDataToMuleSoft
 Created Date       : March 16, 2024
 @description       : This class is used to send data to Mule Soft
 @author            : Doan Pham
 Modification Log:
 Ver   Date         Author                               Modification
 1.0   16-03-2024   Doan Pham                            Initial Version
 *********************************************************
 */
global class SendDataToMuleSoftBatch implements Database.Batchable<sObject>, Database.AllowsCallouts {

    /*
     *********************************************************
     @Method Name    : SendDataToMuleSoftBatch
     @author         : Doan Pham
     @description    : This is the constructor function of this class
     @param          : no param
     @return         : no return
     ********************************************************
     */
    public SendDataToMuleSoftBatch() {}

    /*
     *********************************************************
     @Method Name    : start
     @author         : Doan Pham
     @description    : method is used to start batch
     @param          : BC
     @return         : no return
     ********************************************************
     */
    global Database.QueryLocator start(Database.BatchableContext BC) {
        String query = 'SELECT Id, FirstName, LastName'
                        + ' FROM Contact'
                        + ' WHERE Title__c = \'Mule Soft\'';
        return Database.getQueryLocator(query);
    }

    /*
     *********************************************************
     @Method Name    : execute
     @author         : Doan Pham
     @description    : method is used to execute batch
     @param          : BC, contacts
     @return         : no return
     ********************************************************
     */
    global void execute(Database.BatchableContext BC, List<Contact> contacts) {
        List<Contact_PL__e> platformEvents = new List<Contact_PL__e>();
        try {
            System.debug('contacts: ' + contacts);
            if (!contacts.isEmpty()) {
                for (Contact contact : contacts) {
                    Contact_PL__e contactPL = new Contact_PL__e(Id__c = contact.Id, First_Name__c = contact.FirstName, Last_Name__c = contact.LastName);
                    platformEvents.add(contactPL);
                }

                System.debug('platformEvents: ' + platformEvents);
                if (!platformEvents.isEmpty()) {
                    List<Database.SaveResult> results = EventBus.publish(platformEvents);
                }
            }
        } catch (Exception e) {
            System.debug(e.getStackTraceString());
            System.debug(e.getMessage());
        }
    }

        /*
     *********************************************************
     @Method Name    : finish
     @author         : Doan Pham
     @description    : method is used to finish batch
     @param          : BC
     @return         : no return
     ********************************************************
     */
    global void finish(Database.BatchableContext BC) {}
}