describe('Profile Section', () => {
    let randomVillager;

    beforeEach(() => {
        cy.visitPage();
        cy.fixture('../../src/util/villagers.json').then(villagersArray => {
            randomVillager = villagersArray[Math.floor(Math.random() * villagersArray.length)];;
        });
    })

    it('should load random villager', () => {
        cy.get('#search_bar').clear().type(randomVillager.name);
        cy.get('#search_results').find('.result').click();

        cy.get('#profile').should('contain', randomVillager.name);
        cy.get('#profile').should('contain', randomVillager.species);
        cy.get('#profile').should('contain', randomVillager.personality);
        cy.get('#profile').should('contain', randomVillager.coffee);
        cy.get('#profile').should('contain', randomVillager.birthday);
    });
});
