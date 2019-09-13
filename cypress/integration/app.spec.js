describe('App', () => {
	const listName1 = 'Favourite Villagers';
	const listName2 = 'My Town';

	beforeEach(() => {
		cy.restoreLocalStorage();
	});

	afterEach(() => {
		cy.saveLocalStorage();
	});

	it('should visit the page', () => {
		cy.visitPage();
	});

	it('should create two lists', () => {
		cy.get('#newlist_button').click();
		cy.get('.rename_bar').type(listName1);
		cy.get('#confirmrename_button').click();

		cy.get('#newlist_button').click();
		cy.get('.rename_bar').type(listName2);
		cy.get('.rename_bar').type('{enter}');

		cy.get('.list').should('have.length', 2);
		cy.get('.list').should('contain', listName1);
		cy.get('.list').should('contain', listName2);
	});

	it('should find and add favourite villagers', () => {
		cy.get('#search_bar').clear().type('Scoot');
		cy.waitForSearchDebounce();
		cy.get('#search_results').get('.result').first()
			.should('contain', 'Scoot')
			.click();

		cy.get('#add_remove_button').click();

		cy.get('.list').first().find('.list_member').should('have.length', 1);
	});
});
