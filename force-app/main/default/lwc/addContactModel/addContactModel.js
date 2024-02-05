import { LightningElement, api, wire } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import refreshVewMessageChannel from '@salesforce/messageChannel/RefreshVewMessage__c';

import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import ACCOUNT_ID_FIELD from '@salesforce/schema/Contact.AccountId';

export default class AddContactModel extends LightningElement {
    @api recordId; // Account Id

    objectApiName = CONTACT_OBJECT;
    fields = [FIRST_NAME_FIELD, LAST_NAME_FIELD, EMAIL_FIELD, PHONE_FIELD];
    get parentAccountId() {
        return this.recordId;
    }

    // Use the messageContext from the message service to create a message channel.
    @wire(MessageContext) messageContext;

    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        fields[ACCOUNT_ID_FIELD.fieldApiName] = this.recordId;
        this.template.querySelector('lightning-record-form').submit(fields);
    }

    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: "Contact created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(evt);
        this.dispatchEvent(new CloseActionScreenEvent());
        this.publishRefreshViewMessage();
    }

    // Publishes the message to refresh the subscriber.
    publishRefreshViewMessage() {
        const message = {
            refreshView: true
        };
        publish(this.messageContext, refreshVewMessageChannel, message);
    }

    handleError(event) {
        const evt = new ShowToastEvent({
            title: "Error creating contact",
            message: event.detail.message,
            variant: "error"
        });
        this.dispatchEvent(evt);
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }
}