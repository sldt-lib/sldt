declare module 'lightning/navigation' {

    export type GenericPageReference<T, ATTR, ST = {[key: string]: any}> = {
        type: T,
        attributes: ATTR,
        state?: ST
    };

    export type PageReferenceApp = GenericPageReference<"standard__app", {appTarget: string, pageRef?: PageReference}>
    export type PageReferenceCmsExternalRecord = GenericPageReference<"comm__externalRecordPage", {recordId: string, objectType: string, objectInfo: object}>
    export type PageReferenceCmsExternalRecordRelationship = GenericPageReference<"comm__externalRecordRelationshipPage", {recordId: string, objectType: string}>
    export type PageReferenceLightningComponent = GenericPageReference<"standard__component", {componentName: string}>
    export type PageReferenceKnowledgeArticle = GenericPageReference<"standard__knowledgeArticlePage", {articleType: string, urlName: string}>
    export type PageReferenceExperienceLoginPage = GenericPageReference<"comm__loginPage", {actionName: ("login"|"logout")}>
    export type PageReferenceManagedContentPage = GenericPageReference<"standard__managedContentPage", {contentTypeName: string, contentKey: string}>
    export type PageReferenceExperienceSitePage = GenericPageReference<"comm__namedPage", {name: string}>
    export type PageReferenceNamedPage = GenericPageReference<"standard__namedPage", {pageName: string}>
    export type PageReferenceCustomTab = GenericPageReference<"standard__navItemPage", {pageName: string}>
    export type PageReferenceObject = GenericPageReference<"standard__objectPage", {actionName: string, objectApiName: string}, {filterNam?: string, defaultFieldValues?: any, nooverride?: any}>
    export type PageReferenceRecord = GenericPageReference<"standard__recordPage", {actionName: string, objectApiName?: string, recordId: string}, {nooverride?: any}>
    export type PageReferenceRecordRelation = GenericPageReference<"standard__recordRelationshipPage", {actionName: string, objectApiName?: string, recordId: string, relationshipApiName: string}>
    export type PageReferenceWebPage = GenericPageReference<"standard__webPage", {url: string}>

    export type PageReference = (
        PageReferenceApp |
        PageReferenceCmsExternalRecord |
        PageReferenceCmsExternalRecordRelationship |
        PageReferenceLightningComponent |
        PageReferenceKnowledgeArticle |
        PageReferenceExperienceLoginPage |
        PageReferenceManagedContentPage |
        PageReferenceExperienceSitePage |
        PageReferenceNamedPage |
        PageReferenceCustomTab |
        PageReferenceObject |
        PageReferenceRecord |
        PageReferenceRecordRelation |
        PageReferenceWebPage
    );


    class NavigationKey {
        Navigate: Symbol;
        GenerateUrl: Symbol;
    }
    export function NavigationMixin <T>(BaseClass: T): T;
    export namespace NavigationMixin {
        var Navigate: Symbol;
        var GenerateUrl: Symbol;
    }

}