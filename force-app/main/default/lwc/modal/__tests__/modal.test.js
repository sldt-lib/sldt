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

    it("init modal - with body false to true - body shown", async () => {
        const element = createElement('c-modal', {is: Modal});
        element.withBody = false;

        document.body.appendChild(element);

        let modalBody = element.shadowRoot.querySelector(".slds-modal__content");
        expect(modalBody).toBeNull();

        element.withBody = true;
        await Promise.resolve();

        modalBody = element.shadowRoot.querySelector(".slds-modal__content");
        expect(modalBody).not.toBeNull();
    });

    it("init modal - add without body - body hidden", async () => {
        const element = createElement('c-modal', {is: Modal});

        document.body.appendChild(element);

        let modalBody = element.shadowRoot.querySelector(".slds-modal__content");
        expect(modalBody).not.toBeNull();

        element.withoutBody = true;
        await Promise.resolve();

        modalBody = element.shadowRoot.querySelector(".slds-modal__content");
        expect(element.withBody).toBe(false);
        expect(element.withoutBody).toBe(true);
        expect(modalBody).toBeNull();
    });

    it("close modal - close event fired", async () => {
        const element = createElement('c-modal', {is: Modal});
        element.withCloseButton = true;

        document.body.appendChild(element);

        const closeHandler = jest.fn();
        element.addEventListener('close', closeHandler);

        let modalCloseButton = element.shadowRoot.querySelector("lightning-button-icon.slds-modal__close");
        expect(modalCloseButton).not.toBeNull();
        modalCloseButton.click();

        await Promise.resolve();

        expect(closeHandler).toHaveBeenCalled();
    });
});