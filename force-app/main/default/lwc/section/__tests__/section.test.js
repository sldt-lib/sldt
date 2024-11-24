import { createElement } from 'lwc';
import Section from 'c/section';8

describe('c-section', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Init section - readonly collapsed - section shows header
    it('renders readonly collapsed section with header', () => {
        const element = createElement('c-section', { is: Section });
        element.label = 'Readonly Collapsed Section';
        document.body.appendChild(element);

        const header = element.shadowRoot.querySelector('.slds-section__title span');
        expect(header.textContent).toBe('Readonly Collapsed Section');

        const content = element.shadowRoot.querySelector('.slds-section__content');
        expect(content).not.toBeNull();
        expect(content.getAttribute('aria-hidden')).toBe('true');
    });

    // Init section - readonly expanded - section shows data
    it('renders readonly expanded section with data', async () => {
        const element = createElement('c-section',{ is: Section });
        element.label = 'Readonly Expanded Section'
        element.isOpen = true;
        document.body.appendChild(element);

        const header = element.shadowRoot.querySelector('.slds-section__title span');
        expect(header.textContent).toBe('Readonly Expanded Section');

        await Promise.resolve();

        const content = element.shadowRoot.querySelector('.slds-section__content');
        expect(content.getAttribute('aria-hidden')).toBe('false');
    });

    // Init section - expandable collapsed - section shows clickable header
    it('renders expandable collapsed section with clickable header', () => {
        const element = createElement('c-section',{ is: Section });
        element.label = 'Expandable Collapsed Section';
        element.expandable = true;
        document.body.appendChild(element);

        const button = element.shadowRoot.querySelector('button.slds-section__title-action');
        expect(button).not.toBeNull();

        const content = element.shadowRoot.querySelector('.slds-section__content');
        expect(content.getAttribute('aria-hidden')).toBe('true');
    });

    // Init section - expandable expanded - section shows data and clickable header
    it('renders expandable expanded section with data and clickable header', () => {
        const element = createElement('c-section',{ is: Section });
        element.label = 'Expandable Expanded Section';
        element.expandable = true;
        element.isOpen = true;
        document.body.appendChild(element);

        const button = element.shadowRoot.querySelector('button.slds-section__title-action');
        expect(button).not.toBeNull();

        const content = element.shadowRoot.querySelector('.slds-section__content');
        expect(content.getAttribute('aria-hidden')).toBe('false');
    });

    // Init section - readonly collapsed box - section shows header with border
    it('renders readonly collapsed section with header in box', async () => {
        const element = createElement('c-section',{ is: Section });
        element.label = 'Readonly Collapsed Section with Box';
        element.boxContent = true;
        document.body.appendChild(element);

        await Promise.resolve();

        const section = element.shadowRoot.querySelector('.slds-section');
        expect(section.classList.contains('slds-box')).toBe(true);

        const header = element.shadowRoot.querySelector('.slds-section__title span');
        expect(header.textContent).toBe('Readonly Collapsed Section with Box');

        const content = element.shadowRoot.querySelector('.slds-section__content');
        expect(content.getAttribute('aria-hidden')).toBe('true');
    });

    // Init section - readonly expanded box - section shows header and data in border
    it('renders readonly expanded section with header and data in box', () => {
        const element = createElement('c-section',{ is: Section });
        element.label = 'Readonly Expanded Section with Box';
        element.isOpen = true;
        element.boxContent = true;
        document.body.appendChild(element);

        const section = element.shadowRoot.querySelector('.slds-section');
        expect(section.classList.contains('slds-box')).toBe(true);

        const header = element.shadowRoot.querySelector('.slds-section__title span');
        expect(header.textContent).toBe('Readonly Expanded Section with Box');

        const content = element.shadowRoot.querySelector('.slds-section__content');
        expect(content.getAttribute('aria-hidden')).toBe('false');
    });

    // Init section - expandable collapsed box - section shows clickable header in border
    it('renders expandable collapsed section with clickable header in box', () => {
        const element = createElement('c-section',{ is: Section });
        element.label = 'Expandable Collapsed Section with Box';
        element.expandable = true;
        element.boxContent = true;
        document.body.appendChild(element);

        const section = element.shadowRoot.querySelector('.slds-section');
        expect(section.classList.contains('slds-box')).toBe(true);

        const button = element.shadowRoot.querySelector('button.slds-section__title-action');
        expect(button).not.toBeNull();

        const content = element.shadowRoot.querySelector('.slds-section__content');
        expect(content.getAttribute('aria-hidden')).toBe('true');
    });

    // Init section - expandable expanded box - section shows clickable header in border
    it('renders expandable expanded section with clickable header in box', () => {
        const element = createElement('c-section',{ is: Section });
        element.label = 'Expandable Expanded Section with Box';
        element.expandable = true;
        element.isOpen = true;
        element.boxContent = true;
        document.body.appendChild(element);

        const section = element.shadowRoot.querySelector('.slds-section');
        expect(section.classList.contains('slds-box')).toBe(true);

        const button = element.shadowRoot.querySelector('button.slds-section__title-action');
        expect(button).not.toBeNull();

        const content = element.shadowRoot.querySelector('.slds-section__content');
        expect(content.getAttribute('aria-hidden')).toBe('false');
    });
});