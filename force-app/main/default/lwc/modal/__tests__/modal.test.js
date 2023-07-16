import { createElement } from 'lwc';
import Modal from 'c/modal';

describe('c-modal', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('init modal - no uuid - uuid generated', async () => {
        const element = createElement('c-modal', {is: Modal});
        document.body.appendChild(element);
        expect(element.uuid).toBeDefined();
        expect(element.uuid.length).toBeGreaterThan(4);
    });
});