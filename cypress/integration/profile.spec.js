describe('Profile Section', () => {
	let testData;
	const oneListTitle = 'My List';
	const superHeroVillagers = [
		'Agent S',
		'Kid Cat',
		'Big Top',
		'Rocket',
		'Filly'
	]

	function loadTestData(key) {
		localStorage.lists = JSON.stringify(testData[key]);
		cy.visitPage();
	}

	function getRandomVillager(villagersArray) {
		let randomVillager;
		do {
			randomVillager = villagersArray[Math.floor(Math.random() * villagersArray.length)];
		} while (randomVillager.id.includes('(2)'))
		return randomVillager;
	}

	before(() => {
		cy.fixture('testStateData.json').then(fixtureData => {
			testData = fixtureData;
		});
	});

	it('should load random villager', () => {
		cy.fixture('../../src/repository/villagers.json').then(villagersArray => {
			loadTestData('noLists');

			const randomVillager = getRandomVillager(villagersArray);
			cy.get('#search_bar').clear().type(randomVillager.name);
			cy.waitForSearchDebounce();
			cy.get('#search_results')
				.find('.result')
				.contains(randomVillager.name)
				.click();

			cy.get('#villager_information').should('contain', randomVillager.name);
			cy.get('#villager_information').should('contain', randomVillager.species);
			cy.get('#villager_information').should('contain', randomVillager.personality);
			cy.get('#villager_information').should('contain', randomVillager.coffee);
			cy.get('#villager_information').should('contain', randomVillager.birthday);
		});
	});

	it('should add multiple villagers to one list', () => {
		loadTestData('oneEmptyList');

		superHeroVillagers.forEach(v => {
			cy.get('#search_bar').clear().type(v);
			cy.waitForSearchDebounce();
			cy.get('#search_results').find('.result').first().click();
			cy.get('#add_remove_button').click();
		});

		cy.contains(oneListTitle)
			.parent().siblings()
			.find('.list_member')
			.should('have.length', superHeroVillagers.length);
	});

	it('should add random villager to different lists', () => {
		cy.fixture('../../src/repository/villagers.json').then(villagersArray => {
			loadTestData('twoEmptyLists');
			const firstListID = testData['twoEmptyLists'][0].id;
			const firstListTitle = testData['twoEmptyLists'][0].title;
			const secondListID = testData['twoEmptyLists'][1].id;
			const secondListTitle = testData['twoEmptyLists'][1].title;

			const randomVillager = getRandomVillager(villagersArray);
			cy.get('#search_bar').clear().type(randomVillager.name);
			cy.waitForSearchDebounce();
			cy.get('#search_results').find('.result').first().click();

			cy.get('#list_select').should('have.value', firstListID);
			cy.get('#add_remove_button').click();

			cy.get('#list_select').select(secondListID);
			cy.get('#add_remove_button').click();

			cy.contains(firstListTitle)
				.parent().siblings()
				.find('.list_member')
				.should('have.attr', 'title')
				.and('equal', randomVillager.name);
			cy.contains(secondListTitle)
				.parent().siblings()
				.find('.list_member')
				.should('have.attr', 'title')
				.and('equal', randomVillager.name);
		});
	});

	it('should remove villager from list', () => {
		loadTestData('oneList');
		const firstListID = testData['twoEmptyLists'][0].id;
		const firstListTitle = testData['oneList'][0].title;

		cy.contains(firstListTitle)
			.parent().siblings()
			.find('li > button')
			.click();
		cy.get('#list_select').should('have.value', firstListID);

		cy.get('#add_remove_button').click();

		cy.contains(firstListTitle)
			.parent().siblings()
			.find('.list_member')
			.should('have.length', 0);
	});
});
