

declare module 'lightning/platformShowToastEvent' {
    export class ShowToastEvent extends CustomEvent<{}> {
        constructor(config: {
            variant: ('success'|'warning'|'info'|'error'),
            title: string,
            message: string,
            messageData?: (string|{url: string, label: string})[],
            mode?: ('dismissible'|'pester'|'sticky'),
        });
    }
}