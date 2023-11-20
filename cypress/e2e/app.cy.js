describe('App', () => {
	let testData;
	const listName1 = 'Favourite Villagers';
	const listName2 = 'My Town';

	before(() => {
		cy.fixture('testStateData.json').then(fixtureData => {
			testData = fixtureData;
		});
	});

	function loadTestData(key) {
		localStorage.lists = JSON.stringify(testData[key]);
	}

	it('should create two lists', () => {
		cy.visitPage();

		cy.get('#new-list-button').click();
		cy.get('.rename-bar').type(listName1);
		cy.get('#confirm-rename-button').click();

		cy.get('#new-list-button').click();
		cy.get('.rename-bar').type(listName2);
		cy.get('.rename-bar').type('{enter}');

		cy.get('.list').should('have.length', 2);
		cy.get('.list').should('contain', listName1);
		cy.get('.list').should('contain', listName2);
	});

	it('should find and add favourite villagers', () => {
		loadTestData('twoEmptyLists');
		cy.visitPage();

		cy.get('#search-bar').clear().type('Scoot');
		cy.waitForSearchDebounce();
		cy.get('#search-results').get('.result').first()
			.should('contain', 'Scoot')
			.click();

		cy.get('#add-remove-button').click();

		cy.get('.list').first().find('.list-member').should('have.length', 1);
	});

	it('should select list when clicking its title', () => {
		loadTestData('twoEmptyLists');
		cy.visitPage();

		const firstListId = 'a2a2383f-99fa-4546-a809-673b20017b13';
		const secondListId = 'e6243c12-d8e5-40b1-8346-34be7644067f';

		cy.get('#search-results')
			.find('.result')
			.first()
			.click();

		cy.get('.list-title').first().click();
		cy.get('#list-select').should('have.value', firstListId);
		cy.get('.list-title').eq(1).click();
		cy.get('#list-select').should('have.value', secondListId);
	});

	it('should select member when clicking its icon in a list', () => {
		loadTestData('twoLists');
		cy.visitPage();

		const firstListId = 'Uq8VlkaYGJGhlB2YJt7pY';
		const secondListId = 'Qep1wh2jSmuVMBcNTPJbW';

		cy.get('.list .list-member')
			.first()
			.children()
			.first()
			.click();
		cy.get('#list-select').should('have.value', firstListId);
		cy.get('#villager-information').should('contain', 'Scoot');
		cy.get('.list .list-member')
			.eq(1)
			.children()
			.first()
			.click();
		cy.get('#list-select').should('have.value', secondListId);
		cy.get('#villager-information').should('contain', 'Stitches');
	});

	it('should perform the birthday easter egg', () => {
		cy.visitPage();
		cy.clock(Date.UTC(2020, 2, 19), ['Date'])

		cy.get('#search-bar').clear().type('birthday');
		cy.waitForSearchDebounce();
		cy.get('#search-bar').should('have.class', 'birthday');

		cy.get('#search-results').find('.result').first()
			.should('contain', 'Merengue')
			.click();

		cy.get('#birthday-button')
			.should('exist')
			.should('have.css', 'color', 'rgb(255, 105, 180)');
		cy.get('#birthday-button')
			.next()
			.should('have.class', 'birthday');
	});
});
