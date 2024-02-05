import { LightningElement, api, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';

import { registerRefreshHandler, unregisterRefreshHandler } from "lightning/refresh";
import getRelatedContacts from "@salesforce/apex/ListContactController.getRelatedContacts";

export default class ListContact extends LightningElement {
    @api recordId = null;
    refreshHandlerID;
    lastRefreshTime;
    columnDefinition = [
        { label: 'Name', fieldName: 'Name', type: 'text' },
        { label: 'Email', fieldName: 'Email', type: 'email' },
        { label: 'Phone', fieldName: 'Phone', type: 'phone' }
    ];;

    @wire(getRelatedContacts, { accountId: '$recordId' }) contacts;

    get contactList() {
        return this.contacts?.data;
    }

    get getlastRefreshTime() {
        return this.lastRefreshTime;
    }

    connectedCallback() {
        // Register the refresh handler
        this.refreshHandlerID = registerRefreshHandler(this, this.handleRefresh);
    }

    disconnectedCallback() {
        // Unregister the refresh handler
        unregisterRefreshHandler(this.refreshHandlerID);
    }

    handleRefresh() {
        console.log('Refresh event received');
        this.lastRefreshTime = new Date();
        // Refresh the wire adapter
        return refreshApex(this.contacts);
    }
}