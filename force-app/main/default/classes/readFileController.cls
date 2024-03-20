public with sharing class readFileController {
    public readFileController() {

    }

    @AuraEnabled
    public static String uploadFile(String fileName, String fileContents) {
        // Save the file data to your database
        // ...
        System.debug(fileContents);
        System.debug(fileName);
        return fileContents;
      }
}