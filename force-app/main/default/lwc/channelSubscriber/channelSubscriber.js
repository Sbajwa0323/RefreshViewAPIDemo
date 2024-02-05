import { LightningElement, wire } from 'lwc';
import { RefreshEvent } from "lightning/refresh";
// Import message service features required for subscribing and the message channel
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from "lightning/messageService";
import refreshVewMessageChannel from '@salesforce/messageChannel/RefreshVewMessage__c';
export default class ChannelSubscriber extends LightningElement {
    subscription = null;

    @wire(MessageContext) messageContext;

    lastMessageReceived;
    get getlastMessageReceived() {
        return this.lastMessageReceived;
    }

    // subscribe to message channel 
    // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                refreshVewMessageChannel,
                () => this.dispathRefreshEvent(),
                { scope: APPLICATION_SCOPE },
            );
        }
    }

    // unsubscribe from message channel
    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    // Handler for message received by component
    dispathRefreshEvent() {
        this.lastMessageReceived = new Date();
        this.dispatchEvent(new RefreshEvent());
    }

    // Standard lifecycle hooks used to subscribe the message channel
    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    // Standard lifecycle hooks used to unsubsubscribe the message channel
    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }
}