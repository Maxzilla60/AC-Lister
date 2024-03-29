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
		cy.fixture('../../src/shared/repository/villagers.json').then(villagersArray => {
			loadTestData('noLists');

			const randomVillager = getRandomVillager(villagersArray);
			cy.get('#search-bar').clear().type(randomVillager.name);
			cy.waitForSearchDebounce();
			cy.get('#search-results')
				.find('.result')
				.contains(randomVillager.name)
				.click();

			cy.get('#villager-information').should('contain', randomVillager.name);
			cy.get('#villager-information').should('contain', randomVillager.species);
			cy.get('#villager-information').should('contain', randomVillager.personality);
			cy.get('#villager-information').should('contain', randomVillager.coffee);
			cy.get('#villager-information').should('contain', randomVillager.birthday);
		});
	});

	it('should add multiple villagers to one list', () => {
		loadTestData('oneEmptyList');

		superHeroVillagers.forEach(v => {
			cy.get('#search-bar').clear().type(v);
			cy.waitForSearchDebounce();
			cy.get('#search-results').find('.result').first().click();
			cy.get('#add-remove-button').click();
		});

		cy.contains(oneListTitle)
			.parent().siblings()
			.find('.list-member')
			.should('have.length', superHeroVillagers.length);
	});

	it('should add random villager to different lists', () => {
		cy.fixture('../../src/shared/repository/villagers.json').then(villagersArray => {
			loadTestData('twoEmptyLists');
			const firstListID = testData['twoEmptyLists'][0].id;
			const firstListTitle = testData['twoEmptyLists'][0].title;
			const secondListID = testData['twoEmptyLists'][1].id;
			const secondListTitle = testData['twoEmptyLists'][1].title;

			const randomVillagerName = getRandomVillager(villagersArray).name;
			cy.get('#search-bar').clear().type(randomVillagerName);
			cy.waitForSearchDebounce();
			cy.get('#search-results').find('.result').first().click();

			cy.get('#list-select').should('have.value', firstListID);
			cy.get('#add-remove-button').click();
			cy.get('#list-select').should('have.value', firstListID);

			cy.get('#list-select').select(secondListID);
			cy.get('#add-remove-button').click();
			cy.get('#list-select').should('have.value', secondListID);

			cy.contains(firstListTitle)
				.parent().siblings()
				.find('.list-member')
				.should('have.attr', 'title')
				.and((innerText) =>
					expect(innerText.toLowerCase()).to.have.string(randomVillagerName.toLowerCase())
				);
			cy.contains(secondListTitle)
				.parent().siblings()
				.find('.list-member')
				.should('have.attr', 'title')
				.and((innerText) =>
					expect(innerText.toLowerCase()).to.have.string(randomVillagerName.toLowerCase())
				);
		});
	});

	it('should remove villager from list', () => {
		loadTestData('oneList');
		const firstListTitle = testData['oneList'][0].title;

		cy.contains(firstListTitle)
			.parent().siblings()
			.find('li > button')
			.click();

		cy.get('#add-remove-button').click();

		cy.contains(firstListTitle)
			.parent().siblings()
			.find('.list-member')
			.should('have.length', 0);
	});
});
