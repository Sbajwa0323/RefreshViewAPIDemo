import { LightningElement, api } from 'lwc';
import { RefreshEvent } from "lightning/refresh";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import ACCOUNT_ID_FIELD from '@salesforce/schema/Contact.AccountId';

export default class AddContact extends LightningElement {
    @api recordId;

    objectApiName = CONTACT_OBJECT;
    fields = [FIRST_NAME_FIELD, LAST_NAME_FIELD, EMAIL_FIELD, PHONE_FIELD];
    get parentAccountId() {
        return this.recordId;
    }

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

        this.dispatchEvent(new RefreshEvent());
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