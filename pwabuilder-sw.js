// This is the service worker with the Advanced caching
// Generated with https://www.pwabuilder.com/

const CACHE = "pwabuilder-adv-cache";

const precacheFiles = [
	"/public/villager_icons/Ace.gif",
	"/public/villager_icons/Admiral.gif",
	"/public/villager_icons/Agent S.gif",
	"/public/villager_icons/Agnes.gif",
	"/public/villager_icons/Aisle.gif",
	"/public/villager_icons/Al.gif",
	"/public/villager_icons/Alfonso.gif",
	"/public/villager_icons/Alice.gif",
	"/public/villager_icons/Alli.gif",
	"/public/villager_icons/Amelia.gif",
	"/public/villager_icons/Anabelle.gif",
	"/public/villager_icons/Analogue.gif",
	"/public/villager_icons/Anchovy.gif",
	"/public/villager_icons/Angus.gif",
	"/public/villager_icons/Anicotti.gif",
	"/public/villager_icons/Ankha.gif",
	"/public/villager_icons/Annalisa.gif",
	"/public/villager_icons/Annalise.gif",
	"/public/villager_icons/Antonio.gif",
	"/public/villager_icons/Apollo.gif",
	"/public/villager_icons/Apple.gif",
	"/public/villager_icons/Astrid.gif",
	"/public/villager_icons/Aurora.gif",
	"/public/villager_icons/Ava.gif",
	"/public/villager_icons/Avery.gif",
	"/public/villager_icons/Axel.gif",
	"/public/villager_icons/Aziz.gif",
	"/public/villager_icons/Baabara.gif",
	"/public/villager_icons/Bam.gif",
	"/public/villager_icons/Bangle.gif",
	"/public/villager_icons/Barold.gif",
	"/public/villager_icons/Bea.gif",
	"/public/villager_icons/Beardo.gif",
	"/public/villager_icons/Beau.gif",
	"/public/villager_icons/Becky.gif",
	"/public/villager_icons/Bella.gif",
	"/public/villager_icons/Belle.gif",
	"/public/villager_icons/Benedict.gif",
	"/public/villager_icons/Benjamin.gif",
	"/public/villager_icons/Bertha.gif",
	"/public/villager_icons/Bessie.gif",
	"/public/villager_icons/Bettina.gif",
	"/public/villager_icons/Betty.gif",
	"/public/villager_icons/Bianca.gif",
	"/public/villager_icons/Biff.gif",
	"/public/villager_icons/Big Top.gif",
	"/public/villager_icons/Bill.gif",
	"/public/villager_icons/Billy.gif",
	"/public/villager_icons/Biskit.gif",
	"/public/villager_icons/Bitty.gif",
	"/public/villager_icons/Blaire.gif",
	"/public/villager_icons/Blanche.gif",
	"/public/villager_icons/Bluebear.gif",
	"/public/villager_icons/Bob.gif",
	"/public/villager_icons/Bonbon.gif",
	"/public/villager_icons/Bones.gif",
	"/public/villager_icons/Boomer.gif",
	"/public/villager_icons/Boone.gif",
	"/public/villager_icons/Boots.gif",
	"/public/villager_icons/Boris.gif",
	"/public/villager_icons/Bow.gif",
	"/public/villager_icons/Boyd.gif",
	"/public/villager_icons/Bree.gif",
	"/public/villager_icons/Broccolo.gif",
	"/public/villager_icons/Broffina.gif",
	"/public/villager_icons/Bruce.gif",
	"/public/villager_icons/Bubbles.gif",
	"/public/villager_icons/Buck.gif",
	"/public/villager_icons/Bud.gif",
	"/public/villager_icons/Bunnie.gif",
	"/public/villager_icons/Butch.gif",
	"/public/villager_icons/Buzz.gif",
	"/public/villager_icons/Cally.gif",
	"/public/villager_icons/Camofrog.gif",
	"/public/villager_icons/Canberra.gif",
	"/public/villager_icons/Candi.gif",
	"/public/villager_icons/Carmen (2).gif",
	"/public/villager_icons/Carmen.gif",
	"/public/villager_icons/Caroline.gif",
	"/public/villager_icons/Carrie.gif",
	"/public/villager_icons/Carrot.gif",
	"/public/villager_icons/Cashmere.gif",
	"/public/villager_icons/Celia.gif",
	"/public/villager_icons/Cesar.gif",
	"/public/villager_icons/Chadder.gif",
	"/public/villager_icons/Chai.gif",
	"/public/villager_icons/Champ.gif",
	"/public/villager_icons/Champagne.gif",
	"/public/villager_icons/Charlise.gif",
	"/public/villager_icons/Chelsea.gif",
	"/public/villager_icons/Cheri.gif",
	"/public/villager_icons/Cherry.gif",
	"/public/villager_icons/Chester.gif",
	"/public/villager_icons/Chevre.gif",
	"/public/villager_icons/Chico.gif",
	"/public/villager_icons/Chief.gif",
	"/public/villager_icons/Chops.gif",
	"/public/villager_icons/Chow.gif",
	"/public/villager_icons/Chrissy.gif",
	"/public/villager_icons/Chuck.gif",
	"/public/villager_icons/Clara.gif",
	"/public/villager_icons/Claude.gif",
	"/public/villager_icons/Claudia.gif",
	"/public/villager_icons/Clay.gif",
	"/public/villager_icons/Cleo.gif",
	"/public/villager_icons/Clyde.gif",
	"/public/villager_icons/Coach.gif",
	"/public/villager_icons/Cobb.gif",
	"/public/villager_icons/Coco.gif",
	"/public/villager_icons/Cole.gif",
	"/public/villager_icons/Colton.gif",
	"/public/villager_icons/Cookie.gif",
	"/public/villager_icons/Cousteau.gif",
	"/public/villager_icons/Cranston.gif",
	"/public/villager_icons/Croque.gif",
	"/public/villager_icons/Cube.gif",
	"/public/villager_icons/Cupcake.gif",
	"/public/villager_icons/Curlos.gif",
	"/public/villager_icons/Curly.gif",
	"/public/villager_icons/Curt.gif",
	"/public/villager_icons/Cyrano.gif",
	"/public/villager_icons/Daisy.gif",
	"/public/villager_icons/Deena.gif",
	"/public/villager_icons/default.gif",
	"/public/villager_icons/Deirdre.gif",
	"/public/villager_icons/Del.gif",
	"/public/villager_icons/Deli.gif",
	"/public/villager_icons/Derwin.gif",
	"/public/villager_icons/desktop.ini",
	"/public/villager_icons/Diana.gif",
	"/public/villager_icons/Diva.gif",
	"/public/villager_icons/Dizzy.gif",
	"/public/villager_icons/Dobie.gif",
	"/public/villager_icons/Doc.gif",
	"/public/villager_icons/Dora.gif",
	"/public/villager_icons/Dotty.gif",
	"/public/villager_icons/Dozer.gif",
	"/public/villager_icons/Drago.gif",
	"/public/villager_icons/Drake.gif",
	"/public/villager_icons/Drift.gif",
	"/public/villager_icons/Ed.gif",
	"/public/villager_icons/Egbert.gif",
	"/public/villager_icons/Elina.gif",
	"/public/villager_icons/Elise.gif",
	"/public/villager_icons/Ellie.gif",
	"/public/villager_icons/Elmer.gif",
	"/public/villager_icons/Eloise.gif",
	"/public/villager_icons/Elvis.gif",
	"/public/villager_icons/Emerald.gif",
	"/public/villager_icons/Erik.gif",
	"/public/villager_icons/Etoile.gif",
	"/public/villager_icons/Eugene.gif",
	"/public/villager_icons/Eunice.gif",
	"/public/villager_icons/Faith.gif",
	"/public/villager_icons/Fang.gif",
	"/public/villager_icons/Fauna.gif",
	"/public/villager_icons/Felicity.gif",
	"/public/villager_icons/Felyne.gif",
	"/public/villager_icons/Filbert.gif",
	"/public/villager_icons/Filly.gif",
	"/public/villager_icons/Flash.gif",
	"/public/villager_icons/Flip.gif",
	"/public/villager_icons/Flo.gif",
	"/public/villager_icons/Flora.gif",
	"/public/villager_icons/Flossie.gif",
	"/public/villager_icons/Flurry.gif",
	"/public/villager_icons/Francine.gif",
	"/public/villager_icons/Frank.gif",
	"/public/villager_icons/Freckles.gif",
	"/public/villager_icons/Freya.gif",
	"/public/villager_icons/Friga.gif",
	"/public/villager_icons/Frita.gif",
	"/public/villager_icons/Frobert.gif",
	"/public/villager_icons/Fruity.gif",
	"/public/villager_icons/Fuchsia.gif",
	"/public/villager_icons/Gabi.gif",
	"/public/villager_icons/Gala.gif",
	"/public/villager_icons/Gaston.gif",
	"/public/villager_icons/Gayle.gif",
	"/public/villager_icons/Gen.gif",
	"/public/villager_icons/Genji.gif",
	"/public/villager_icons/Gigi.gif",
	"/public/villager_icons/Gladys.gif",
	"/public/villager_icons/Gloria.gif",
	"/public/villager_icons/Goldie.gif",
	"/public/villager_icons/Gonzo.gif",
	"/public/villager_icons/Goose.gif",
	"/public/villager_icons/Graham.gif",
	"/public/villager_icons/Greta.gif",
	"/public/villager_icons/Grizzly.gif",
	"/public/villager_icons/Groucho.gif",
	"/public/villager_icons/Gruff.gif",
	"/public/villager_icons/Gwen.gif",
	"/public/villager_icons/Hambo.gif",
	"/public/villager_icons/Hamlet.gif",
	"/public/villager_icons/Hamphrey.gif",
	"/public/villager_icons/Hank.gif",
	"/public/villager_icons/Hans.gif",
	"/public/villager_icons/Harry.gif",
	"/public/villager_icons/Hazel.gif",
	"/public/villager_icons/Hector.gif",
	"/public/villager_icons/Henry.gif",
	"/public/villager_icons/Hippeux.gif",
	"/public/villager_icons/Hopkins.gif",
	"/public/villager_icons/Hopper.gif",
	"/public/villager_icons/Hornsby.gif",
	"/public/villager_icons/Huck.gif",
	"/public/villager_icons/Huggy.gif",
	"/public/villager_icons/Hugh.gif",
	"/public/villager_icons/Iggly.gif",
	"/public/villager_icons/Iggy.gif",
	"/public/villager_icons/Ike.gif",
	"/public/villager_icons/Jacob.gif",
	"/public/villager_icons/Jacques.gif",
	"/public/villager_icons/Jambette.gif",
	"/public/villager_icons/Jane.gif",
	"/public/villager_icons/Jay.gif",
	"/public/villager_icons/Jeremiah.gif",
	"/public/villager_icons/Jitters.gif",
	"/public/villager_icons/Joe.gif",
	"/public/villager_icons/Joey.gif",
	"/public/villager_icons/Jubei.gif",
	"/public/villager_icons/Julia.gif",
	"/public/villager_icons/Julian.gif",
	"/public/villager_icons/June.gif",
	"/public/villager_icons/Kabuki.gif",
	"/public/villager_icons/Katt.gif",
	"/public/villager_icons/Keaton.gif",
	"/public/villager_icons/Ken.gif",
	"/public/villager_icons/Ketchup.gif",
	"/public/villager_icons/Kevin.gif",
	"/public/villager_icons/Kid Cat.gif",
	"/public/villager_icons/Kidd.gif",
	"/public/villager_icons/Kiki.gif",
	"/public/villager_icons/Kit.gif",
	"/public/villager_icons/Kitt.gif",
	"/public/villager_icons/Kitty.gif",
	"/public/villager_icons/Klaus.gif",
	"/public/villager_icons/Knox.gif",
	"/public/villager_icons/Kody.gif",
	"/public/villager_icons/Koharu.gif",
	"/public/villager_icons/Kyle.gif",
	"/public/villager_icons/Leigh.gif",
	"/public/villager_icons/Leonardo.gif",
	"/public/villager_icons/Leopold.gif",
	"/public/villager_icons/Lily.gif",
	"/public/villager_icons/Limberg.gif",
	"/public/villager_icons/Lionel.gif",
	"/public/villager_icons/Liz.gif",
	"/public/villager_icons/Lobo.gif",
	"/public/villager_icons/Lolly.gif",
	"/public/villager_icons/Lopez.gif",
	"/public/villager_icons/Louie.gif",
	"/public/villager_icons/Lucha.gif",
	"/public/villager_icons/Lucky.gif",
	"/public/villager_icons/Lucy.gif",
	"/public/villager_icons/Lulu (2).gif",
	"/public/villager_icons/Lulu.gif",
	"/public/villager_icons/Lyman.gif",
	"/public/villager_icons/Mac.gif",
	"/public/villager_icons/Madam Rosa.gif",
	"/public/villager_icons/Maddie.gif",
	"/public/villager_icons/Maelle.gif",
	"/public/villager_icons/Maggie.gif",
	"/public/villager_icons/Mallary.gif",
	"/public/villager_icons/Maple.gif",
	"/public/villager_icons/Marcel.gif",
	"/public/villager_icons/Marcie.gif",
	"/public/villager_icons/Marcy.gif",
	"/public/villager_icons/Margie.gif",
	"/public/villager_icons/Marina.gif",
	"/public/villager_icons/Marshal.gif",
	"/public/villager_icons/Marty.gif",
	"/public/villager_icons/Masa.gif",
	"/public/villager_icons/Mathilda.gif",
	"/public/villager_icons/Megumi.gif",
	"/public/villager_icons/Melba.gif",
	"/public/villager_icons/Meow.gif",
	"/public/villager_icons/Merengue.gif",
	"/public/villager_icons/Merry.gif",
	"/public/villager_icons/Midge.gif",
	"/public/villager_icons/Mint.gif",
	"/public/villager_icons/Mira.gif",
	"/public/villager_icons/Miranda.gif",
	"/public/villager_icons/Mitzi.gif",
	"/public/villager_icons/Moe.gif",
	"/public/villager_icons/Molly.gif",
	"/public/villager_icons/Monique.gif",
	"/public/villager_icons/Monty.gif",
	"/public/villager_icons/Moose.gif",
	"/public/villager_icons/Mott.gif",
	"/public/villager_icons/Muffy.gif",
	"/public/villager_icons/Murphy.gif",
	"/public/villager_icons/Nan.gif",
	"/public/villager_icons/Nana.gif",
	"/public/villager_icons/Naomi.gif",
	"/public/villager_icons/Nate.gif",
	"/public/villager_icons/Nibbles.gif",
	"/public/villager_icons/Nindori.gif",
	"/public/villager_icons/Nobuo.gif",
	"/public/villager_icons/Norma.gif",
	"/public/villager_icons/Nosegay.gif",
	"/public/villager_icons/Octavian.gif",
	"/public/villager_icons/OHare.gif",
	"/public/villager_icons/Olaf.gif",
	"/public/villager_icons/Olive.gif",
	"/public/villager_icons/Olivia.gif",
	"/public/villager_icons/Opal.gif",
	"/public/villager_icons/Otis.gif",
	"/public/villager_icons/Oxford.gif",
	"/public/villager_icons/Ozzie.gif",
	"/public/villager_icons/Pancetti.gif",
	"/public/villager_icons/Pango.gif",
	"/public/villager_icons/Paolo.gif",
	"/public/villager_icons/Papi.gif",
	"/public/villager_icons/Pashmina.gif",
	"/public/villager_icons/Pate.gif",
	"/public/villager_icons/Patricia.gif",
	"/public/villager_icons/Patty.gif",
	"/public/villager_icons/Paula.gif",
	"/public/villager_icons/Peaches.gif",
	"/public/villager_icons/Peanut.gif",
	"/public/villager_icons/Pecan.gif",
	"/public/villager_icons/Peck.gif",
	"/public/villager_icons/Peewee.gif",
	"/public/villager_icons/Peggy.gif",
	"/public/villager_icons/Pekoe.gif",
	"/public/villager_icons/Penelope.gif",
	"/public/villager_icons/Penny.gif",
	"/public/villager_icons/Petunia (2).gif",
	"/public/villager_icons/Petunia.gif",
	"/public/villager_icons/Phil.gif",
	"/public/villager_icons/Phoebe.gif",
	"/public/villager_icons/Pierce.gif",
	"/public/villager_icons/Pierre.gif",
	"/public/villager_icons/Pietro.gif",
	"/public/villager_icons/Pigleg.gif",
	"/public/villager_icons/Pinky.gif",
	"/public/villager_icons/Piper.gif",
	"/public/villager_icons/Pippy.gif",
	"/public/villager_icons/Pironkon.gif",
	"/public/villager_icons/Plucky.gif",
	"/public/villager_icons/Poko.gif",
	"/public/villager_icons/Pompom.gif",
	"/public/villager_icons/Poncho.gif",
	"/public/villager_icons/Poppy.gif",
	"/public/villager_icons/Portia.gif",
	"/public/villager_icons/Prince.gif",
	"/public/villager_icons/Puck.gif",
	"/public/villager_icons/Puddles.gif",
	"/public/villager_icons/Pudge.gif",
	"/public/villager_icons/Punchy.gif",
	"/public/villager_icons/Purrl.gif",
	"/public/villager_icons/Queenie.gif",
	"/public/villager_icons/Quetzal.gif",
	"/public/villager_icons/Quillson.gif",
	"/public/villager_icons/Raddle.gif",
	"/public/villager_icons/Rasher.gif",
	"/public/villager_icons/Renee.gif",
	"/public/villager_icons/Rex.gif",
	"/public/villager_icons/Rhoda.gif",
	"/public/villager_icons/Rhonda.gif",
	"/public/villager_icons/Ribbot.gif",
	"/public/villager_icons/Ricky.gif",
	"/public/villager_icons/Rilla.gif",
	"/public/villager_icons/Rio.gif",
	"/public/villager_icons/Rizzo.gif",
	"/public/villager_icons/Roald.gif",
	"/public/villager_icons/Robin.gif",
	"/public/villager_icons/Rocco.gif",
	"/public/villager_icons/Rocket.gif",
	"/public/villager_icons/Rod.gif",
	"/public/villager_icons/Rodeo.gif",
	"/public/villager_icons/Rodney.gif",
	"/public/villager_icons/Rolf.gif",
	"/public/villager_icons/Rollo.gif",
	"/public/villager_icons/Rooney.gif",
	"/public/villager_icons/Rory.gif",
	"/public/villager_icons/Roscoe.gif",
	"/public/villager_icons/Rosie.gif",
	"/public/villager_icons/Rowan.gif",
	"/public/villager_icons/Ruby.gif",
	"/public/villager_icons/Rudy.gif",
	"/public/villager_icons/Sally.gif",
	"/public/villager_icons/Samson.gif",
	"/public/villager_icons/Sandy.gif",
	"/public/villager_icons/Savannah.gif",
	"/public/villager_icons/Scoot.gif",
	"/public/villager_icons/Shari.gif",
	"/public/villager_icons/Sheldon.gif",
	"/public/villager_icons/Shep.gif",
	"/public/villager_icons/Shinabiru.gif",
	"/public/villager_icons/Shoukichi.gif",
	"/public/villager_icons/Simon.gif",
	"/public/villager_icons/Skye.gif",
	"/public/villager_icons/Sly.gif",
	"/public/villager_icons/Snake.gif",
	"/public/villager_icons/Snooty.gif",
	"/public/villager_icons/Soleil.gif",
	"/public/villager_icons/Sparro.gif",
	"/public/villager_icons/Spike.gif",
	"/public/villager_icons/Spork.gif",
	"/public/villager_icons/Sprinkle.gif",
	"/public/villager_icons/Sprocket.gif",
	"/public/villager_icons/Static.gif",
	"/public/villager_icons/Stella.gif",
	"/public/villager_icons/Sterling.gif",
	"/public/villager_icons/Stinky.gif",
	"/public/villager_icons/Stitches.gif",
	"/public/villager_icons/Stu.gif",
	"/public/villager_icons/Sue E..gif",
	"/public/villager_icons/Sunny.gif",
	"/public/villager_icons/Sven.gif",
	"/public/villager_icons/Sydney.gif",
	"/public/villager_icons/Sylvana.gif",
	"/public/villager_icons/Sylvia.gif",
	"/public/villager_icons/T-Bone.gif",
	"/public/villager_icons/Tabby.gif",
	"/public/villager_icons/Tad.gif",
	"/public/villager_icons/Tammi.gif",
	"/public/villager_icons/Tammy.gif",
	"/public/villager_icons/Tangy.gif",
	"/public/villager_icons/Tank.gif",
	"/public/villager_icons/Tarou.gif",
	"/public/villager_icons/Tasha.gif",
	"/public/villager_icons/Teddy.gif",
	"/public/villager_icons/Tex.gif",
	"/public/villager_icons/Tia.gif",
	"/public/villager_icons/Tiara.gif",
	"/public/villager_icons/Tiffany.gif",
	"/public/villager_icons/Timbra.gif",
	"/public/villager_icons/Tipper.gif",
	"/public/villager_icons/Toby.gif",
	"/public/villager_icons/Tom.gif",
	"/public/villager_icons/Truffles.gif",
	"/public/villager_icons/Tucker.gif",
	"/public/villager_icons/Tutu.gif",
	"/public/villager_icons/Twiggy.gif",
	"/public/villager_icons/Twirp.gif",
	"/public/villager_icons/Tybalt.gif",
	"/public/villager_icons/Ursula.gif",
	"/public/villager_icons/Valise.gif",
	"/public/villager_icons/Velma.gif",
	"/public/villager_icons/Verdun.gif",
	"/public/villager_icons/Vesta.gif",
	"/public/villager_icons/Vic.gif",
	"/public/villager_icons/Victoria.gif",
	"/public/villager_icons/Violet.gif",
	"/public/villager_icons/Vivian.gif",
	"/public/villager_icons/Vladimir.gif",
	"/public/villager_icons/Wade.gif",
	"/public/villager_icons/Walker.gif",
	"/public/villager_icons/Walt.gif",
	"/public/villager_icons/Wart Jr.gif",
	"/public/villager_icons/Weber.gif",
	"/public/villager_icons/Wendy.gif",
	"/public/villager_icons/Whitney.gif",
	"/public/villager_icons/Willow.gif",
	"/public/villager_icons/Winnie.gif",
	"/public/villager_icons/Wolfgang.gif",
	"/public/villager_icons/Woolio.gif",
	"/public/villager_icons/Yodel.gif",
	"/public/villager_icons/Yuka.gif",
	"/public/villager_icons/Zell.gif",
	"/public/villager_icons/Zoe.gif",
	"/public/villager_icons/Zucker.gif",
];

