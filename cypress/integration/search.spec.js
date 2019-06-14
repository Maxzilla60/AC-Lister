describe('Search Field', () => {
    it('should visit the page', () => {
        cy.visitPage();
    })

    it('should search and find Scoot', () => {
        cy.get('#search_bar').clear().type('Scoot');
        cy.get('#search_results').find('.result').should('have.length', 1);

        cy.get('.result').should('contain', 'Scoot');
    });

    it('should search for villagers of duplicate names', () => {
        cy.fixture('../../src/util/villagers.json').then(villagersArray => {
            const villagersWithDuplicateNames = villagersArray
                .filter(v => v.id.includes('(2)'))
                .map(v => v.name);

            villagersWithDuplicateNames.forEach(villagerName => {
                cy.get('#search_bar').clear().type(villagerName);
                cy.get('#search_results').find('.result').should('have.length', 2);

                cy.get('.result').should('all.contain', villagerName);
            });
        });
    });

    it('should search and find all alligator species', () => {
        cy.fixture('../../src/util/villagers.json').then(villagersArray => {
            cy.get('#search_bar').clear().type('alligator');
            const amountOfAlligators = villagersArray.filter(v => v.species === 'Alligator').length;

            cy.get('#search_results').find('.result').should('have.length', amountOfAlligators);
        })
    });

    it('should search and find all jock personality', () => {
        cy.fixture('../../src/util/villagers.json').then(villagersArray => {
            cy.get('#search_bar').clear().type('jock');
            const amountOfJocks = villagersArray.filter(v => v.personality === 'Jock').length;

            cy.get('#search_results').find('.result').should('have.length', amountOfJocks);
        })
    });
});
