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

        cy.get('#villager_information').should('contain', randomVillager.name);
        cy.get('#villager_information').should('contain', randomVillager.species);
        cy.get('#villager_information').should('contain', randomVillager.personality);
        cy.get('#villager_information').should('contain', randomVillager.coffee);
        cy.get('#villager_information').should('contain', randomVillager.birthday);
    });
});