const offlineFallbackPage = "index.html";

const networkFirstPaths = [
	/* Add an array of regex of paths that should go network first */
	// Example: /\/api\/.*/
];

const avoidCachingPaths = [
	/* Add an array of regex of paths that shouldn't be cached */
	// Example: /\/api\/.*/
];

function pathComparer(requestUrl, pathRegEx) {
	return requestUrl.match(new RegExp(pathRegEx));
}

function comparePaths(requestUrl, pathsArray) {
	if (requestUrl) {
		for (let index = 0; index < pathsArray.length; index++) {
			const pathRegEx = pathsArray[index];
			if (pathComparer(requestUrl, pathRegEx)) {
				return true;
			}
		}
	}

	return false;
}

self.addEventListener("install", function (event) {
	console.log("[PWA Builder] Install Event processing");

	console.log("[PWA Builder] Skip waiting on install");
	self.skipWaiting();

	event.waitUntil(
		caches.open(CACHE).then(function (cache) {
			console.log("[PWA Builder] Caching pages during install");

			return cache.addAll(precacheFiles).then(function () {
				return cache.add(offlineFallbackPage);
			});
		})
	);
});

// Allow sw to control of current page
self.addEventListener("activate", function (event) {
	console.log("[PWA Builder] Claiming clients for current page");
	event.waitUntil(self.clients.claim());
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) {
	if (event.request.method !== "GET") return;

	if (comparePaths(event.request.url, networkFirstPaths)) {
		networkFirstFetch(event);
	} else {
		cacheFirstFetch(event);
	}
});

