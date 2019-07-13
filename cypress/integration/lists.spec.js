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

    /* beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    }); */

    it('should create new list', () => {
        loadTestData('noLists');

        cy.get('#newlist_button').click();
        cy.get('#confirmrename_button').click();

        cy.get('.list').should('contain', defaultTitleForNewList);
    });

    it('should create new list after profile has been loaded', () => {
        cy.fixture('../../src/repository/villagers.json').then(villagersArray => {
            loadTestData('noLists');

            const scoot = villagersArray.find(v => v.id === 'Scoot');
            cy.get('#search_bar').clear().type(scoot.name);
            cy.waitForSearchDebounce();
            cy.get('#search_results')
                .find('.result')
                .contains(scoot.name)
                .click();

            cy.get('#newlist_button').click();
            cy.get('#confirmrename_button').click();

            cy.get('.list').should('contain', defaultTitleForNewList);
            cy.get('#villager_information').should('contain', scoot.name);
            cy.get('#villager_information').should('contain', scoot.species);
            cy.get('#villager_information').should('contain', scoot.personality);
            cy.get('#villager_information').should('contain', scoot.coffee);
            cy.get('#villager_information').should('contain', scoot.birthday);
        });
    });

    it('should create new list with name', () => {
        loadTestData('noLists');

        const listTitle = 'List with Custom Title';

        cy.get('#newlist_button').click();
        cy.get('.rename_bar').type(listTitle);
        cy.get('#confirmrename_button').click();

        cy.get('.list').should('have.length', 1);
        cy.get('.list').should('contain', listTitle);
    });

    it('should rename list', () => {
        loadTestData('oneList');

        const newListTitle = 'Renamed List';

        cy.contains(oneListTitle)
            .parent()
            .find('.listrename_button')
            .first().click();

        cy.get('.rename_bar').type(newListTitle);
        cy.get('.rename_bar').type('{enter}');

        cy.get('.list').should('have.length', 1);
        cy.get('.list').should('all.not.contain', oneListTitle);
        cy.get('.list').should('contain', newListTitle);
    });

    it('should delete list', () => {
        loadTestData('twoLists');

        cy.contains(twoListTitle)
            .parent()
            .find('.listdelete_button')
            .first().click();

        cy.get('.list').should('have.length', 1);
        cy.get('.list').should('not.contain', twoListTitle);
    });

    it('should clear all lists', () => {
        loadTestData('twoLists');

        cy.get('#clearlists_button').click();

        cy.get('.list').should('have.length', 0);
        cy.get('#emptylists_prompt').should('exist');
    });
});
