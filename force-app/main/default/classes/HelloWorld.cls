public without sharing class HelloWorld {
    @AuraEnabled
    public List<DocumentFile> listDocumentFile { get; set; }

    @AuraEnabled
    public static List<String> uploadFiles(List<Object> documentFiles, String recordId) {
        String jsonString = JSON.serialize(documentFiles);
        List<DocumentFile> listDocumentFile = (List<DocumentFile>) JSON.deserialize(jsonString, List<DocumentFile>.class);
        List<String> contentDocumentIds = new List<String>();

        for (DocumentFile file : listDocumentFile) {
            ContentVersion cv = createContentVersion(file.base64, file.filename);
            if (cv != null) {
                ContentDocumentLink cdl = createContentLink(cv.Id, recordId);
                if (cdl != null) {
                    contentDocumentIds.add(cdl.Id);
                }
            }
        }

        return contentDocumentIds;
    }

    private static ContentVersion createContentVersion(String base64, String filename) {
        ContentVersion cv = new ContentVersion();
        cv.VersionData = EncodingUtil.base64Decode(base64);
        cv.Title = filename;
        cv.PathOnClient = filename;
        try {
            insert cv;
            return cv;
        } catch(DMLException e) {
            return null;
        }
    }

    private static ContentDocumentLink createContentLink(String contentVersionId, String recordId) {
        if (contentVersionId == null || recordId == null) { return null; }
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =: contentVersionId].ContentDocumentId;
        cdl.LinkedEntityId = recordId;
        cdl.ShareType = 'V';
        try {
            insert cdl;
            return cdl;
        } catch(DMLException e) {
            return null;
        }
    }

    public class DocumentFile {
        @AuraEnabled
        public String filename { get; set; }
        @AuraEnabled
        public String base64 { get; set; }

        public DocumentFile(String filename, String base64) {
            this.filename = filename;
            this.base64 = base64;
        }
    }
}