function cacheFirstFetch(event) {
	event.respondWith(
		fromCache(event.request).then(
			function (response) {
				// The response was found in the cache so we responde with it and update the entry

				// This is where we call the server to get the newest version of the
				// file to use the next time we show view
				event.waitUntil(
					fetch(event.request).then(function (response) {
						return updateCache(event.request, response);
					})
				);

				return response;
			},
			function () {
				// The response was not found in the cache so we look for it on the server
				return fetch(event.request)
					.then(function (response) {
						// If request was success, add or update it in the cache
						event.waitUntil(updateCache(event.request, response.clone()));

						return response;
					})
					.catch(function (error) {
						// The following validates that the request was for a navigation to a new document
						if (event.request.destination !== "document" || event.request.mode !== "navigate") {
							return;
						}

						console.log("[PWA Builder] Network request failed and no cache." + error);
						// Use the precached offline page as fallback
						return caches.open(CACHE).then(function (cache) {
							cache.match(offlineFallbackPage);
						});
					});
			}
		)
	);
}

function networkFirstFetch(event) {
	event.respondWith(
		fetch(event.request)
			.then(function (response) {
				// If request was success, add or update it in the cache
				event.waitUntil(updateCache(event.request, response.clone()));
				return response;
			})
			.catch(function (error) {
				console.log("[PWA Builder] Network request Failed. Serving content from cache: " + error);
				return fromCache(event.request);
			})
	);
}

function fromCache(request) {
	// Check to see if you have it in the cache
	// Return response
	// If not in the cache, then return error page
	return caches.open(CACHE).then(function (cache) {
		return cache.match(request).then(function (matching) {
			if (!matching || matching.status === 404) {
				return Promise.reject("no-match");
			}

			return matching;
		});
	});
}

function updateCache(request, response) {
	if (!comparePaths(request.url, avoidCachingPaths)) {
		return caches.open(CACHE).then(function (cache) {
			return cache.put(request, response);
		});
	}

	return Promise.resolve();
}
