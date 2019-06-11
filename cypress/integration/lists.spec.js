describe('Lists Section', () => {
    const newList = 'New List';
    const listName = 'My Villagers';
    const otherListName = 'Other List';

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should visit the page', () => {
        cy.visitPage();
    });

    it('should create new list', () => {
        cy.visitPage();
        cy.get('#newlist_button').click();
        cy.get('#confirmrename_button').click();

        cy.get('.list').should('contain', newList);
    });

    it('should create new list with name', () => {
        cy.get('#newlist_button').click();
        cy.get('#rename_bar').type(listName);
        cy.get('#confirmrename_button').click();

        cy.get('.list').should('have.length', 2);
        cy.get('.list').should('contain', listName);
    });

    it('should rename list', () => {
        cy.contains(newList)
            .siblings()
            .get('.listrename_button')
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
            .get('.listdelete_button')
            .first()
            .click();

        cy.get('.list').should('have.length', 1);
        cy.get('.list').should('not.contain', otherListName);
    });

    it('should clear all lists', () => {
        cy.get('#clearlists_button').click();

        cy.get('.list').should('have.length', 0);
        cy.get('#emptylists_prompt').should('exist');
    });
});
