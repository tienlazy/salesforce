public with sharing class uploadFileLWC {
    @AuraEnabled(cacheable=false)
    public static List<ContentDocumentLink> fetchFiles(String recordId){
        List<ContentDocumentLink> documentLinks = new List<ContentDocumentLink>();

        try {
            System.debug('recordId: ' + recordId);
            documentLinks = [
                SELECT LinkedEntityId, ContentDocument.CreatedDate, ContentDocument.Title, ContentDocument.ContentSize, ContentDocument.FileType 
                FROM ContentDocumentLink 
                WHERE LinkedEntityId = :recordId
            ];
        } catch (Exception ex) {
            System.debug('Exception occurred while fetching files: ' + ex.getMessage());
        }

        return documentLinks;
    }
}
