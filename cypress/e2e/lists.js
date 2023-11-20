describe('Lists Section', () => {
	let testData;

	const defaultTitleForNewList = 'New List';
	const oneListTitle = 'My List';
	const twoListTitle = 'Other List';

	before(() => {
		cy.fixture('testStateData.json').then(fixtureData => {
			testData = fixtureData;
		});
	});

	function loadTestData(key) {
		localStorage.lists = JSON.stringify(testData[key]);
		cy.visitPage();
	}

	it('should create new list', () => {
		loadTestData('noLists');

		cy.get('#new-list-button').click();
		cy.get('#confirm-rename-button').click();

		cy.get('.list').should('contain', defaultTitleForNewList);
	});

	it('should create new list after profile has been loaded', () => {
		cy.fixture('../../src/shared/repository/villagers.json').then(villagersArray => {
			loadTestData('noLists');

			const scoot = villagersArray.find(v => v.id === 'Scoot');
			cy.get('#search-bar').clear().type(scoot.name);
			cy.waitForSearchDebounce();
			cy.get('#search-results')
				.find('.result')
				.contains(scoot.name)
				.click();

			cy.get('#new-list-button').click();
			cy.get('#confirm-rename-button').click();

			cy.get('.list').should('contain', defaultTitleForNewList);
			cy.get('#villager-information').should('contain', scoot.name);
			cy.get('#villager-information').should('contain', scoot.species);
			cy.get('#villager-information').should('contain', scoot.personality);
			cy.get('#villager-information').should('contain', scoot.coffee);
			cy.get('#villager-information').should('contain', scoot.birthday);
		});
	});

	it('should create new list with name', () => {
		loadTestData('noLists');

		const listTitle = 'List with Custom Title';

		cy.get('#new-list-button').click();
		cy.get('.rename-bar').type(listTitle);
		cy.get('#confirm-rename-button').click();

		cy.get('.list').should('have.length', 1);
		cy.get('.list').should('contain', listTitle);
	});

	it('should rename list', () => {
		loadTestData('oneList');

		const newListTitle = 'Renamed List';

		cy.contains(oneListTitle)
			.parent()
			.find('.list-rename-button')
			.first().click();

		cy.get('.rename-bar').type(newListTitle);
		cy.get('.rename-bar').type('{enter}');

		cy.get('.list').should('have.length', 1);
		cy.get('.list').should('all.not.contain', oneListTitle);
		cy.get('.list').should('contain', newListTitle);
	});

	it('should delete list', () => {
		loadTestData('twoLists');

		cy.contains(twoListTitle)
			.parent()
			.find('.list-delete-button')
			.first().click();

		cy.get('.list').should('have.length', 1);
		cy.get('.list').should('not.contain', twoListTitle);
	});

	it('should clear all lists', () => {
		loadTestData('twoLists');

		cy.get('#clear-lists-button').click();

		cy.get('.list').should('have.length', 0);
		cy.get('#empty-lists-prompt').should('exist');
	});
});
