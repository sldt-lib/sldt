import { createElement } from 'lwc';
import Modal from 'c/modal';

describe('c-modal', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('init modal - no header - no headingAdded', async () => {
        const element = createElement('c-modal', {is: Modal});
        document.body.appendChild(element);

        const heading = element.shadowRoot.querySelector("header.slds-modal__header");
        expect(heading).toBeNull();
    });
    it('init modal - heading via attribute - heading exists', async () => {
        const element = createElement('c-modal', {is: Modal});
        element.heading = "Test Heading";
        document.body.appendChild(element);

        const heading = element.shadowRoot.querySelector("header.slds-modal__header");
        expect(heading).not.toBeNull();
        expect(heading.textContent).toBe("Test Heading")
    });
    it('init modal - heading via slot - heading exists', async () => {
        const element = createElement('c-modal', {is: Modal});
        element.withHeader = true;

        document.body.appendChild(element);

        const heading = element.shadowRoot.querySelector("header.slds-modal__header");
        expect(heading).not.toBeNull();
        expect(heading.style.padding).toBe("0px");
    });
});