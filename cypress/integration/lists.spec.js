describe('Lists Section', () => {
    const newList = 'New List';
    const listName = 'My Villagers';
    const otherListName = 'Other List';

    beforeEach(() => {
        cy.restoreLocalStorage();
        cy.visitPage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should create new list', () => {
        cy.get('#newlist_button').click();
        cy.get('.fa-check').click();

        cy.get('.list').should('contain', newList);
    });

    it('should create new list with name', () => {
        cy.get('#newlist_button').click();
        cy.get('#rename_bar').type(listName);
        cy.get('#rename_bar').type('{enter}');

        cy.get('.list').should('have.length', 2);
        cy.get('.list').should('contain', listName);
    });

    it('should rename list', () => {
        cy.contains(newList)
            .siblings()
            .get('.fa-pencil')
            .first()
            .click();

        cy.get('#rename_bar').type(otherListName);
        cy.get('#rename_bar').type('{enter}');

        cy.get('.list').should('have.length', 2);
        cy.get('.list').should('all.not.contain', newList);
        cy.get('.list').should('contain', otherListName);
    });

    it('should delete list', () => {
        cy.contains(otherListName)
            .siblings()
            .get('.fa-trash')
            .first()
            .click();

        cy.get('.list').should('have.length', 1);
        cy.get('.list').should('not.contain', otherListName);
    });
});
