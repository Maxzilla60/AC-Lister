describe('Search Field', () => {
	beforeEach(() => {
		cy.visitPage();
	})

	it('should search and find Scoot', () => {
		cy.get('#search-bar').clear().type('Scoot');
		cy.waitForSearchDebounce();
		cy.get('#search-results').find('.result').should('have.length', 1);

		cy.get('.result').should('contain', 'Scoot');
	});

	it('should search for villagers of duplicate names', () => {
		cy.fixture('../../src/shared/repository/villagers.json').then(villagersArray => {
			const villagersWithDuplicateNames = villagersArray
				.filter(v => v.id.includes('(2)'))
				.map(v => v.name);

			villagersWithDuplicateNames.forEach(villagerName => {
				cy.get('#search-bar').clear().type(villagerName);
				cy.waitForSearchDebounce();
				cy.get('#search-results').find('.result').should('have.length', 2);

				cy.get('.result').should('all.contain', villagerName);
			});
		});
	});

	it('should search and find all alligator species', () => {
		cy.fixture('../../src/shared/repository/villagers.json').then(villagersArray => {
			cy.get('#search-bar').clear().type('alligator');
			cy.waitForSearchDebounce();
			const amountOfAlligators = villagersArray.filter(v => v.species === 'Alligator').length;

			cy.get('#search-results').find('.result').should('have.length', amountOfAlligators);
		})
	});

	it('should search and find all jock personality', () => {
		cy.fixture('../../src/shared/repository/villagers.json').then(villagersArray => {
			cy.get('#search-bar').clear().type('jock');
			cy.waitForSearchDebounce();
			const amountOfJocks = villagersArray.filter(v => v.personality === 'Jock').length;

			cy.get('#search-results').find('.result').should('have.length', amountOfJocks);
		})
	});

	it('should search and find all sisterly personality', () => {
		cy.fixture('../../src/shared/repository/villagers.json').then(villagersArray => {
			cy.get('#search-bar').clear().type('sisterly');
			cy.waitForSearchDebounce();
			const amountOfJocks = villagersArray.filter(v => v.personality === 'Sisterly').length;

			cy.get('#search-results').find('.result').should('have.length', amountOfJocks);
		})
	});
});
