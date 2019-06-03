// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/util/util.ts":[function(require,module,exports) {
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

Object.defineProperty(exports, "__esModule", {
  value: true
});

function getElement(elementID) {
  return document.getElementById(elementID);
}

exports.getElement = getElement;

function clearElement(element) {
  element.innerHTML = '';
}

exports.clearElement = clearElement; // Trim '(2)' from name for duplicate names

function trimName(name) {
  return name.replace(' (2)', '');
}

exports.trimName = trimName;

function aBreakElement() {
  return document.createElement('br');
}

exports.aBreakElement = aBreakElement;

function villagerHasProfileImage(villager) {
  return villager.head !== 'wip.jpg';
}

exports.villagerHasProfileImage = villagerHasProfileImage;

function birthdayIsToday(birthdayString) {
  var today = new Date();
  var birthday = new Date(birthdayString);
  return today.getDate() === birthday.getDate() && today.getMonth() === birthday.getMonth();
}

exports.birthdayIsToday = birthdayIsToday;

function getListSelectValue() {
  return getElement('list_select').value;
}

exports.getListSelectValue = getListSelectValue;

function removeDuplicates(results) {
  return _toConsumableArray(new Set(results));
}

exports.removeDuplicates = removeDuplicates;
},{}],"node_modules/uuid/lib/rng-browser.js":[function(require,module,exports) {
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

},{}],"node_modules/uuid/lib/bytesToUuid.js":[function(require,module,exports) {
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;

},{}],"node_modules/uuid/v1.js":[function(require,module,exports) {
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;

},{"./lib/rng":"node_modules/uuid/lib/rng-browser.js","./lib/bytesToUuid":"node_modules/uuid/lib/bytesToUuid.js"}],"node_modules/uuid/v4.js":[function(require,module,exports) {
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

},{"./lib/rng":"node_modules/uuid/lib/rng-browser.js","./lib/bytesToUuid":"node_modules/uuid/lib/bytesToUuid.js"}],"node_modules/uuid/index.js":[function(require,module,exports) {
var v1 = require('./v1');
var v4 = require('./v4');

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;

},{"./v1":"node_modules/uuid/v1.js","./v4":"node_modules/uuid/v4.js"}],"src/util/state.service.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var util_1 = require("../util/util");

var uuid_1 = require("uuid");

var StateService =
/*#__PURE__*/
function () {
  function StateService() {
    _classCallCheck(this, StateService);

    this._currentListSelect = '';
    this._currentProfile = '';
  }

  _createClass(StateService, [{
    key: "getLists",
    value: function getLists() {
      return this._lists;
    }
  }, {
    key: "getListById",
    value: function getListById(id) {
      return this._lists.find(function (l) {
        return l.id === id;
      });
    }
  }, {
    key: "addNewList",
    value: function addNewList() {
      var newId = uuid_1.v4();
      var tempLists = this._lists;
      tempLists.push({
        title: 'New List',
        id: newId,
        members: []
      });
      this._lists = tempLists;
      return newId;
    }
  }, {
    key: "renameList",
    value: function renameList(listId, newTitle) {
      var tempLists = this._lists;
      tempLists.find(function (l) {
        return l.id === listId;
      }).title = newTitle;
      this._lists = tempLists;
    }
  }, {
    key: "deleteList",
    value: function deleteList(id) {
      this._lists = this._lists.filter(function (l) {
        return l.id !== id;
      });
    }
  }, {
    key: "clearAllLists",
    value: function clearAllLists() {
      this._lists = [];
    }
  }, {
    key: "addVillagerToList",
    value: function addVillagerToList(villagerNameToAdd, listId) {
      var tempLists = this._lists;
      var listToAddTo = tempLists.find(function (l) {
        return l.id === listId;
      });
      listToAddTo.members.push(villagerNameToAdd);
      listToAddTo.members.sort();
      this._lists = tempLists;
    }
  }, {
    key: "removeVillagerFromList",
    value: function removeVillagerFromList(villagerNameToRemove, listId) {
      var tempLists = this._lists;
      var listToRemoveFrom = tempLists.find(function (l) {
        return l.id === listId;
      });
      listToRemoveFrom.members = listToRemoveFrom.members.filter(function (v) {
        return v !== villagerNameToRemove;
      });
      this._lists = tempLists;
    }
  }, {
    key: "listsAreEmpty",
    value: function listsAreEmpty() {
      return this._lists.length <= 0;
    }
  }, {
    key: "villagerIsInList",
    value: function villagerIsInList(villagerName, listId) {
      return !this.listsAreEmpty() && this.getListById(listId).members.includes(villagerName);
    }
  }, {
    key: "aProfileIsLoaded",
    value: function aProfileIsLoaded() {
      return this._currentProfile !== '';
    }
  }, {
    key: "importListFromFile",
    value: function importListFromFile(selectedFile, callbackWhenDone) {
      var _this = this;

      var reader = new FileReader();

      reader.onload = function () {
        _this._lists = JSON.parse(reader.result); // Save lists

        util_1.getElement('file_input').value = ''; // Reset input

        callbackWhenDone();
      };

      reader.readAsText(selectedFile);
    }
  }, {
    key: "currentLoadedProfileId",
    get: function get() {
      return this._currentProfile;
    },
    set: function set(newId) {
      this._currentProfile = newId;
    }
  }, {
    key: "currentListSelect",
    get: function get() {
      return this._currentListSelect;
    },
    set: function set(newValue) {
      this._currentListSelect = newValue;
    }
  }, {
    key: "_lists",
    get: function get() {
      if (!localStorage.lists) {
        localStorage.lists = '[]';
      }

      return JSON.parse(localStorage.lists);
    },
    set: function set(newLists) {
      localStorage.lists = JSON.stringify(newLists);
    }
  }]);

  return StateService;
}();

exports.stateService = new StateService();
},{"../util/util":"src/util/util.ts","uuid":"node_modules/uuid/index.js"}],"src/util/villagers.json":[function(require,module,exports) {
module.exports = [{
  "name": "Ace",
  "id": "Ace",
  "head": "wip.jpg",
  "species": "Bird",
  "personality": "Jock",
  "coffee": "",
  "birthday": "March 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Ace",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Admiral",
  "id": "Admiral",
  "head": "Admiral.jpg",
  "species": "Bird",
  "personality": "Cranky",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "January 27",
  "wiki": "http://animalcrossing.wikia.com/wiki/Admiral",
  "store": "https://www.redbubble.com/people/purplepixel/works/25037087-admiral-animal-crossing"
}, {
  "name": "Agent S",
  "id": "Agent S",
  "head": "Agent S.jpg",
  "species": "Squirrel",
  "personality": "Peppy",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "July 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Agent S",
  "store": "https://www.redbubble.com/people/purplepixel/works/21509096-agent-s-animal-crossing"
}, {
  "name": "Agnes",
  "id": "Agnes",
  "head": "Agnes.jpg",
  "species": "Pig",
  "personality": "Uchi",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "April 21",
  "wiki": "http://animalcrossing.wikia.com/wiki/Agnes",
  "store": "https://www.redbubble.com/people/purplepixel/works/17864000-agnes-animal-crossing"
}, {
  "name": "Aisle",
  "id": "Aisle",
  "head": "Aisle.jpg",
  "species": "Cub",
  "personality": "Lazy",
  "coffee": "",
  "birthday": "September 27",
  "wiki": "http://animalcrossing.wikia.com/wiki/Aisle",
  "store": "https://www.redbubble.com/people/purplepixel/works/25143703-aisle-animal-crossing"
}, {
  "name": "Al",
  "id": "Al",
  "head": "Al.jpg",
  "species": "Gorilla",
  "personality": "Lazy",
  "coffee": "Mocha - Lots of Milk - 2 Sugars",
  "birthday": "October 18",
  "wiki": "http://animalcrossing.wikia.com/wiki/Al",
  "store": "https://www.redbubble.com/people/purplepixel/works/25989712-al-animal-crossing"
}, {
  "name": "Alfonso",
  "id": "Alfonso",
  "head": "Alfonso.jpg",
  "species": "Alligator",
  "personality": "Lazy",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "June 9",
  "wiki": "http://animalcrossing.wikia.com/wiki/Alfonso",
  "store": "https://www.redbubble.com/people/purplepixel/works/15535466-alfonzo-animal-crossing"
}, {
  "name": "Alice",
  "id": "Alice",
  "head": "Alice.jpg",
  "species": "Koala",
  "personality": "Normal",
  "coffee": "Mocha - None - None",
  "birthday": "August 19",
  "wiki": "http://animalcrossing.wikia.com/wiki/Alice",
  "store": "https://www.redbubble.com/people/purplepixel/works/21080678-alice-animal-crossing"
}, {
  "name": "Alli",
  "id": "Alli",
  "head": "wip.jpg",
  "species": "Alligator",
  "personality": "Snooty",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "November 8",
  "wiki": "http://animalcrossing.wikia.com/wiki/Alli",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Amelia",
  "id": "Amelia",
  "head": "wip.jpg",
  "species": "Eagle",
  "personality": "Snooty",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "November 18",
  "wiki": "http://animalcrossing.wikia.com/wiki/Amelia",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Anabelle",
  "id": "Anabelle",
  "head": "Anabelle.jpg",
  "species": "Anteater",
  "personality": "Peppy",
  "coffee": "Kilimanjaro - Regular Milk - 1 Sugar",
  "birthday": "February 16",
  "wiki": "http://animalcrossing.wikia.com/wiki/Anabelle",
  "store": "https://www.redbubble.com/people/purplepixel/works/15936773-anabelle-animal-crossing"
}, {
  "name": "Analogue",
  "id": "Analogue",
  "head": "wip.jpg",
  "species": "Penguin",
  "personality": "Jock",
  "coffee": "",
  "birthday": "December 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Analogue",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Anchovy",
  "id": "Anchovy",
  "head": "Anchovy.jpg",
  "species": "Bird",
  "personality": "Lazy",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "March 4",
  "wiki": "http://animalcrossing.wikia.com/wiki/Anchovy",
  "store": "https://www.redbubble.com/people/purplepixel/works/25555780-anchovy-animal-crossing"
}, {
  "name": "Angus",
  "id": "Angus",
  "head": "Angus.jpg",
  "species": "Bull",
  "personality": "Cranky",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "April 30",
  "wiki": "http://animalcrossing.wikia.com/wiki/Angus",
  "store": "https://www.redbubble.com/people/purplepixel/works/26270231-angus-animal-crossing"
}, {
  "name": "Anicotti",
  "id": "Anicotti",
  "head": "Anicotti.jpg",
  "species": "Mouse",
  "personality": "Peppy",
  "coffee": "Mocha - None - None",
  "birthday": "February 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Anicotti",
  "store": "https://www.redbubble.com/people/purplepixel/works/17877071-anicotti-animal-crossing"
}, {
  "name": "Ankha",
  "id": "Ankha",
  "head": "Ankha.jpg",
  "species": "Cat",
  "personality": "Snooty",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "September 22",
  "wiki": "http://animalcrossing.wikia.com/wiki/Ankha",
  "store": "https://www.redbubble.com/people/purplepixel/works/15976081-ankha-animal-crossing"
}, {
  "name": "Annalisa",
  "id": "Annalisa",
  "head": "Annalisa.jpg",
  "species": "Anteater",
  "personality": "Normal",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "February 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Annalisa",
  "store": "https://www.redbubble.com/people/purplepixel/works/20720286-annalisa-animal-crossing"
}, {
  "name": "Annalise",
  "id": "Annalise",
  "head": "wip.jpg",
  "species": "Horse",
  "personality": "Snooty",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "December 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Annalise",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Antonio",
  "id": "Antonio",
  "head": "Antonio.jpg",
  "species": "Anteater",
  "personality": "Jock",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "October 20",
  "wiki": "http://animalcrossing.wikia.com/wiki/Antonio",
  "store": "https://www.redbubble.com/people/purplepixel/works/16019628-antonio-animal-crossing"
}, {
  "name": "Apollo",
  "id": "Apollo",
  "head": "Apollo.jpg",
  "species": "Eagle",
  "personality": "Cranky",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "July 4",
  "wiki": "http://animalcrossing.wikia.com/wiki/Apollo",
  "store": "https://www.redbubble.com/people/purplepixel/works/15395583-apollo-animal-crossing"
}, {
  "name": "Apple",
  "id": "Apple",
  "head": "Apple.jpg",
  "species": "Hamster",
  "personality": "Peppy",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "September 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Apple",
  "store": "https://www.redbubble.com/people/purplepixel/works/21618012-apple-animal-crossing"
}, {
  "name": "Astrid",
  "id": "Astrid",
  "head": "Astrid.jpg",
  "species": "Kangaroo",
  "personality": "Snooty",
  "coffee": "Blue Mountain - A Little Milk - 1 Sugar",
  "birthday": "September 8",
  "wiki": "http://animalcrossing.wikia.com/wiki/Astrid",
  "store": "https://www.redbubble.com/people/purplepixel/works/16065776-astrid-animal-crossing"
}, {
  "name": "Aurora",
  "id": "Aurora",
  "head": "Aurora.jpg",
  "species": "Penguin",
  "personality": "Normal",
  "coffee": "Kilimanjaro - Regular Milk - 2 Sugars",
  "birthday": "January 27",
  "wiki": "http://animalcrossing.wikia.com/wiki/Aurora",
  "store": "https://www.redbubble.com/people/purplepixel/works/16605244-aurora-animal-crossing"
}, {
  "name": "Ava",
  "id": "Ava",
  "head": "Ava.jpg",
  "species": "Chicken",
  "personality": "Normal",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "April 28",
  "wiki": "http://animalcrossing.wikia.com/wiki/Ava",
  "store": "https://www.redbubble.com/people/purplepixel/works/26255408-ava-animal-crossing"
}, {
  "name": "Avery",
  "id": "Avery",
  "head": "Avery.jpg",
  "species": "Eagle",
  "personality": "Cranky",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "February 22",
  "wiki": "http://animalcrossing.wikia.com/wiki/Avery",
  "store": "https://www.redbubble.com/people/purplepixel/works/15234964-avery-animal-crossing"
}, {
  "name": "Axel",
  "id": "Axel",
  "head": "Axel.jpg",
  "species": "Elephant",
  "personality": "Jock",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "March 23",
  "wiki": "http://animalcrossing.wikia.com/wiki/Axel",
  "store": "https://www.redbubble.com/people/purplepixel/works/21873067-axel-animal-crossing"
}, {
  "name": "Aziz",
  "id": "Aziz",
  "head": "Aziz.jpg",
  "species": "Lion",
  "personality": "Jock",
  "coffee": "",
  "birthday": "February 26",
  "wiki": "http://animalcrossing.wikia.com/wiki/Aziz",
  "store": "https://www.redbubble.com/people/purplepixel/works/23211780-aziz-animal-crossing"
}, {
  "name": "Baabara",
  "id": "Baabara",
  "head": "Baabara.jpg",
  "species": "Sheep",
  "personality": "Snooty",
  "coffee": "Mocha - None - None",
  "birthday": "March 28",
  "wiki": "http://animalcrossing.wikia.com/wiki/Baabara",
  "store": "https://www.redbubble.com/people/purplepixel/works/15525207-baabara-animal-crossing"
}, {
  "name": "Bam",
  "id": "Bam",
  "head": "wip.jpg",
  "species": "Deer",
  "personality": "Jock",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "November 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bam",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Bangle",
  "id": "Bangle",
  "head": "Bangle.jpg",
  "species": "Tiger",
  "personality": "Peppy",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "August 27",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bangle",
  "store": "https://www.redbubble.com/people/purplepixel/works/16141011-bangle-animal-crossing"
}, {
  "name": "Barold",
  "id": "Barold",
  "head": "Barold.jpg",
  "species": "Cub",
  "personality": "Lazy",
  "coffee": "Blue Mountain - None - None",
  "birthday": "March 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Barold",
  "store": "https://www.redbubble.com/people/purplepixel/works/16040780-barold-animal-crossing"
}, {
  "name": "Bea",
  "id": "Bea",
  "head": "Bea.jpg",
  "species": "Dog",
  "personality": "Normal",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "October 15",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bea",
  "store": "https://www.redbubble.com/people/purplepixel/works/34407345-bea-animal-crossing"
}, {
  "name": "Beardo",
  "id": "Beardo",
  "head": "Beardo.jpg",
  "species": "Bear",
  "personality": "Smug",
  "coffee": "Blue Mountain - A Little Milk - 1 Sugar",
  "birthday": "March 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Beardo",
  "store": "https://www.redbubble.com/people/purplepixel/works/21746198-beardo-animal-crossing"
}, {
  "name": "Beau",
  "id": "Beau",
  "head": "Beau.jpg",
  "species": "Deer",
  "personality": "Lazy",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "April 5",
  "wiki": "http://animalcrossing.wikia.com/wiki/Beau",
  "store": "https://www.redbubble.com/people/purplepixel/works/15239562-beau-animal-crossing"
}, {
  "name": "Becky",
  "id": "Becky",
  "head": "wip.jpg",
  "species": "Chicken",
  "personality": "Snooty",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "December 9",
  "wiki": "http://animalcrossing.wikia.com/wiki/Becky",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Bella",
  "id": "Bella",
  "head": "wip.jpg",
  "species": "Mouse",
  "personality": "Peppy",
  "coffee": "Mocha - None - None",
  "birthday": "December 28",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bella",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Belle",
  "id": "Belle",
  "head": "wip.jpg",
  "species": "Cow",
  "personality": "Peppy",
  "coffee": "",
  "birthday": "June 27",
  "wiki": "http://animalcrossing.wikia.com/wiki/Belle",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Benedict",
  "id": "Benedict",
  "head": "Benedict.jpg",
  "species": "Chicken",
  "personality": "Lazy",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "October 10",
  "wiki": "http://animalcrossing.wikia.com/wiki/Benedict",
  "store": "https://www.redbubble.com/people/purplepixel/works/19924333-benedict-animal-crossing"
}, {
  "name": "Benjamin",
  "id": "Benjamin",
  "head": "Benjamin.jpg",
  "species": "Dog",
  "personality": "Lazy",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "August 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Benjamin",
  "store": "https://www.redbubble.com/people/purplepixel/works/29321066-benjamin-animal-crossing"
}, {
  "name": "Bertha",
  "id": "Bertha",
  "head": "Bertha.jpg",
  "species": "Hippo",
  "personality": "Normal",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "April 25",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bertha",
  "store": "https://www.redbubble.com/people/purplepixel/works/26255280-bertha-animal-crossing"
}, {
  "name": "Bessie",
  "id": "Bessie",
  "head": "wip.jpg",
  "species": "Cow",
  "personality": "Normal",
  "coffee": "",
  "birthday": "May 10",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bessie",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Bettina",
  "id": "Bettina",
  "head": "Bettina.jpg",
  "species": "Mouse",
  "personality": "Normal",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "June 12",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bettina",
  "store": "https://www.redbubble.com/people/purplepixel/works/27121722-bettina-animal-crossing"
}, {
  "name": "Betty",
  "id": "Betty",
  "head": "wip.jpg",
  "species": "Chicken",
  "personality": "Normal",
  "coffee": "",
  "birthday": "June 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Betty",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Bianca",
  "id": "Bianca",
  "head": "wip.jpg",
  "species": "Tiger",
  "personality": "Peppy",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "December 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bianca",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Biff",
  "id": "Biff",
  "head": "Biff.jpg",
  "species": "Hippo",
  "personality": "Jock",
  "coffee": "Mocha - None - None",
  "birthday": "March 29",
  "wiki": "http://animalcrossing.wikia.com/wiki/Biff",
  "store": "https://www.redbubble.com/people/purplepixel/works/20776285-biff-animal-crossing"
}, {
  "name": "Big Top",
  "id": "Big Top",
  "head": "Big Top.jpg",
  "species": "Elephant",
  "personality": "Lazy",
  "coffee": "Blye Mountain - Lots of Milk - 3 Sugars",
  "birthday": "October 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Big Top",
  "store": "https://www.redbubble.com/people/purplepixel/works/32250461-big-top-animal-crossing"
}, {
  "name": "Bill",
  "id": "Bill",
  "head": "Bill.jpg",
  "species": "Duck",
  "personality": "Jock",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "February 1",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bill",
  "store": "https://www.redbubble.com/people/purplepixel/works/16161715-bill-animal-crossing"
}, {
  "name": "Billy",
  "id": "Billy",
  "head": "Billy.jpg",
  "species": "Goat",
  "personality": "Jock",
  "coffee": "Blue Mountain - None - None",
  "birthday": "March 25",
  "wiki": "http://animalcrossing.wikia.com/wiki/Billy",
  "store": "https://www.redbubble.com/people/purplepixel/works/21638560-billy-animal-crossing"
}, {
  "name": "Biskit",
  "id": "Biskit",
  "head": "Biskit.jpg",
  "species": "Dog",
  "personality": "Lazy",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "May 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Biskit",
  "store": "https://www.redbubble.com/people/purplepixel/works/18774695-biskit-animal-crossing"
}, {
  "name": "Bitty",
  "id": "Bitty",
  "head": "Bitty.jpg",
  "species": "Hippo",
  "personality": "Snooty",
  "coffee": "Mocha - None - None",
  "birthday": "October 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bitty",
  "store": "https://www.redbubble.com/people/purplepixel/works/22030859-bitty-animal-crossing"
}, {
  "name": "Blaire",
  "id": "Blaire",
  "head": "Blaire.jpg",
  "species": "Squirrel",
  "personality": "Snooty",
  "coffee": "Blend - None - None",
  "birthday": "July 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Blaire",
  "store": "https://www.redbubble.com/people/purplepixel/works/19950692-blaire-animal-crossing"
}, {
  "name": "Blanche",
  "id": "Blanche",
  "head": "wip.jpg",
  "species": "Ostrich",
  "personality": "Snooty",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "December 21",
  "wiki": "http://animalcrossing.wikia.com/wiki/Blanche",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Bluebear",
  "id": "Bluebear",
  "head": "Bluebear.jpg",
  "species": "Cub",
  "personality": "Peppy",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "June 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bluebear",
  "store": "https://www.redbubble.com/people/purplepixel/works/15908274-bluebear-animal-crossing"
}, {
  "name": "Bob",
  "id": "Bob",
  "head": "Bob.jpg",
  "species": "Cat",
  "personality": "Lazy",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "January 1",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bob",
  "store": "https://www.redbubble.com/people/purplepixel/works/15354593-bob-animal-crossing"
}, {
  "name": "Bonbon",
  "id": "Bonbon",
  "head": "Bonbon.jpg",
  "species": "Rabbit",
  "personality": "Peppy",
  "coffee": "Mocha - Regular - 2 Sugars",
  "birthday": "March 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bonbon",
  "store": "https://www.redbubble.com/people/purplepixel/works/20605211-bonbon-animal-crossing"
}, {
  "name": "Bones",
  "id": "Bones",
  "head": "Bones.jpg",
  "species": "Dog",
  "personality": "Lazy",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "August 4",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bones",
  "store": "https://www.redbubble.com/people/purplepixel/works/16524184-bones-animal-crossing"
}, {
  "name": "Boomer",
  "id": "Boomer",
  "head": "Boomer.jpg",
  "species": "Penguin",
  "personality": "Lazy",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "February 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Boomer",
  "store": "https://www.redbubble.com/people/purplepixel/works/19050136-boomer-animal-crossing"
}, {
  "name": "Boone",
  "id": "Boone",
  "head": "Boone.jpg",
  "species": "Gorilla",
  "personality": "Jock",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "September 12",
  "wiki": "http://animalcrossing.wikia.com/wiki/Boone",
  "store": "https://www.redbubble.com/people/purplepixel/works/21984307-boone-animal-crossing"
}, {
  "name": "Boots",
  "id": "Boots",
  "head": "Boots.jpg",
  "species": "Alligator",
  "personality": "Jock",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "August 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Boots",
  "store": "https://www.redbubble.com/people/purplepixel/works/29555143-boots-animal-crossing"
}, {
  "name": "Boris",
  "id": "Boris",
  "head": "wip.jpg",
  "species": "Pig",
  "personality": "Cranky",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "November 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Boris",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Bow",
  "id": "Bow",
  "head": "Bow.jpg",
  "species": "Dog",
  "personality": "Lazy",
  "coffee": "",
  "birthday": "August 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bow",
  "store": "https://www.redbubble.com/people/purplepixel/works/19493582-bow-animal-crossing"
}, {
  "name": "Boyd",
  "id": "Boyd",
  "head": "Boyd.jpg",
  "species": "Gorilla",
  "personality": "Cranky",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "October 1",
  "wiki": "http://animalcrossing.wikia.com/wiki/Boyd",
  "store": "https://www.redbubble.com/people/purplepixel/works/24655366-boyd-animal-crossing"
}, {
  "name": "Bree",
  "id": "Bree",
  "head": "Bree.jpg",
  "species": "Mouse",
  "personality": "Snooty",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "July 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bree",
  "store": "https://www.redbubble.com/people/purplepixel/works/18191939-bree-animal-crossing"
}, {
  "name": "Broccolo",
  "id": "Broccolo",
  "head": "Broccolo.jpg",
  "species": "Mouse",
  "personality": "Lazy",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "June 30",
  "wiki": "http://animalcrossing.wikia.com/wiki/Broccolo",
  "store": "https://www.redbubble.com/people/purplepixel/works/20348144-broccolo-animal-crossing"
}, {
  "name": "Broffina",
  "id": "Broffina",
  "head": "wip.jpg",
  "species": "Chicken",
  "personality": "Snooty",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "October 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Broffina",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Bruce",
  "id": "Bruce",
  "head": "Bruce.jpg",
  "species": "Deer",
  "personality": "Cranky",
  "coffee": "Blue Mountain - None - None",
  "birthday": "May 26",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bruce",
  "store": "https://www.redbubble.com/people/purplepixel/works/16032284-bruce-animal-crossing"
}, {
  "name": "Bubbles",
  "id": "Bubbles",
  "head": "Bubbles.jpg",
  "species": "Hippo",
  "personality": "Peppy",
  "coffee": "Mocha - None - None",
  "birthday": "September 18",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bubbles",
  "store": "https://www.redbubble.com/people/purplepixel/works/21401018-bubbles-animal-crossing"
}, {
  "name": "Buck",
  "id": "Buck",
  "head": "Buck.jpg",
  "species": "Horse",
  "personality": "Jock",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "April 4",
  "wiki": "http://animalcrossing.wikia.com/wiki/Buck",
  "store": "https://www.redbubble.com/people/purplepixel/works/18780632-buck-animal-crossing"
}, {
  "name": "Bud",
  "id": "Bud",
  "head": "Bud.jpg",
  "species": "Lion",
  "personality": "Jock",
  "coffee": "Blue Mountain - None - None",
  "birthday": "August 8",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bud",
  "store": "https://www.redbubble.com/people/purplepixel/works/17644958-bud-animal-crossing"
}, {
  "name": "Bunnie",
  "id": "Bunnie",
  "head": "Bunnie.jpg",
  "species": "Rabbit",
  "personality": "Peppy",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "May 9",
  "wiki": "http://animalcrossing.wikia.com/wiki/Bunnie",
  "store": "https://www.redbubble.com/people/purplepixel/works/16137670-bunnie-animal-crossing"
}, {
  "name": "Butch",
  "id": "Butch",
  "head": "wip.jpg",
  "species": "Dog",
  "personality": "Cranky",
  "coffee": "Blend - None - None",
  "birthday": "November 1",
  "wiki": "http://animalcrossing.wikia.com/wiki/Butch",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Buzz",
  "id": "Buzz",
  "head": "wip.jpg",
  "species": "Eagle",
  "personality": "Cranky",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "December 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Buzz",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Cally",
  "id": "Cally",
  "head": "Cally.jpg",
  "species": "Squirrel",
  "personality": "Normal",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "September 4",
  "wiki": "http://animalcrossing.wikia.com/wiki/Cally",
  "store": "https://www.redbubble.com/people/purplepixel/works/20275077-cally-animal-crossing"
}, {
  "name": "Camofrog",
  "id": "Camofrog",
  "head": "Camofrog.jpg",
  "species": "Frog",
  "personality": "Cranky",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "June 5",
  "wiki": "http://animalcrossing.wikia.com/wiki/Camofrog",
  "store": "https://www.redbubble.com/people/purplepixel/works/18790179-camofrog-animal-crossing"
}, {
  "name": "Canberra",
  "id": "Canberra",
  "head": "Canberra.jpg",
  "species": "Koala",
  "personality": "Uchi",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "May `4",
  "wiki": "http://animalcrossing.wikia.com/wiki/Canberra",
  "store": "https://www.redbubble.com/people/purplepixel/works/16068035-canberra-animal-crossing"
}, {
  "name": "Candi",
  "id": "Candi",
  "head": "Candi.jpg",
  "species": "Mouse",
  "personality": "Peppy",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "April 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Candi",
  "store": "https://www.redbubble.com/people/purplepixel/works/23778232-candi-animal-crossing"
}, {
  "name": "Carmen",
  "id": "Carmen (2)",
  "head": "wip.jpg",
  "species": "Mouse",
  "personality": "Snooty",
  "coffee": "",
  "birthday": "March 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Carmen_(mouse)",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Carmen",
  "id": "Carmen",
  "head": "Carmen.jpg",
  "species": "Rabbit",
  "personality": "Peppy",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "January 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Carmen_(rabbit)",
  "store": "https://www.redbubble.com/people/purplepixel/works/15934499-carmen-animal-crossing"
}, {
  "name": "Caroline",
  "id": "Caroline",
  "head": "Caroline.jpg",
  "species": "Squirrel",
  "personality": "Normal",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "July 15",
  "wiki": "http://animalcrossing.wikia.com/wiki/Caroline",
  "store": "https://www.redbubble.com/people/purplepixel/works/15735314-caroline-animal-crossing"
}, {
  "name": "Carrie",
  "id": "Carrie",
  "head": "wip.jpg",
  "species": "Kangaroo",
  "personality": "Normal",
  "coffee": "Mocha - None - None",
  "birthday": "December 5",
  "wiki": "http://animalcrossing.wikia.com/wiki/Carrie",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Carrot",
  "id": "Carrot",
  "head": "wip.jpg",
  "species": "Cow",
  "personality": "Normal",
  "coffee": "",
  "birthday": "May 18",
  "wiki": "http://animalcrossing.wikia.com/wiki/Carrot",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Cashmere",
  "id": "Cashmere",
  "head": "Cashmere.jpg",
  "species": "Sheep",
  "personality": "Snooty",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "April 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Cashmere",
  "store": "https://www.redbubble.com/people/purplepixel/works/20480848-cashmere-animal-crossing"
}, {
  "name": "Cece",
  "id": "Cece",
  "head": "Cece.jpg",
  "species": "Squirrel",
  "personality": "Peppy",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "May 28",
  "wiki": "http://animalcrossing.wikia.com/wiki/Cece",
  "store": "https://www.redbubble.com/people/purplepixel/works/26757332-cece-animal-crossing"
}, {
  "name": "Celia",
  "id": "Celia",
  "head": "Celia.jpg",
  "species": "Eagle",
  "personality": "Normal",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "March 25",
  "wiki": "http://animalcrossing.wikia.com/wiki/Celia",
  "store": "https://www.redbubble.com/people/purplepixel/works/22389920-celia-animal-crossing"
}, {
  "name": "Cesar",
  "id": "Cesar",
  "head": "Cesar.jpg",
  "species": "Gorilla",
  "personality": "Cranky",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "September 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Cesar",
  "store": "https://www.redbubble.com/people/purplepixel/works/21591304-cesar-animal-crossing"
}, {
  "name": "Chadder",
  "id": "Chadder",
  "head": "wip.jpg",
  "species": "Mouse",
  "personality": "Smug",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "December 15",
  "wiki": "http://animalcrossing.wikia.com/wiki/Chadder",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Chai",
  "id": "Chai",
  "head": "Chai.jpg",
  "species": "Elephant",
  "personality": "Peppy",
  "coffee": "Blend - None - None",
  "birthday": "March 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Chai",
  "store": "https://www.redbubble.com/people/purplepixel/works/23088691-chai-animal-crossing"
}, {
  "name": "Champ",
  "id": "Champ",
  "head": "Champ.jpg",
  "species": "Monkey",
  "personality": "Jock",
  "coffee": "",
  "birthday": "June 4",
  "wiki": "http://animalcrossing.wikia.com/wiki/Champ",
  "store": "https://www.redbubble.com/people/purplepixel/works/20608008-champ-animal-crossing"
}, {
  "name": "Champagne",
  "id": "Champagne",
  "head": "wip.jpg",
  "species": "Dog",
  "personality": "Cranky",
  "coffee": "",
  "birthday": "April 1",
  "wiki": "http://animalcrossing.wikia.com/wiki/Champagne",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Charlise",
  "id": "Charlise",
  "head": "Charlise.jpg",
  "species": "Bear",
  "personality": "Uchi",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "April 17",
  "wiki": "http://animalcrossing.wikia.com/wiki/Charlise",
  "store": "https://www.redbubble.com/people/purplepixel/works/22156496-charlise-animal-crossing"
}, {
  "name": "Chelsea",
  "id": "Chelsea",
  "head": "Chelsea.jpg",
  "species": "Deer",
  "personality": "Normal",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "January 18",
  "wiki": "http://animalcrossing.wikia.com/wiki/Chelsea",
  "store": "https://www.redbubble.com/people/purplepixel/works/23062076-chelsea-animal-crossing"
}, {
  "name": "Cheri",
  "id": "Cheri",
  "head": "Cheri.jpg",
  "species": "Cub",
  "personality": "Peppy",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "March 17",
  "wiki": "http://animalcrossing.wikia.com/wiki/Cheri",
  "store": "https://www.redbubble.com/people/purplepixel/works/16505048-cheri-animal-corssing"
}, {
  "name": "Cherry",
  "id": "Cherry",
  "head": "Cherry.jpg",
  "species": "Dog",
  "personality": "Uchi",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "May 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Cherry",
  "store": "https://www.redbubble.com/people/purplepixel/works/15534881-cherry-animal-crossing"
}, {
  "name": "Chester",
  "id": "Chester",
  "head": "Chester.jpg",
  "species": "Cub",
  "personality": "Lazy",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "August 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Chester",
  "store": "https://www.redbubble.com/people/purplepixel/works/15978310-chester-animal-crossing"
}, {
  "name": "Chevre",
  "id": "Chevre",
  "head": "Chevre.jpg",
  "species": "Goat",
  "personality": "Normal",
  "coffee": "Blue Mountain - None - None",
  "birthday": "March 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Chevre",
  "store": "https://www.redbubble.com/people/purplepixel/works/15273273-chevre-animal-crossing"
}, {
  "name": "Chico",
  "id": "Chico",
  "head": "wip.jpg",
  "species": "Mouse",
  "personality": "Lazy",
  "coffee": "",
  "birthday": "January 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Chico",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Chief",
  "id": "Chief",
  "head": "wip.jpg",
  "species": "Wolf",
  "personality": "Cranky",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "December 19",
  "wiki": "http://animalcrossing.wikia.com/wiki/Chief",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Chops",
  "id": "Chops",
  "head": "Chops.jpg",
  "species": "Pig",
  "personality": "Smug",
  "coffee": "Mocha - None - None",
  "birthday": "October 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Chops",
  "store": "https://www.redbubble.com/people/purplepixel/works/20624515-chops-animal-crossing"
}, {
  "name": "Chow",
  "id": "Chow",
  "head": "Chow.jpg",
  "species": "Bear",
  "personality": "Cranky",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "July 22",
  "wiki": "http://animalcrossing.wikia.com/wiki/Chow",
  "store": "https://www.redbubble.com/people/purplepixel/works/22719441-chow-animal-crossing"
}, {
  "name": "Chrissy",
  "id": "Chrissy",
  "head": "Chrissy.jpg",
  "species": "Rabbit",
  "personality": "Peppy",
  "coffee": "",
  "birthday": "August 28",
  "wiki": "http://animalcrossing.wikia.com/wiki/Chrissy",
  "store": "https://www.redbubble.com/people/purplepixel/works/15522228-chrissy-animal-crossing"
}, {
  "name": "Chuck",
  "id": "Chuck",
  "head": "Chuck.jpg",
  "species": "Bull",
  "personality": "Cranky",
  "coffee": "",
  "birthday": "May 14",
  "wiki": "http://animalcrossing.wikia.com/wiki/Chuck",
  "store": "https://www.redbubble.com/people/purplepixel/works/24646503-chuck-animal-crossing"
}, {
  "name": "Clara",
  "id": "Clara",
  "head": "wip.jpg",
  "species": "Hippo",
  "personality": "Normal",
  "coffee": "",
  "birthday": "July 8",
  "wiki": "http://animalcrossing.wikia.com/wiki/Clara",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Claude",
  "id": "Claude",
  "head": "wip.jpg",
  "species": "Rabbit",
  "personality": "Lazy",
  "coffee": "Blend - None - None",
  "birthday": "December 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Claude",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Claudia",
  "id": "Claudia",
  "head": "wip.jpg",
  "species": "Tiger",
  "personality": "Snooty",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "November 22",
  "wiki": "http://animalcrossing.wikia.com/wiki/Claudia",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Clay",
  "id": "Clay",
  "head": "Clay.jpg",
  "species": "Hamster",
  "personality": "Lazy",
  "coffee": "Mocha - None - None",
  "birthday": "October 19",
  "wiki": "http://animalcrossing.wikia.com/wiki/Clay",
  "store": "https://www.redbubble.com/people/purplepixel/works/17294209-clay-animal-crossing"
}, {
  "name": "Cleo",
  "id": "Cleo",
  "head": "Cleo.jpg",
  "species": "Horse",
  "personality": "Snooty",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "February 9",
  "wiki": "http://animalcrossing.wikia.com/wiki/Cleo",
  "store": "https://www.redbubble.com/people/purplepixel/works/20812346-cleo-animal-crossing"
}, {
  "name": "Clyde",
  "id": "Clyde",
  "head": "Clyde.jpg",
  "species": "Horse",
  "personality": "Lazy",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "May 1",
  "wiki": "http://animalcrossing.wikia.com/wiki/Clyde",
  "store": "https://www.redbubble.com/people/purplepixel/works/26279031-clyde-animal-crossing"
}, {
  "name": "Coach",
  "id": "Coach",
  "head": "Coach.jpg",
  "species": "Bull",
  "personality": "Jock",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "April 29",
  "wiki": "http://animalcrossing.wikia.com/wiki/Coach",
  "store": "https://www.redbubble.com/people/purplepixel/works/20349682-coach-animal-crossing"
}, {
  "name": "Cobb",
  "id": "Cobb",
  "head": "Cobb.jpg",
  "species": "Pig",
  "personality": "Jock",
  "coffee": "Blue Mountain - A Little Milk - 1 Sugar",
  "birthday": "October 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Cobb",
  "store": "https://www.redbubble.com/people/purplepixel/works/21837606-cobb-animal-crossing"
}, {
  "name": "Coco",
  "id": "Coco",
  "head": "Coco.jpg",
  "species": "Rabbit",
  "personality": "Normal",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "March 1",
  "wiki": "http://animalcrossing.wikia.com/wiki/Coco",
  "store": "https://www.redbubble.com/people/purplepixel/works/16394772-coco-animal-crossing"
}, {
  "name": "Cole",
  "id": "Cole",
  "head": "Cole.jpg",
  "species": "Rabbit",
  "personality": "Lazy",
  "coffee": "Blend - None - None",
  "birthday": "August 10",
  "wiki": "http://animalcrossing.wikia.com/wiki/Cole",
  "store": "https://www.redbubble.com/people/purplepixel/works/16600533-cole-animal-crossing"
}, {
  "name": "Colton",
  "id": "Colton",
  "head": "Colton.jpg",
  "species": "Horse",
  "personality": "Smug",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "May 22",
  "wiki": "http://animalcrossing.wikia.com/wiki/Colton",
  "store": "https://www.redbubble.com/people/purplepixel/works/19828402-colton-animal-crossing"
}, {
  "name": "Cookie",
  "id": "Cookie",
  "head": "Cookie.jpg",
  "species": "Dog",
  "personality": "Peppy",
  "coffee": "Blend - None - None",
  "birthday": "June 18",
  "wiki": "http://animalcrossing.wikia.com/wiki/Cookie",
  "store": "https://www.redbubble.com/people/purplepixel/works/15792569-cookie-animal-crossing"
}, {
  "name": "Cousteau",
  "id": "Cousteau",
  "head": "wip.jpg",
  "species": "Frog",
  "personality": "Jock",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "December 18",
  "wiki": "http://animalcrossing.wikia.com/wiki/Cousteau",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Cranston",
  "id": "Cranston",
  "head": "Cranston.jpg",
  "species": "Ostrich",
  "personality": "Lazy",
  "coffee": "Blend - None - None",
  "birthday": "September 23",
  "wiki": "http://animalcrossing.wikia.com/wiki/Cranston",
  "store": "https://www.redbubble.com/people/purplepixel/works/15916833-cranston-animal-crossing"
}, {
  "name": "Croque",
  "id": "Croque",
  "head": "Croque.jpg",
  "species": "Frog",
  "personality": "Cranky",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "July 18",
  "wiki": "http://animalcrossing.wikia.com/wiki/Croque",
  "store": "https://www.redbubble.com/people/purplepixel/works/28376445-croque-animal-crossing"
}, {
  "name": "Cube",
  "id": "Cube",
  "head": "Cube.jpg",
  "species": "Penguin",
  "personality": "Lazy",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "January 29",
  "wiki": "http://animalcrossing.wikia.com/wiki/Cube",
  "store": "https://www.redbubble.com/people/purplepixel/works/21384171-cube-animal-crossing"
}, {
  "name": "Cupcake",
  "id": "Cupcake",
  "head": "Cupcake.jpg",
  "species": "Cub",
  "personality": "Snooty",
  "coffee": "",
  "birthday": "May 29",
  "wiki": "http://animalcrossing.wikia.com/wiki/Cupcake",
  "store": "https://www.redbubble.com/people/purplepixel/works/32295792-cupcake-animal-crossing"
}, {
  "name": "Curlos",
  "id": "Curlos",
  "head": "Curlos.jpg",
  "species": "Sheep",
  "personality": "Smug",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "May 8",
  "wiki": "http://animalcrossing.wikia.com/wiki/Curlos",
  "store": "https://www.redbubble.com/people/purplepixel/works/15890615-curlos-animal-crossing"
}, {
  "name": "Curly",
  "id": "Curly",
  "head": "Curly.jpg",
  "species": "Pig",
  "personality": "Jock",
  "coffee": "Blue Mountain - A Little Milk - 1 Sugar",
  "birthday": "July 26",
  "wiki": "http://animalcrossing.wikia.com/wiki/Curly",
  "store": "https://www.redbubble.com/people/purplepixel/works/20916295-curly-animal-crossing"
}, {
  "name": "Curt",
  "id": "Curt",
  "head": "Curt.jpg",
  "species": "Bear",
  "personality": "Cranky",
  "coffee": "Mocha - None - None",
  "birthday": "July 1",
  "wiki": "http://animalcrossing.wikia.com/wiki/Curt",
  "store": "https://www.redbubble.com/people/purplepixel/works/15495960-curt-animal-crossing"
}, {
  "name": "Cyrano",
  "id": "Cyrano",
  "head": "Cyrano.jpg",
  "species": "Anteater",
  "personality": "Cranky",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "March 9",
  "wiki": "http://animalcrossing.wikia.com/wiki/Cyrano",
  "store": "https://www.redbubble.com/people/purplepixel/works/17622886-cyrano-animal-crossing"
}, {
  "name": "Daisy",
  "id": "Daisy",
  "head": "wip.jpg",
  "species": "Dog",
  "personality": "Normal",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "November 16",
  "wiki": "http://animalcrossing.wikia.com/wiki/Daisy",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Deena",
  "id": "Deena",
  "head": "Deena.jpg",
  "species": "Duck",
  "personality": "Normal",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "June 27",
  "wiki": "http://animalcrossing.wikia.com/wiki/Deena",
  "store": "https://www.redbubble.com/people/purplepixel/works/27484644-deena-animal-crossing"
}, {
  "name": "Deirdre",
  "id": "Deirdre",
  "head": "Deirdre.jpg",
  "species": "Deer",
  "personality": "Uchi",
  "coffee": "Blue Mountain - None - None",
  "birthday": "May 4",
  "wiki": "http://animalcrossing.wikia.com/wiki/Deirdre",
  "store": "https://www.redbubble.com/people/purplepixel/works/17313407-deirdre-animal-crossing"
}, {
  "name": "Del",
  "id": "Del",
  "head": "Del.jpg",
  "species": "Alligator",
  "personality": "Cranky",
  "coffee": "Blend - None - None",
  "birthday": "May 27",
  "wiki": "http://animalcrossing.wikia.com/wiki/Del",
  "store": "https://www.redbubble.com/people/purplepixel/works/22410558-del-animal-crossing"
}, {
  "name": "Deli",
  "id": "Deli",
  "head": "Deli.jpg",
  "species": "Monkey",
  "personality": "Lazy",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "May 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Deli",
  "store": "https://www.redbubble.com/people/purplepixel/works/26646424-deli-animal-crossing"
}, {
  "name": "Derwin",
  "id": "Derwin",
  "head": "Derwin.jpg",
  "species": "Duck",
  "personality": "Lazy",
  "coffee": "Blend - None - None",
  "birthday": "May 25",
  "wiki": "http://animalcrossing.wikia.com/wiki/Derwin",
  "store": "https://www.redbubble.com/people/purplepixel/works/20855433-derwin-animal-crossing"
}, {
  "name": "Diana",
  "id": "Diana",
  "head": "Diana.jpg",
  "species": "Deer",
  "personality": "Snooty",
  "coffee": "Kilimanjaro - Regular Milk - 2 Sugars",
  "birthday": "January 4",
  "wiki": "http://animalcrossing.wikia.com/wiki/Diana",
  "store": "https://www.redbubble.com/people/purplepixel/works/15917199-diana-animal-crossing"
}, {
  "name": "Diva",
  "id": "Diva",
  "head": "Diva.jpg",
  "species": "Frog",
  "personality": "Uchi",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "October 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Diva",
  "store": "https://www.redbubble.com/people/purplepixel/works/21905774-diva-animal-crossing"
}, {
  "name": "Dizzy",
  "id": "Dizzy",
  "head": "Dizzy.jpg",
  "species": "Elephant",
  "personality": "Lazy",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "July 14",
  "wiki": "http://animalcrossing.wikia.com/wiki/Dizzy",
  "store": "https://www.redbubble.com/people/purplepixel/works/15405997-dizzy-animal-crossing"
}, {
  "name": "Dobie",
  "id": "Dobie",
  "head": "Dobie.jpg",
  "species": "Wolf",
  "personality": "Cranky",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "February 17",
  "wiki": "http://animalcrossing.wikia.com/wiki/Dobie",
  "store": "https://www.redbubble.com/people/purplepixel/works/22311816-dobie-animal-crossing"
}, {
  "name": "Doc",
  "id": "Doc",
  "head": "Doc.jpg",
  "species": "Rabbit",
  "personality": "Lazy",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "March 16",
  "wiki": "http://animalcrossing.wikia.com/wiki/Doc",
  "store": "https://www.redbubble.com/people/purplepixel/works/21213601-doc-animal-crossing"
}, {
  "name": "Dora",
  "id": "Dora",
  "head": "Dora.jpg",
  "species": "Mouse",
  "personality": "Normal",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "February 18",
  "wiki": "http://animalcrossing.wikia.com/wiki/Dora",
  "store": "https://www.redbubble.com/people/purplepixel/works/20630289-dora-animal-crossing"
}, {
  "name": "Dotty",
  "id": "Dotty",
  "head": "Dotty.jpg",
  "species": "Rabbit",
  "personality": "Peppy",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "March 14",
  "wiki": "http://animalcrossing.wikia.com/wiki/Dotty",
  "store": "https://www.redbubble.com/people/purplepixel/works/21133408-dotty-animal-crossing"
}, {
  "name": "Dozer",
  "id": "Dozer",
  "head": "Dozer.jpg",
  "species": "Bear",
  "personality": "Lazy",
  "coffee": "",
  "birthday": "March 10",
  "wiki": "http://animalcrossing.wikia.com/wiki/Dozer",
  "store": "https://www.redbubble.com/people/purplepixel/works/20981668-dozer-animal-crossing"
}, {
  "name": "Drago",
  "id": "Drago",
  "head": "Drago.jpg",
  "species": "Alligator",
  "personality": "Lazy",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "February 12",
  "wiki": "http://animalcrossing.wikia.com/wiki/Drago",
  "store": "https://www.redbubble.com/people/purplepixel/works/15699986-drago-animal-crossing"
}, {
  "name": "Drake",
  "id": "Drake",
  "head": "Drake.jpg",
  "species": "Duck",
  "personality": "Lazy",
  "coffee": "Blend - None - None",
  "birthday": "June 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Drake",
  "store": "https://www.redbubble.com/people/purplepixel/works/22943164-drake-animal-crossing"
}, {
  "name": "Drift",
  "id": "Drift",
  "head": "Drift.jpg",
  "species": "Frog",
  "personality": "Jock",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "October 9",
  "wiki": "http://animalcrossing.wikia.com/wiki/Drift",
  "store": "https://www.redbubble.com/people/purplepixel/works/23539901-drift-animal-crossing"
}, {
  "name": "Ed",
  "id": "Ed",
  "head": "Ed.jpg",
  "species": "Horse",
  "personality": "Smug",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "September 16",
  "wiki": "http://animalcrossing.wikia.com/wiki/Ed",
  "store": "https://www.redbubble.com/people/purplepixel/works/21879720-ed-animal-crossing"
}, {
  "name": "Egbert",
  "id": "Egbert",
  "head": "Egbert.jpg",
  "species": "Chicken",
  "personality": "Lazy",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "October 14",
  "wiki": "http://animalcrossing.wikia.com/wiki/Egbert",
  "store": "https://www.redbubble.com/people/purplepixel/works/15270713-egbert-animal-crossing"
}, {
  "name": "Elina",
  "id": "Elina",
  "head": "wip.jpg",
  "species": "Elephant",
  "personality": "Snooty",
  "coffee": "",
  "birthday": "July 1",
  "wiki": "http://animalcrossing.wikia.com/wiki/Elina",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Elise",
  "id": "Elise",
  "head": "Elise.jpg",
  "species": "Monkey",
  "personality": "Snooty",
  "coffee": "Blend - None - None",
  "birthday": "March 21",
  "wiki": "http://animalcrossing.wikia.com/wiki/Elise",
  "store": "https://www.redbubble.com/people/purplepixel/works/20878649-elise-animal-crossing"
}, {
  "name": "Ellie",
  "id": "Ellie",
  "head": "Ellie.jpg",
  "species": "Elephant",
  "personality": "Normal",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "May 12",
  "wiki": "http://animalcrossing.wikia.com/wiki/Ellie",
  "store": "https://www.redbubble.com/people/purplepixel/works/19704656-ellie-animal-crossing"
}, {
  "name": "Elmer",
  "id": "Elmer",
  "head": "Elmer.jpg",
  "species": "Horse",
  "personality": "Lazy",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "October 5",
  "wiki": "http://animalcrossing.wikia.com/wiki/Elmer",
  "store": "https://www.redbubble.com/people/purplepixel/works/20327789-elmer-animal-crossing"
}, {
  "name": "Eloise",
  "id": "Eloise",
  "head": "wip.jpg",
  "species": "Elephant",
  "personality": "Snooty",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "December 8",
  "wiki": "http://animalcrossing.wikia.com/wiki/Eloise",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Elvis",
  "id": "Elvis",
  "head": "Elvis.jpg",
  "species": "Lion",
  "personality": "Cranky",
  "coffee": "Blue Mountain - None - None",
  "birthday": "July 23",
  "wiki": "http://animalcrossing.wikia.com/wiki/Elvis",
  "store": "https://www.redbubble.com/people/purplepixel/works/16020141-elvis-animal-crossing"
}, {
  "name": "Emerald",
  "id": "Emerald",
  "head": "Emerald.jpg",
  "species": "Frog",
  "personality": "Normal",
  "coffee": "",
  "birthday": "July 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Emerald",
  "store": "https://www.redbubble.com/people/purplepixel/works/21268669-emerald-animal-crossing"
}, {
  "name": "Epona",
  "id": "Epona",
  "head": "wip.jpg",
  "species": "Horse",
  "personality": "Peppy",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "November 21",
  "wiki": "http://animalcrossing.wikia.com/wiki/Epona",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Erik",
  "id": "Erik",
  "head": "Erik.jpg",
  "species": "Deer",
  "personality": "Lazy",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "July 27",
  "wiki": "http://animalcrossing.wikia.com/wiki/Erik",
  "store": "https://www.redbubble.com/people/purplepixel/works/15238403-erik-animal-crossing"
}, {
  "name": "Etoile",
  "id": "Etoile",
  "head": "wip.jpg",
  "species": "Sheep",
  "personality": "Normal",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "December 25",
  "wiki": "http://animalcrossing.wikia.com/wiki/Etoile",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Eugene",
  "id": "Eugene",
  "head": "wip.jpg",
  "species": "Koala",
  "personality": "Smug",
  "coffee": "Mocha - None - None",
  "birthday": "October 26",
  "wiki": "http://animalcrossing.wikia.com/wiki/Eugene",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Eunice",
  "id": "Eunice",
  "head": "Eunice.jpg",
  "species": "Sheep",
  "personality": "Normal",
  "coffee": "Blue Mountain - A Little Milk - 1 Sugar",
  "birthday": "April 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Eunice",
  "store": "https://www.redbubble.com/people/purplepixel/works/16029198-eunice-animal-crossing"
}, {
  "name": "Faith",
  "id": "Faith",
  "head": "Faith.jpg",
  "species": "Koala",
  "personality": "Normal",
  "coffee": "",
  "birthday": "April 12",
  "wiki": "http://animalcrossing.wikia.com/wiki/Faith",
  "store": "https://www.redbubble.com/people/purplepixel/works/21615953-faith-animal-crossing"
}, {
  "name": "Fang",
  "id": "Fang",
  "head": "wip.jpg",
  "species": "Wolf",
  "personality": "Cranky",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "December 18",
  "wiki": "http://animalcrossing.wikia.com/wiki/Fang",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Fauna",
  "id": "Fauna",
  "head": "Fauna.jpg",
  "species": "Deer",
  "personality": "Normal",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "March 26",
  "wiki": "http://animalcrossing.wikia.com/wiki/Fauna",
  "store": "https://www.redbubble.com/people/purplepixel/works/17469106-fauna-animal-crossing"
}, {
  "name": "Felicity",
  "id": "Felicity",
  "head": "Felicity.jpg",
  "species": "Cat",
  "personality": "Peppy",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "March 30",
  "wiki": "http://animalcrossing.wikia.com/wiki/Felicity",
  "store": "https://www.redbubble.com/people/purplepixel/works/16546184-felicity-animal-crossing"
}, {
  "name": "Felyne",
  "id": "Felyne",
  "head": "Felyne.jpg",
  "species": "Cat",
  "personality": "Lazy",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "January 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Felyne",
  "store": "https://www.redbubble.com/people/purplepixel/works/15927920-felyne-animal-crossing"
}, {
  "name": "Filbert",
  "id": "Filbert",
  "head": "Filbert.jpg",
  "species": "Squirrel",
  "personality": "Lazy",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "June 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Filbert",
  "store": "https://www.redbubble.com/people/purplepixel/works/15235138-filbert-animal-crossing"
}, {
  "name": "Filly",
  "id": "Filly",
  "head": "Filly.jpg",
  "species": "Horse",
  "personality": "Normal",
  "coffee": "",
  "birthday": "July 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Filly",
  "store": "https://www.redbubble.com/people/purplepixel/works/28028229-filly-animal-crossing"
}, {
  "name": "Flash",
  "id": "Flash",
  "head": "wip.jpg",
  "species": "Bird",
  "personality": "Cranky",
  "coffee": "",
  "birthday": "September 22",
  "wiki": "http://animalcrossing.wikia.com/wiki/Flash",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Flip",
  "id": "Flip",
  "head": "wip.jpg",
  "species": "Monkey",
  "personality": "Jock",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "November 21",
  "wiki": "http://animalcrossing.wikia.com/wiki/Flip",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Flo",
  "id": "Flo",
  "head": "Flo.jpg",
  "species": "Penguin",
  "personality": "Uchi",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "September 21",
  "wiki": "http://animalcrossing.wikia.com/wiki/Flo",
  "store": "https://www.redbubble.com/people/purplepixel/works/17961460-flo-animal-crossing"
}, {
  "name": "Flora",
  "id": "Flora",
  "head": "Flora.jpg",
  "species": "Ostrich",
  "personality": "Peppy",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "February 9",
  "wiki": "http://animalcrossing.wikia.com/wiki/Flora",
  "store": "https://www.redbubble.com/people/purplepixel/works/17252510-flora-animal-crossing"
}, {
  "name": "Flossie",
  "id": "Flossie",
  "head": "Flossie.jpg",
  "species": "Mouse",
  "personality": "Peppy",
  "coffee": "",
  "birthday": "March 30",
  "wiki": "http://animalcrossing.wikia.com/wiki/Flossie",
  "store": "https://www.redbubble.com/people/purplepixel/works/23512313-flossie-animal-crosssing"
}, {
  "name": "Flurry",
  "id": "Flurry",
  "head": "Flurry.jpg",
  "species": "Hamster",
  "personality": "Normal",
  "coffee": "Mocha - None - None",
  "birthday": "January 30",
  "wiki": "http://animalcrossing.wikia.com/wiki/Flurry",
  "store": "https://www.redbubble.com/people/purplepixel/works/19811037-flurry-animal-crossing"
}, {
  "name": "Francine",
  "id": "Francine",
  "head": "Francine.jpg",
  "species": "Rabbit",
  "personality": "Snooty",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "January 22",
  "wiki": "http://animalcrossing.wikia.com/wiki/Francine",
  "store": "https://www.redbubble.com/people/purplepixel/works/15522329-francine-animal-crossing"
}, {
  "name": "Frank",
  "id": "Frank",
  "head": "Frank.jpg",
  "species": "Eagle",
  "personality": "Cranky",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "July 30",
  "wiki": "http://animalcrossing.wikia.com/wiki/Frank",
  "store": "https://www.redbubble.com/people/purplepixel/works/15282791-frank-animal-crossing"
}, {
  "name": "Freckles",
  "id": "Freckles",
  "head": "Freckles.jpg",
  "species": "Duck",
  "personality": "Peppy",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "February 19",
  "wiki": "http://animalcrossing.wikia.com/wiki/Freckles",
  "store": "https://www.redbubble.com/people/purplepixel/works/15721508-freckles-animal-crossing"
}, {
  "name": "Freya",
  "id": "Freya",
  "head": "wip.jpg",
  "species": "Wolf",
  "personality": "Snooty",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "December 14",
  "wiki": "http://animalcrossing.wikia.com/wiki/Freya",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Friga",
  "id": "Friga",
  "head": "Friga.jpg",
  "species": "Penguin",
  "personality": "Snooty",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "October 16",
  "wiki": "http://animalcrossing.wikia.com/wiki/Friga",
  "store": "https://www.redbubble.com/people/purplepixel/works/23888203-friga-animal-crossing"
}, {
  "name": "Frita",
  "id": "Frita",
  "head": "Frita.jpg",
  "species": "Sheep",
  "personality": "Uchi",
  "coffee": "Mocha - None - None",
  "birthday": "July 16",
  "wiki": "http://animalcrossing.wikia.com/wiki/Frita",
  "store": "https://www.redbubble.com/people/purplepixel/works/20889577-frita-animal-crossing"
}, {
  "name": "Frobert",
  "id": "Frobert",
  "head": "Frobert.jpg",
  "species": "Frog",
  "personality": "Jock",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "February 8",
  "wiki": "http://animalcrossing.wikia.com/wiki/Frobert",
  "store": "https://www.redbubble.com/people/purplepixel/works/20650900-frobert-animal-crossing"
}, {
  "name": "Fruity",
  "id": "Fruity",
  "head": "wip.jpg",
  "species": "Duck",
  "personality": "Jock",
  "coffee": "",
  "birthday": "January 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Fruity",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Fuchsia",
  "id": "Fuchsia",
  "head": "Fuchsia.jpg",
  "species": "Deer",
  "personality": "Uchi",
  "coffee": "Blue Mountain - None - None",
  "birthday": "September 19",
  "wiki": "http://animalcrossing.wikia.com/wiki/Fuchsia",
  "store": "https://www.redbubble.com/people/purplepixel/works/17591726-fuchsia-animal-crossing"
}, {
  "name": "Gabi",
  "id": "Gabi",
  "head": "wip.jpg",
  "species": "Rabbit",
  "personality": "Peppy",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "December 16",
  "wiki": "http://animalcrossing.wikia.com/wiki/Gabi",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Gala",
  "id": "Gala",
  "head": "Gala.jpg",
  "species": "Pig",
  "personality": "Normal",
  "coffee": "Mocha - None - None",
  "birthday": "March 5",
  "wiki": "http://animalcrossing.wikia.com/wiki/Gala",
  "store": "https://www.redbubble.com/people/purplepixel/works/20284477-gala-animal-crossing"
}, {
  "name": "Ganon",
  "id": "Ganon",
  "head": "Ganon.jpg",
  "species": "Pig",
  "personality": "Cranky",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "February 21",
  "wiki": "http://animalcrossing.wikia.com/wiki/Ganon",
  "store": "https://www.redbubble.com/people/purplepixel/works/25377916-ganon-animal-crossing"
}, {
  "name": "Gaston",
  "id": "Gaston",
  "head": "wip.jpg",
  "species": "Rabbit",
  "personality": "Cranky",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "October 28",
  "wiki": "http://animalcrossing.wikia.com/wiki/Gaston",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Gayle",
  "id": "Gayle",
  "head": "Gayle.jpg",
  "species": "Alligator",
  "personality": "Normal",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "May 17",
  "wiki": "http://animalcrossing.wikia.com/wiki/Gayle",
  "store": "https://www.redbubble.com/people/purplepixel/works/22467057-gayle-animal-crossing"
}, {
  "name": "Gen",
  "id": "Gen",
  "head": "Gen.jpg",
  "species": "Sheep",
  "personality": "Jock",
  "coffee": "",
  "birthday": "October 10",
  "wiki": "http://animalcrossing.wikia.com/wiki/Gen",
  "store": "https://www.redbubble.com/people/purplepixel/works/27930373-gen-animal-crossing"
}, {
  "name": "Genji",
  "id": "Genji",
  "head": "Genji.jpg",
  "species": "Rabbit",
  "personality": "Jock",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "January 21",
  "wiki": "http://animalcrossing.wikia.com/wiki/Genji",
  "store": "https://www.redbubble.com/people/purplepixel/works/15987575-genji-animal-crossing"
}, {
  "name": "Gigi",
  "id": "Gigi",
  "head": "Gigi.jpg",
  "species": "Frog",
  "personality": "Snooty",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "August 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Gigi",
  "store": "https://www.redbubble.com/people/purplepixel/works/29796019-gigi-animal-crossing"
}, {
  "name": "Gladys",
  "id": "Gladys",
  "head": "Gladys.jpg",
  "species": "Ostrich",
  "personality": "Normal",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "January 15",
  "wiki": "http://animalcrossing.wikia.com/wiki/Gladys",
  "store": "https://www.redbubble.com/people/purplepixel/works/24853098-gladys-animal-crossing"
}, {
  "name": "Gloria",
  "id": "Gloria",
  "head": "Gloria.jpg",
  "species": "Duck",
  "personality": "Snooty",
  "coffee": "Blend - None - None",
  "birthday": "August 12",
  "wiki": "http://animalcrossing.wikia.com/wiki/Gloria",
  "store": "https://www.redbubble.com/people/purplepixel/works/29839887-gloria-animal-crossing"
}, {
  "name": "Goldie",
  "id": "Goldie",
  "head": "wip.jpg",
  "species": "Dog",
  "personality": "Normal",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "December 27",
  "wiki": "http://animalcrossing.wikia.com/wiki/Goldie",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Gonzo",
  "id": "Gonzo",
  "head": "Gonzo.jpg",
  "species": "Koala",
  "personality": "Cranky",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "October 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Gonzo",
  "store": "https://www.redbubble.com/people/purplepixel/works/23588664-gonzo-animal-crossing"
}, {
  "name": "Goose",
  "id": "Goose",
  "head": "Goose.jpg",
  "species": "Chicken",
  "personality": "Jock",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "October 4",
  "wiki": "http://animalcrossing.wikia.com/wiki/Goose",
  "store": "https://www.redbubble.com/people/purplepixel/works/16043984-goose-animal-crossing"
}, {
  "name": "Graham",
  "id": "Graham",
  "head": "Graham.jpg",
  "species": "Hamster",
  "personality": "Smug",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "June 20",
  "wiki": "http://animalcrossing.wikia.com/wiki/Graham",
  "store": "https://www.redbubble.com/people/purplepixel/works/23387254-graham-animal-crossing"
}, {
  "name": "Greta",
  "id": "Greta",
  "head": "Greta.jpg",
  "species": "Mouse",
  "personality": "Snooty",
  "coffee": "Mocha - None - None",
  "birthday": "September 5",
  "wiki": "http://animalcrossing.wikia.com/wiki/Greta",
  "store": "https://www.redbubble.com/people/purplepixel/works/20835369-greta-animal-crossing"
}, {
  "name": "Grizzly",
  "id": "Grizzly",
  "head": "Grizzly.jpg",
  "species": "Bear",
  "personality": "Cranky",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "July 31",
  "wiki": "http://animalcrossing.wikia.com/wiki/Grizzly",
  "store": "https://www.redbubble.com/people/purplepixel/works/29102668-grizzly-animal-crossing"
}, {
  "name": "Groucho",
  "id": "Groucho",
  "head": "wip.jpg",
  "species": "Bear",
  "personality": "Cranky",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "October 23",
  "wiki": "http://animalcrossing.wikia.com/wiki/Groucho",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Gruff",
  "id": "Gruff",
  "head": "Gruff.jpg",
  "species": "Goat",
  "personality": "Cranky",
  "coffee": "Blend - Regular Milk - 1 Sugar",
  "birthday": "August 29",
  "wiki": "http://animalcrossing.wikia.com/wiki/Gruff",
  "store": "https://www.redbubble.com/people/purplepixel/works/21974633-gruff-animal-crossing"
}, {
  "name": "Gwen",
  "id": "Gwen",
  "head": "Gwen.jpg",
  "species": "Penguin",
  "personality": "Snooty",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "January 23",
  "wiki": "http://animalcrossing.wikia.com/wiki/Gwen",
  "store": "https://www.redbubble.com/people/purplepixel/works/24973895-gwen-animal-crossing"
}, {
  "name": "Hambo",
  "id": "Hambo",
  "head": "wip.jpg",
  "species": "Pig",
  "personality": "Jock",
  "coffee": "",
  "birthday": "September 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Hambo",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Hamlet",
  "id": "Hamlet",
  "head": "Hamlet.jpg",
  "species": "Hamster",
  "personality": "Jock",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "May 30",
  "wiki": "http://animalcrossing.wikia.com/wiki/Hamlet",
  "store": "https://www.redbubble.com/people/purplepixel/works/16040604-hamlet-animal-crossing"
}, {
  "name": "Hamphrey",
  "id": "Hamphrey",
  "head": "Hamphrey.jpg",
  "species": "Hamster",
  "personality": "Cranky",
  "coffee": "Blue Mountain - A Little Milk - 1 Sugar",
  "birthday": "February 25",
  "wiki": "http://animalcrossing.wikia.com/wiki/Hamphrey",
  "store": "https://www.redbubble.com/people/purplepixel/works/15802712-hamphrey-animal-crossing"
}, {
  "name": "Hank",
  "id": "Hank",
  "head": "wip.jpg",
  "species": "Chicken",
  "personality": "Jock",
  "coffee": "",
  "birthday": "September 29",
  "wiki": "http://animalcrossing.wikia.com/wiki/Hank",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Hans",
  "id": "Hans",
  "head": "wip.jpg",
  "species": "Gorilla",
  "personality": "Smug",
  "coffee": "Blend Mountain - None - None",
  "birthday": "December 5",
  "wiki": "http://animalcrossing.wikia.com/wiki/Hans",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Harry",
  "id": "Harry",
  "head": "Harry.jpg",
  "species": "Hippo",
  "personality": "Cranky",
  "coffee": "Mocha - None - None",
  "birthday": "January 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Harry",
  "store": "https://www.redbubble.com/people/purplepixel/works/24746049-harry-animal-crossing"
}, {
  "name": "Hazel",
  "id": "Hazel",
  "head": "Hazel.jpg",
  "species": "Squirrel",
  "personality": "Uchi",
  "coffee": "Blend - None - None",
  "birthday": "August 30",
  "wiki": "http://animalcrossing.wikia.com/wiki/Hazel",
  "store": "https://www.redbubble.com/people/purplepixel/works/15574560-hazel-animal-crossing"
}, {
  "name": "Hector",
  "id": "Hector",
  "head": "Hector.jpg",
  "species": "Chicken",
  "personality": "Jock",
  "coffee": "",
  "birthday": "April 5",
  "wiki": "http://animalcrossing.wikia.com/wiki/Hector",
  "store": "https://www.redbubble.com/people/purplepixel/works/25336096-hector-animal-crossing"
}, {
  "name": "Henry",
  "id": "Henry",
  "head": "Henry.jpg",
  "species": "Frog",
  "personality": "Smug",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "September 21",
  "wiki": "http://animalcrossing.wikia.com/wiki/Henry",
  "store": "https://www.redbubble.com/people/purplepixel/works/15879357-henry-animal-crossing"
}, {
  "name": "Hippeux",
  "id": "Hippeux",
  "head": "Hippeux.jpg",
  "species": "Hippo",
  "personality": "Smug",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "October 15",
  "wiki": "http://animalcrossing.wikia.com/wiki/Hippeux",
  "store": "https://www.redbubble.com/people/purplepixel/works/20956393-hippeux-animal-crossing"
}, {
  "name": "Holden",
  "id": "Holden",
  "head": "Holden.jpg",
  "species": "Hamster",
  "personality": "Lazy",
  "coffee": "",
  "birthday": "June 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Holden",
  "store": "https://www.redbubble.com/people/purplepixel/works/27597178-holden-animal-crossing"
}, {
  "name": "Hopkins",
  "id": "Hopkins",
  "head": "Hopkins.jpg",
  "species": "Rabbit",
  "personality": "Lazy",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "March 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Hopkins",
  "store": "https://www.redbubble.com/people/purplepixel/works/25652540-hopkins-animal-crossing"
}, {
  "name": "Hopper",
  "id": "Hopper",
  "head": "Hopper.jpg",
  "species": "Penguin",
  "personality": "Cranky",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "April 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Hopper",
  "store": "https://www.redbubble.com/people/purplepixel/works/22210630-hopper-animal-crossing"
}, {
  "name": "Hornsby",
  "id": "Hornsby",
  "head": "Hornsby.jpg",
  "species": "Rhino",
  "personality": "Lazy",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "March 20",
  "wiki": "http://animalcrossing.wikia.com/wiki/Hornsby",
  "store": "https://www.redbubble.com/people/purplepixel/works/19303882-hornsby-animal-crossing"
}, {
  "name": "Huck",
  "id": "Huck",
  "head": "Huck.jpg",
  "species": "Frog",
  "personality": "Smug",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "January 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Huck",
  "store": "https://www.redbubble.com/people/purplepixel/works/22188086-huck-animal-crossing"
}, {
  "name": "Huggy",
  "id": "Huggy",
  "head": "Huggy.jpg",
  "species": "Koala",
  "personality": "Peppy",
  "coffee": "",
  "birthday": "February 17",
  "wiki": "http://animalcrossing.wikia.com/wiki/Huggy",
  "store": "https://www.redbubble.com/people/purplepixel/works/25663736-huggy-animal-crossing"
}, {
  "name": "Hugh",
  "id": "Hugh",
  "head": "wip.jpg",
  "species": "Pig",
  "personality": "Lazy",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "December 30",
  "wiki": "http://animalcrossing.wikia.com/wiki/Hugh",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Iggly",
  "id": "Iggly",
  "head": "wip.jpg",
  "species": "Penguin",
  "personality": "Jock",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "November 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Iggly",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Iggy",
  "id": "Iggy",
  "head": "wip.jpg",
  "species": "Goat",
  "personality": "Jock",
  "coffee": "",
  "birthday": "August 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Iggy",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Ike",
  "id": "Ike",
  "head": "Ike.jpg",
  "species": "Bear",
  "personality": "Cranky",
  "coffee": "Mocha - None - None",
  "birthday": "May 16",
  "wiki": "http://animalcrossing.wikia.com/wiki/Ike",
  "store": "https://www.redbubble.com/people/purplepixel/works/19231803-ike-animal-crossing"
}, {
  "name": "Inkwell",
  "id": "Inkwell",
  "head": "Inkwell.jpg",
  "species": "Octopus",
  "personality": "Jock",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "June 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Inkwell",
  "store": "https://www.redbubble.com/people/purplepixel/works/26907467-inkwell-animal-crossing"
}, {
  "name": "Jacob",
  "id": "Jacob",
  "head": "Jacob.jpg",
  "species": "Bird",
  "personality": "Lazy",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "August 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Jacob",
  "store": "https://www.redbubble.com/people/purplepixel/works/30508140-jacob-animal-crossing"
}, {
  "name": "Jacques",
  "id": "Jacques",
  "head": "Jacques.jpg",
  "species": "Bird",
  "personality": "Smug",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "June 22",
  "wiki": "http://animalcrossing.wikia.com/wiki/Jacques",
  "store": "https://www.redbubble.com/people/purplepixel/works/20307630-jacques-animal-crossing"
}, {
  "name": "Jambette",
  "id": "Jambette",
  "head": "wip.jpg",
  "species": "Frog",
  "personality": "Normal",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "October 27",
  "wiki": "http://animalcrossing.wikia.com/wiki/Jambette",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Jane",
  "id": "Jane",
  "head": "Jane.jpg",
  "species": "Gorilla",
  "personality": "Snooty",
  "coffee": "",
  "birthday": "January 25",
  "wiki": "http://animalcrossing.wikia.com/wiki/Jane",
  "store": "https://www.redbubble.com/people/purplepixel/works/20519339-jane-animal-crossing"
}, {
  "name": "Jay",
  "id": "Jay",
  "head": "Jay.jpg",
  "species": "Bird",
  "personality": "Jock",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "July 17",
  "wiki": "http://animalcrossing.wikia.com/wiki/Jay",
  "store": "https://www.redbubble.com/people/purplepixel/works/22630059-jay-animal-crossing"
}, {
  "name": "Jeremiah",
  "id": "Jeremiah",
  "head": "Jeremiah.jpg",
  "species": "Frog",
  "personality": "Lazy",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "July 8",
  "wiki": "http://animalcrossing.wikia.com/wiki/Jeremiah",
  "store": "https://www.redbubble.com/people/purplepixel/works/22465325-jeremiah-animal-crossing"
}, {
  "name": "Jitters",
  "id": "Jitters",
  "head": "Jitters.jpg",
  "species": "Bird",
  "personality": "Jock",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "February 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Jitters",
  "store": "https://www.redbubble.com/people/purplepixel/works/25116788-jitters-animal-crossing"
}, {
  "name": "Joe",
  "id": "Joe",
  "head": "wip.jpg",
  "species": "Bird",
  "personality": "Cranky",
  "coffee": "",
  "birthday": "December 8",
  "wiki": "http://animalcrossing.wikia.com/wiki/Joe",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Joey",
  "id": "Joey",
  "head": "Joey.jpg",
  "species": "Duck",
  "personality": "Lazy",
  "coffee": "Blend - None - None",
  "birthday": "January 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Joey",
  "store": "https://www.redbubble.com/people/purplepixel/works/22156820-joey-animal-crossing"
}, {
  "name": "Jubei",
  "id": "Jubei",
  "head": "wip.jpg",
  "species": "Lion",
  "personality": "Cranky",
  "coffee": "",
  "birthday": "October 16",
  "wiki": "http://animalcrossing.wikia.com/wiki/Jubei",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Julia",
  "id": "Julia",
  "head": "Julia.jpg",
  "species": "Ostrich",
  "personality": "Snooty",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "July 31",
  "wiki": "http://animalcrossing.wikia.com/wiki/Julia",
  "store": "https://www.redbubble.com/people/purplepixel/works/21758188-julia-animal-crossing"
}, {
  "name": "Julian",
  "id": "Julian",
  "head": "Julian.jpg",
  "species": "Horse",
  "personality": "Smug",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "March 15",
  "wiki": "http://animalcrossing.wikia.com/wiki/Julian",
  "store": "https://www.redbubble.com/people/purplepixel/works/15961811-julian-animal-crossing"
}, {
  "name": "June",
  "id": "June",
  "head": "June.jpg",
  "species": "Cub",
  "personality": "Normal",
  "coffee": "Blue Mountain - None - None",
  "birthday": "May 21",
  "wiki": "http://animalcrossing.wikia.com/wiki/June",
  "store": "https://www.redbubble.com/people/purplepixel/works/23988684-june-animal-crossing"
}, {
  "name": "Kabuki",
  "id": "Kabuki",
  "head": "wip.jpg",
  "species": "Cat",
  "personality": "Cranky",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "November 29",
  "wiki": "http://animalcrossing.wikia.com/wiki/Kabuki",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Katt",
  "id": "Katt",
  "head": "Katt.jpg",
  "species": "Cat",
  "personality": "Uchi",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "April 27",
  "wiki": "http://animalcrossing.wikia.com/wiki/Katt",
  "store": "https://www.redbubble.com/people/purplepixel/works/15384158-katt-animal-crossing"
}, {
  "name": "Keaton",
  "id": "Keaton",
  "head": "Keaton.jpg",
  "species": "Eagle",
  "personality": "Smug",
  "coffee": "Blend - None - None",
  "birthday": "June 1",
  "wiki": "http://animalcrossing.wikia.com/wiki/Keaton",
  "store": "https://www.redbubble.com/people/purplepixel/works/22215009-keaton-animal-crossing"
}, {
  "name": "Ken",
  "id": "Ken",
  "head": "wip.jpg",
  "species": "Chicken",
  "personality": "Smug",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "December 23",
  "wiki": "http://animalcrossing.wikia.com/wiki/Ken",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Ketchup",
  "id": "Ketchup",
  "head": "Ketchup.jpg",
  "species": "Duck",
  "personality": "Peppy",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "June 27",
  "wiki": "http://animalcrossing.wikia.com/wiki/Ketchup",
  "store": "https://www.redbubble.com/people/purplepixel/works/21889807-ketchup-animal-crossing"
}, {
  "name": "Kevin",
  "id": "Kevin",
  "head": "Kevin.jpg",
  "species": "Pig",
  "personality": "Jock",
  "coffee": "Mocha - None - None",
  "birthday": "April 26",
  "wiki": "http://animalcrossing.wikia.com/wiki/Kevin",
  "store": "https://www.redbubble.com/people/purplepixel/works/23036018-kevin-animal-crossing"
}, {
  "name": "Kid Cat",
  "id": "Kid Cat",
  "head": "Kid Cat.jpg",
  "species": "Cat",
  "personality": "Jock",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "August 1",
  "wiki": "http://animalcrossing.wikia.com/wiki/Kid Cat",
  "store": "https://www.redbubble.com/people/purplepixel/works/16119389-kid-cat-animal-crossing"
}, {
  "name": "Kidd",
  "id": "Kidd",
  "head": "Kidd.jpg",
  "species": "Goat",
  "personality": "Smug",
  "coffee": "Kilimanjaro - Regular Milk - 2 Sugars",
  "birthday": "June 28",
  "wiki": "http://animalcrossing.wikia.com/wiki/Kidd",
  "store": "https://www.redbubble.com/people/purplepixel/works/21707147-kidd-animal-crossing"
}, {
  "name": "Kiki",
  "id": "Kiki",
  "head": "Kiki.jpg",
  "species": "Cat",
  "personality": "Normal",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "October 8",
  "wiki": "http://animalcrossing.wikia.com/wiki/Kiki",
  "store": "https://www.redbubble.com/people/purplepixel/works/17274263-kiki-animal-crossing"
}, {
  "name": "Kit",
  "id": "Kit",
  "head": "wip.jpg",
  "species": "Squirrel",
  "personality": "Jock",
  "coffee": "",
  "birthday": "June 8",
  "wiki": "http://animalcrossing.wikia.com/wiki/Kit",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Kitt",
  "id": "Kitt",
  "head": "Kitt.jpg",
  "species": "Kangaroo",
  "personality": "Normal",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "October 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Kitt",
  "store": "https://www.redbubble.com/people/purplepixel/works/16198680-kitt-animal-crossing"
}, {
  "name": "Kitty",
  "id": "Kitty",
  "head": "Kitty.jpg",
  "species": "Cat",
  "personality": "Snooty",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "February 15",
  "wiki": "http://animalcrossing.wikia.com/wiki/Kitty",
  "store": "https://www.redbubble.com/people/purplepixel/works/20072551-kitty-animal-crossing"
}, {
  "name": "Klaus",
  "id": "Klaus",
  "head": "Klaus.jpg",
  "species": "Bear",
  "personality": "Smug",
  "coffee": "Blue Mountain - A Little Milk - 1 Sugar",
  "birthday": "March 31",
  "wiki": "http://animalcrossing.wikia.com/wiki/Klaus",
  "store": "https://www.redbubble.com/people/purplepixel/works/25970392-klaus-animal-crossing"
}, {
  "name": "Knox",
  "id": "Knox",
  "head": "wip.jpg",
  "species": "Chicken",
  "personality": "Cranky",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "November 23",
  "wiki": "http://animalcrossing.wikia.com/wiki/Knox",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Kody",
  "id": "Kody",
  "head": "Kody.jpg",
  "species": "Cub",
  "personality": "Jock",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "September 28",
  "wiki": "http://animalcrossing.wikia.com/wiki/Kody",
  "store": "https://www.redbubble.com/people/purplepixel/works/20191499-kody-animal-crossing"
}, {
  "name": "Koharu",
  "id": "Koharu",
  "head": "wip.jpg",
  "species": "Kangaroo",
  "personality": "Peppy",
  "coffee": "",
  "birthday": "February 14",
  "wiki": "http://animalcrossing.wikia.com/wiki/Koharu",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Kyle",
  "id": "Kyle",
  "head": "wip.jpg",
  "species": "Wolf",
  "personality": "Smug",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "December 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Kyle",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Leigh",
  "id": "Leigh",
  "head": "wip.jpg",
  "species": "Chicken",
  "personality": "Peppy",
  "coffee": "",
  "birthday": "December 5",
  "wiki": "http://animalcrossing.wikia.com/wiki/Leigh",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Leonardo",
  "id": "Leonardo",
  "head": "Leonardo.jpg",
  "species": "Tiger",
  "personality": "Jock",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "May 15",
  "wiki": "http://animalcrossing.wikia.com/wiki/Leonardo",
  "store": "https://www.redbubble.com/people/purplepixel/works/15689291-leonardo-animal-crossing"
}, {
  "name": "Leopold",
  "id": "Leopold",
  "head": "Leopold.jpg",
  "species": "Lion",
  "personality": "Jock",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "August 14",
  "wiki": "http://animalcrossing.wikia.com/wiki/Leopold",
  "store": "https://www.redbubble.com/people/purplepixel/works/22840695-leopold-animal-crossing"
}, {
  "name": "Lily",
  "id": "Lily",
  "head": "Lily.jpg",
  "species": "Frog",
  "personality": "Normal",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "February 4",
  "wiki": "http://animalcrossing.wikia.com/wiki/Lily",
  "store": "https://www.redbubble.com/people/purplepixel/works/15975647-lily-animal-crossing"
}, {
  "name": "Limberg",
  "id": "Limberg",
  "head": "Limberg.jpg",
  "species": "Mouse",
  "personality": "Cranky",
  "coffee": "Mocha - None - None",
  "birthday": "October 17",
  "wiki": "http://animalcrossing.wikia.com/wiki/Limberg",
  "store": "https://www.redbubble.com/people/purplepixel/works/21652665-limberg-animal-crossing"
}, {
  "name": "Lionel",
  "id": "Lionel",
  "head": "Lionel.jpg",
  "species": "Lion",
  "personality": "Smug",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "July 29",
  "wiki": "http://animalcrossing.wikia.com/wiki/Lionel",
  "store": "https://www.redbubble.com/people/purplepixel/works/15270415-lionel-animal-crossing"
}, {
  "name": "Liz",
  "id": "Liz",
  "head": "wip.jpg",
  "species": "Alligator",
  "personality": "Normal",
  "coffee": "",
  "birthday": "September 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Liz",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Lobo",
  "id": "Lobo",
  "head": "wip.jpg",
  "species": "Wolf",
  "personality": "Cranky",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "November 5",
  "wiki": "http://animalcrossing.wikia.com/wiki/Lobo",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Lolly",
  "id": "Lolly",
  "head": "Lolly.jpg",
  "species": "Cat",
  "personality": "Normal",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "March 27",
  "wiki": "http://animalcrossing.wikia.com/wiki/Lolly",
  "store": "https://www.redbubble.com/people/purplepixel/works/16102314-lolly-animal-crossing"
}, {
  "name": "Lopez",
  "id": "Lopez",
  "head": "Lopez.jpg",
  "species": "Deer",
  "personality": "Smug",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "August 20",
  "wiki": "http://animalcrossing.wikia.com/wiki/Lopez",
  "store": "https://www.redbubble.com/people/purplepixel/works/30221919-lopez-animal-crossing"
}, {
  "name": "Louie",
  "id": "Louie",
  "head": "Louie.jpg",
  "species": "Gorilla",
  "personality": "Jock",
  "coffee": "Blue Mountain - None - None",
  "birthday": "March 26",
  "wiki": "http://animalcrossing.wikia.com/wiki/Louie",
  "store": "https://www.redbubble.com/people/purplepixel/works/25918607-louie-animal-crossing"
}, {
  "name": "Lucha",
  "id": "Lucha",
  "head": "wip.jpg",
  "species": "Bird",
  "personality": "Smug",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "December 12",
  "wiki": "http://animalcrossing.wikia.com/wiki/Lucha",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Lucky",
  "id": "Lucky",
  "head": "wip.jpg",
  "species": "Dog",
  "personality": "Lazy",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "November 4",
  "wiki": "http://animalcrossing.wikia.com/wiki/Lucky",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Lucy",
  "id": "Lucy",
  "head": "Lucy.jpg",
  "species": "Pig",
  "personality": "Normal",
  "coffee": "Mocha - None - None",
  "birthday": "June 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Lucy",
  "store": "https://www.redbubble.com/people/purplepixel/works/21002141-lucy-animal-crossing"
}, {
  "name": "Lulu",
  "id": "Lulu (2)",
  "head": "wip.jpg",
  "species": "Hippo",
  "personality": "Peppy",
  "coffee": "",
  "birthday": "December 19",
  "wiki": "http://animalcrossing.wikia.com/wiki/Lulu_(villager)",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Lulu",
  "id": "Lulu",
  "head": "Lulu.jpg",
  "species": "Anteater",
  "personality": "Peppy",
  "coffee": "",
  "birthday": "February 16",
  "wiki": "http://animalcrossing.wikia.com/wiki/Lulu_(islander)",
  "store": "https://www.redbubble.com/people/purplepixel/works/21389592-lulu-animal-crossing"
}, {
  "name": "Lyman",
  "id": "Lyman",
  "head": "Lyman.jpg",
  "species": "Koala",
  "personality": "Jock",
  "coffee": "Mocha - None - None",
  "birthday": "October 12",
  "wiki": "http://animalcrossing.wikia.com/wiki/Lyman",
  "store": "https://www.redbubble.com/people/purplepixel/works/34091943-lyman-animal-crossing"
}, {
  "name": "Mac",
  "id": "Mac",
  "head": "wip.jpg",
  "species": "Dog",
  "personality": "Jock",
  "coffee": "Blend - None - None",
  "birthday": "November 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Mac",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Madam Rosa",
  "id": "Madam Rosa",
  "head": "Madam Rosa.jpg",
  "species": "Bird",
  "personality": "Snooty",
  "coffee": "",
  "birthday": "November 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Madam Rosa",
  "store": "https://www.redbubble.com/people/purplepixel/works/32279685-madam-rosa-animal-crossing"
}, {
  "name": "Maddie",
  "id": "Maddie",
  "head": "Maddie.jpg",
  "species": "Dog",
  "personality": "Peppy",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "January 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Maddie",
  "store": "https://www.redbubble.com/people/purplepixel/works/24799430-maddie-animal-crossing"
}, {
  "name": "Maelle",
  "id": "Maelle",
  "head": "Maelle.jpg",
  "species": "Duck",
  "personality": "Snooty",
  "coffee": "Blend - None - None",
  "birthday": "April 8",
  "wiki": "http://animalcrossing.wikia.com/wiki/Maelle",
  "store": "https://www.redbubble.com/people/purplepixel/works/26064176-maelle-animal-crossing"
}, {
  "name": "Maggie",
  "id": "Maggie",
  "head": "Maggie.jpg",
  "species": "Pig",
  "personality": "Normal",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "September 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Maggie",
  "store": "https://www.redbubble.com/people/purplepixel/works/31428137-maggie-animal-crossing"
}, {
  "name": "Mallary",
  "id": "Mallary",
  "head": "wip.jpg",
  "species": "Duck",
  "personality": "Snooty",
  "coffee": "Blend - None - None",
  "birthday": "November 17",
  "wiki": "http://animalcrossing.wikia.com/wiki/Mallary",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Maple",
  "id": "Maple",
  "head": "Maple.jpg",
  "species": "Cub",
  "personality": "Normal",
  "coffee": "Kilimanjaro - Regular Milk - 2 Sugars",
  "birthday": "June 15",
  "wiki": "http://animalcrossing.wikia.com/wiki/Maple",
  "store": "https://www.redbubble.com/people/purplepixel/works/17835253-maple-animal-crossing"
}, {
  "name": "Marcel",
  "id": "Marcel",
  "head": "wip.jpg",
  "species": "Dog",
  "personality": "Lazy",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "December 31",
  "wiki": "http://animalcrossing.wikia.com/wiki/Marcel",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Marcie",
  "id": "Marcie",
  "head": "Marcie.jpg",
  "species": "Kangaroo",
  "personality": "Normal",
  "coffee": "Mocha - None - None",
  "birthday": "May 31",
  "wiki": "http://animalcrossing.wikia.com/wiki/Marcie",
  "store": "https://www.redbubble.com/people/purplepixel/works/19994786-marcie-animal-crossing"
}, {
  "name": "Marcy",
  "id": "Marcy",
  "head": "Marcy.jpg",
  "species": "Kangaroo",
  "personality": "Peppy",
  "coffee": "",
  "birthday": "May 31",
  "wiki": "http://animalcrossing.wikia.com/wiki/Marcy",
  "store": "https://www.redbubble.com/people/purplepixel/works/22041559-marcy-animal-crossing"
}, {
  "name": "Margie",
  "id": "Margie",
  "head": "Margie.jpg",
  "species": "Elephant",
  "personality": "Normal",
  "coffee": "Blend - None - None",
  "birthday": "January 28",
  "wiki": "http://animalcrossing.wikia.com/wiki/Margie",
  "store": "https://www.redbubble.com/people/purplepixel/works/20973415-margie-animal-crossing"
}, {
  "name": "Marina",
  "id": "Marina",
  "head": "Marina.jpg",
  "species": "Octopus",
  "personality": "Normal",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "June 26",
  "wiki": "http://animalcrossing.wikia.com/wiki/Marina",
  "store": "https://www.redbubble.com/people/purplepixel/works/15586967-marina-animal-crossing"
}, {
  "name": "Marshal",
  "id": "Marshal",
  "head": "Marshal.jpg",
  "species": "Squirrel",
  "personality": "Smug",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "September 29",
  "wiki": "http://animalcrossing.wikia.com/wiki/Marshal",
  "store": "https://www.redbubble.com/people/purplepixel/works/15239647-marshal-animal-crossing"
}, {
  "name": "Marty",
  "id": "Marty",
  "head": "Marty.jpg",
  "species": "Cub",
  "personality": "Lazy",
  "coffee": "Blue Mountain - None - None",
  "birthday": "April 16",
  "wiki": "http://animalcrossing.wikia.com/wiki/Marty",
  "store": "https://www.redbubble.com/people/purplepixel/works/23068994-marty-animal-crossing"
}, {
  "name": "Masa",
  "id": "Masa",
  "head": "wip.jpg",
  "species": "Dog",
  "personality": "Cranky",
  "coffee": "",
  "birthday": "May 26",
  "wiki": "http://animalcrossing.wikia.com/wiki/Masa",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Mathilda",
  "id": "Mathilda",
  "head": "wip.jpg",
  "species": "Kangaroo",
  "personality": "Snooty",
  "coffee": "Blue Mountain - A Little Milk - 1 Sugar",
  "birthday": "November ",
  "wiki": "http://animalcrossing.wikia.com/wiki/Mathilda",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Medli",
  "id": "Medli",
  "head": "wip.jpg",
  "species": "Bird",
  "personality": "Normal",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "December 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Medli",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Megumi",
  "id": "Megumi",
  "head": "Megumi.jpg",
  "species": "Dog",
  "personality": "Peppy",
  "coffee": "",
  "birthday": "April 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Megumi",
  "store": "https://www.redbubble.com/people/purplepixel/works/20789079-megumi-animal-crossing"
}, {
  "name": "Melba",
  "id": "Melba",
  "head": "Melba.jpg",
  "species": "Koala",
  "personality": "Normal",
  "coffee": "Mocha - None - None",
  "birthday": "April 12",
  "wiki": "http://animalcrossing.wikia.com/wiki/Melba",
  "store": "https://www.redbubble.com/people/purplepixel/works/16253665-melba-animal-crossing"
}, {
  "name": "Meow",
  "id": "Meow",
  "head": "wip.jpg",
  "species": "Cat",
  "personality": "Peppy",
  "coffee": "",
  "birthday": "August 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Meow",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Merengue",
  "id": "Merengue",
  "head": "Merengue.jpg",
  "species": "Rhino",
  "personality": "Normal",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "March 19",
  "wiki": "http://animalcrossing.wikia.com/wiki/Merengue",
  "store": "https://www.redbubble.com/people/purplepixel/works/15238457-merengue-animal-crossing"
}, {
  "name": "Merry",
  "id": "Merry",
  "head": "Merry.jpg",
  "species": "Cat",
  "personality": "Peppy",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "June 29",
  "wiki": "http://animalcrossing.wikia.com/wiki/Merry",
  "store": "https://www.redbubble.com/people/purplepixel/works/19016771-merry-animal-crossing"
}, {
  "name": "Midge",
  "id": "Midge",
  "head": "Midge.jpg",
  "species": "Bird",
  "personality": "Normal",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "March 12",
  "wiki": "http://animalcrossing.wikia.com/wiki/Midge",
  "store": "https://www.redbubble.com/people/purplepixel/works/16045752-midge-animal-crossing"
}, {
  "name": "Mint",
  "id": "Mint",
  "head": "Mint.jpg",
  "species": "Squirrel",
  "personality": "Snooty",
  "coffee": "Blend - None - None",
  "birthday": "May 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Mint",
  "store": "https://www.redbubble.com/people/purplepixel/works/26303393-mint-animal-crossing"
}, {
  "name": "Mira",
  "id": "Mira",
  "head": "Mira.jpg",
  "species": "Rabbit",
  "personality": "Uchi",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "July 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Mira",
  "store": "https://www.redbubble.com/people/purplepixel/works/18879086-mira-animal-crossing"
}, {
  "name": "Miranda",
  "id": "Miranda",
  "head": "Miranda.jpg",
  "species": "Duck",
  "personality": "Snooty",
  "coffee": "Blend - None - None",
  "birthday": "April 23",
  "wiki": "http://animalcrossing.wikia.com/wiki/Miranda",
  "store": "https://www.redbubble.com/people/purplepixel/works/20813899-miranda-animal-crossing"
}, {
  "name": "Mitzi",
  "id": "Mitzi",
  "head": "Mitzi.jpg",
  "species": "Cat",
  "personality": "Normal",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "September 25",
  "wiki": "http://animalcrossing.wikia.com/wiki/Mitzi",
  "store": "https://www.redbubble.com/people/purplepixel/works/20731185-mitzi-animal-crossing"
}, {
  "name": "Moe",
  "id": "Moe",
  "head": "Moe.jpg",
  "species": "Cat",
  "personality": "Lazy",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "January 12",
  "wiki": "http://animalcrossing.wikia.com/wiki/Moe",
  "store": "https://www.redbubble.com/people/purplepixel/works/15856662-moe-animal-crossing"
}, {
  "name": "Molly",
  "id": "Molly",
  "head": "Molly.jpg",
  "species": "Duck",
  "personality": "Normal",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "March 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Molly",
  "store": "https://www.redbubble.com/people/purplepixel/works/25597008-molly-animal-crossing"
}, {
  "name": "Monique",
  "id": "Monique",
  "head": "Monique.jpg",
  "species": "Cat",
  "personality": "Snooty",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "September 30",
  "wiki": "http://animalcrossing.wikia.com/wiki/Monique",
  "store": "https://www.redbubble.com/people/purplepixel/works/21257867-monique-animal-crossing"
}, {
  "name": "Monty",
  "id": "Monty",
  "head": "wip.jpg",
  "species": "Monkey",
  "personality": "Cranky",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "December 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Monty",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Moose",
  "id": "Moose",
  "head": "Moose.jpg",
  "species": "Mouse",
  "personality": "Jock",
  "coffee": "Mocha - None - None",
  "birthday": "September 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Moose",
  "store": "https://www.redbubble.com/people/purplepixel/works/22190484-moose-animal-crossing"
}, {
  "name": "Mott",
  "id": "Mott",
  "head": "Mott.jpg",
  "species": "Lion",
  "personality": "Jock",
  "coffee": "Blue Mountain - None - None",
  "birthday": "July 10",
  "wiki": "http://animalcrossing.wikia.com/wiki/Mott",
  "store": "https://www.redbubble.com/people/purplepixel/works/22514858-mott-animal-crossing"
}, {
  "name": "Muffy",
  "id": "Muffy",
  "head": "Muffy.jpg",
  "species": "Sheep",
  "personality": "Uchi",
  "coffee": "Mocha - None - None",
  "birthday": "February 14",
  "wiki": "http://animalcrossing.wikia.com/wiki/Muffy",
  "store": "https://www.redbubble.com/people/purplepixel/works/17491732-muffy-animal-crossing"
}, {
  "name": "Murphy",
  "id": "Murphy",
  "head": "wip.jpg",
  "species": "Cub",
  "personality": "Cranky",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "December 29",
  "wiki": "http://animalcrossing.wikia.com/wiki/Murphy",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Nan",
  "id": "Nan",
  "head": "Nan.jpg",
  "species": "Goat",
  "personality": "Normal",
  "coffee": "Blue Mountain - None - None",
  "birthday": "August 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Nan",
  "store": "https://www.redbubble.com/people/purplepixel/works/25622343-nan-animal-crossing"
}, {
  "name": "Nana",
  "id": "Nana",
  "head": "Nana.jpg",
  "species": "Monkey",
  "personality": "Normal",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "August 23",
  "wiki": "http://animalcrossing.wikia.com/wiki/Nana",
  "store": "https://www.redbubble.com/people/purplepixel/works/27606268-nana-animal-crossing"
}, {
  "name": "Naomi",
  "id": "Naomi",
  "head": "Naomi.jpg",
  "species": "Cow",
  "personality": "Snooty",
  "coffee": "Kilimanjaro - Regular Milk - 2 Sugars",
  "birthday": "February 28",
  "wiki": "http://animalcrossing.wikia.com/wiki/Naomi",
  "store": "https://www.redbubble.com/people/purplepixel/works/25489325-naomi-animal-crossing"
}, {
  "name": "Nate",
  "id": "Nate",
  "head": "Nate.jpg",
  "species": "Bear",
  "personality": "Lazy",
  "coffee": "Mocha - None - None",
  "birthday": "August 16",
  "wiki": "http://animalcrossing.wikia.com/wiki/Nate",
  "store": "https://www.redbubble.com/people/purplepixel/works/23576989-nate-animal-crossing"
}, {
  "name": "Nibbles",
  "id": "Nibbles",
  "head": "Nibbles.jpg",
  "species": "Squirrel",
  "personality": "Peppy",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "July 19",
  "wiki": "http://animalcrossing.wikia.com/wiki/Nibbles",
  "store": "https://www.redbubble.com/people/purplepixel/works/20764158-nibbles-animal-crossing"
}, {
  "name": "Nindori",
  "id": "Nindori",
  "head": "wip.jpg",
  "species": "Ostrich",
  "personality": "Lazy",
  "coffee": "",
  "birthday": "June 5",
  "wiki": "http://animalcrossing.wikia.com/wiki/Nindori",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Nobuo",
  "id": "Nobuo",
  "head": "wip.jpg",
  "species": "Penguin",
  "personality": "Lazy",
  "coffee": "",
  "birthday": "January 23",
  "wiki": "http://animalcrossing.wikia.com/wiki/Nobuo",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Norma",
  "id": "Norma",
  "head": "Norma.jpg",
  "species": "Cow",
  "personality": "Normal",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "September 20",
  "wiki": "http://animalcrossing.wikia.com/wiki/Norma",
  "store": "https://www.redbubble.com/people/purplepixel/works/32606016-norma-animal-crossing"
}, {
  "name": "Nosegay",
  "id": "Nosegay",
  "head": "wip.jpg",
  "species": "Anteater",
  "personality": "Normal",
  "coffee": "",
  "birthday": "February 23",
  "wiki": "http://animalcrossing.wikia.com/wiki/Nosegay",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Octavian",
  "id": "Octavian",
  "head": "Octavian.jpg",
  "species": "Octopus",
  "personality": "Cranky",
  "coffee": "Blend - None - None",
  "birthday": "September 20",
  "wiki": "http://animalcrossing.wikia.com/wiki/Octavian",
  "store": "https://www.redbubble.com/people/purplepixel/works/15992688-octavian-animal-crossing"
}, {
  "name": "O'Hare",
  "id": "OHare",
  "head": "OHare.jpg",
  "species": "Rabbit",
  "personality": "Smug",
  "coffee": "Blend - None - None",
  "birthday": "July 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/O%27Hare",
  "store": "https://www.redbubble.com/people/purplepixel/works/21245338-ohare-animal-crossing"
}, {
  "name": "Olaf",
  "id": "Olaf",
  "head": "Olaf.jpg",
  "species": "Anteater",
  "personality": "Smug",
  "coffee": "Blend - None - None",
  "birthday": "May 19",
  "wiki": "http://animalcrossing.wikia.com/wiki/Olaf",
  "store": "https://www.redbubble.com/people/purplepixel/works/26564701-olaf-animal-crossing"
}, {
  "name": "Olive",
  "id": "Olive",
  "head": "Olive.jpg",
  "species": "Cub",
  "personality": "Normal",
  "coffee": "Blue Mountain - None - None",
  "birthday": "July 12",
  "wiki": "http://animalcrossing.wikia.com/wiki/Olive",
  "store": "https://www.redbubble.com/people/purplepixel/works/24349189-olive-animal-crossing"
}, {
  "name": "Olivia",
  "id": "Olivia",
  "head": "Olivia.jpg",
  "species": "Cat",
  "personality": "Snooty",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "February 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Olivia",
  "store": "https://www.redbubble.com/people/purplepixel/works/15951236-olivia-animal-crossing"
}, {
  "name": "Opal",
  "id": "Opal",
  "head": "Opal.jpg",
  "species": "Elephant",
  "personality": "Snooty",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "January 20",
  "wiki": "http://animalcrossing.wikia.com/wiki/Opal",
  "store": "https://www.redbubble.com/people/purplepixel/works/24928381-opal-animal-crossing"
}, {
  "name": "Otis",
  "id": "Otis",
  "head": "Otis.jpg",
  "species": "Bird",
  "personality": "Lazy",
  "coffee": "",
  "birthday": "January 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Otis",
  "store": "https://www.redbubble.com/people/purplepixel/works/31873270-otis-animal-crossing"
}, {
  "name": "Oxford",
  "id": "Oxford",
  "head": "wip.jpg",
  "species": "Bull",
  "personality": "Cranky",
  "coffee": "",
  "birthday": "September 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Oxford",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Ozzie",
  "id": "Ozzie",
  "head": "Ozzie.jpg",
  "species": "Koala",
  "personality": "Lazy",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "May 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Ozzie",
  "store": "https://www.redbubble.com/people/purplepixel/works/21472314-ozzie-animal-crossing"
}, {
  "name": "Pancetti",
  "id": "Pancetti",
  "head": "wip.jpg",
  "species": "Pig",
  "personality": "Snooty",
  "coffee": "Blue Mountain - A Little Milk - 1 Sugar",
  "birthday": "November 14",
  "wiki": "http://animalcrossing.wikia.com/wiki/Pancetti",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Pango",
  "id": "Pango",
  "head": "wip.jpg",
  "species": "Anteater",
  "personality": "Peppy",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "November 9",
  "wiki": "http://animalcrossing.wikia.com/wiki/Pango",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Paolo",
  "id": "Paolo",
  "head": "Paolo.jpg",
  "species": "Elephant",
  "personality": "Lazy",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "May 5",
  "wiki": "http://animalcrossing.wikia.com/wiki/Paolo",
  "store": "https://www.redbubble.com/people/purplepixel/works/26338049-paolo-animal-crossing"
}, {
  "name": "Papi",
  "id": "Papi",
  "head": "Papi.jpg",
  "species": "Horse",
  "personality": "Lazy",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "January 10",
  "wiki": "http://animalcrossing.wikia.com/wiki/Papi",
  "store": "https://www.redbubble.com/people/purplepixel/works/15853756-papi-animal-crossing"
}, {
  "name": "Pashmina",
  "id": "Pashmina",
  "head": "wip.jpg",
  "species": "Goat",
  "personality": "Uchi",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "December 26",
  "wiki": "http://animalcrossing.wikia.com/wiki/Pashmina",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Pate",
  "id": "Pate",
  "head": "Pate.jpg",
  "species": "Duck",
  "personality": "Peppy",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "February 23",
  "wiki": "http://animalcrossing.wikia.com/wiki/Pate",
  "store": "https://www.redbubble.com/people/purplepixel/works/21042376-pate-animal-crossing"
}, {
  "name": "Patricia",
  "id": "Patricia",
  "head": "wip.jpg",
  "species": "Rhino",
  "personality": "Peppy",
  "coffee": "",
  "birthday": "September 4",
  "wiki": "http://animalcrossing.wikia.com/wiki/Patricia",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Patty",
  "id": "Patty",
  "head": "Patty.jpg",
  "species": "Cow",
  "personality": "Peppy",
  "coffee": "Kilimanjaro - Regular Milk - 2 Sugars",
  "birthday": "May 10",
  "wiki": "http://animalcrossing.wikia.com/wiki/Patty",
  "store": "https://www.redbubble.com/people/purplepixel/works/21533268-patty-animal-crossing"
}, {
  "name": "Paula",
  "id": "Paula",
  "head": "Paula.jpg",
  "species": "Bear",
  "personality": "Uchi",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "March 22",
  "wiki": "http://animalcrossing.wikia.com/wiki/Paula",
  "store": "https://www.redbubble.com/people/purplepixel/works/25824742-paula-animal-crossing"
}, {
  "name": "Peaches",
  "id": "Peaches",
  "head": "wip.jpg",
  "species": "Horse",
  "personality": "Normal",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "November 28",
  "wiki": "http://animalcrossing.wikia.com/wiki/Peaches",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Peanut",
  "id": "Peanut",
  "head": "Peanut.jpg",
  "species": "Squirrel",
  "personality": "Peppy",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "June 8",
  "wiki": "http://animalcrossing.wikia.com/wiki/Peanut",
  "store": "https://www.redbubble.com/people/purplepixel/works/20641683-peanut-animal-crossing"
}, {
  "name": "Pecan",
  "id": "Pecan",
  "head": "Pecan.jpg",
  "species": "Squirrel",
  "personality": "Snooty",
  "coffee": "Blend - None - None",
  "birthday": "September 10",
  "wiki": "http://animalcrossing.wikia.com/wiki/Pecan",
  "store": "https://www.redbubble.com/people/purplepixel/works/20389469-pecan-animal-crossing"
}, {
  "name": "Peck",
  "id": "Peck",
  "head": "Peck.jpg",
  "species": "Bird",
  "personality": "Jock",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "July 25",
  "wiki": "http://animalcrossing.wikia.com/wiki/Peck",
  "store": "https://www.redbubble.com/people/purplepixel/works/20800849-peck-animal-crossing"
}, {
  "name": "Peewee",
  "id": "Peewee",
  "head": "Peewee.jpg",
  "species": "Gorilla",
  "personality": "Cranky",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "September 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Peewee",
  "store": "https://www.redbubble.com/people/purplepixel/works/25259900-peewee-animal-crossing"
}, {
  "name": "Peggy",
  "id": "Peggy",
  "head": "Peggy.jpg",
  "species": "Pig",
  "personality": "Peppy",
  "coffee": "Blue Mountain - A Little Milk - 1 Sugar",
  "birthday": "May 23",
  "wiki": "http://animalcrossing.wikia.com/wiki/Peggy",
  "store": "https://www.redbubble.com/people/purplepixel/works/20962534-peggy-animal-crossing"
}, {
  "name": "Pekoe",
  "id": "Pekoe",
  "head": "Pekoe.jpg",
  "species": "Cub",
  "personality": "Normal",
  "coffee": "Kilimanjaro - Regular Milk - 2 Sugars",
  "birthday": "May 18",
  "wiki": "http://animalcrossing.wikia.com/wiki/Pekoe",
  "store": "https://www.redbubble.com/people/purplepixel/works/23766475-pekoe-animal-crossing"
}, {
  "name": "Penelope",
  "id": "Penelope",
  "head": "Penelope.jpg",
  "species": "Mouse",
  "personality": "Peppy",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "February 5",
  "wiki": "http://animalcrossing.wikia.com/wiki/Penelope",
  "store": "https://www.redbubble.com/people/purplepixel/works/20390269-penelope-animal-crossing"
}, {
  "name": "Penny",
  "id": "Penny",
  "head": "wip.jpg",
  "species": "Mouse",
  "personality": "Peppy",
  "coffee": "",
  "birthday": "June 18",
  "wiki": "http://animalcrossing.wikia.com/wiki/Penny",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Petunia",
  "id": "Petunia (2)",
  "head": "wip.jpg",
  "species": "Rhino",
  "personality": "Snooty",
  "coffee": "",
  "birthday": "December 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Petunia_(rhino)",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Petunia",
  "id": "Petunia",
  "head": "wip.jpg",
  "species": "Cow",
  "personality": "Snooty",
  "coffee": "",
  "birthday": "April 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Petunia_(cow)",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Phil",
  "id": "Phil",
  "head": "wip.jpg",
  "species": "Ostrich",
  "personality": "Smug",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "November 27",
  "wiki": "http://animalcrossing.wikia.com/wiki/Phil",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Phoebe",
  "id": "Phoebe",
  "head": "Phoebe.jpg",
  "species": "Ostrich",
  "personality": "Uchi",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "April 22",
  "wiki": "http://animalcrossing.wikia.com/wiki/Phoebe",
  "store": "https://www.redbubble.com/people/purplepixel/works/15811925-phoebe-animal-crossing"
}, {
  "name": "Pierce",
  "id": "Pierce",
  "head": "Pierce.jpg",
  "species": "Eagle",
  "personality": "Jock",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "January 8",
  "wiki": "http://animalcrossing.wikia.com/wiki/Pierce",
  "store": "https://www.redbubble.com/people/purplepixel/works/18298989-pierce-animal-crossing"
}, {
  "name": "Pierre",
  "id": "Pierre",
  "head": "wip.jpg",
  "species": "Cat",
  "personality": "Lazy",
  "coffee": "",
  "birthday": "June 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Pierre",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Pietro",
  "id": "Pietro",
  "head": "Pietro.jpg",
  "species": "Sheep",
  "personality": "Smug",
  "coffee": "Blue Mountain - A Little Milk - 1 Sugar",
  "birthday": "April 19",
  "wiki": "http://animalcrossing.wikia.com/wiki/Pietro",
  "store": "https://www.redbubble.com/people/purplepixel/works/15927422-pietro-animal-crossing"
}, {
  "name": "Pigleg",
  "id": "Pigleg",
  "head": "wip.jpg",
  "species": "Pig",
  "personality": "Jock",
  "coffee": "",
  "birthday": "September 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Pigleg",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Pinky",
  "id": "Pinky",
  "head": "Pinky.jpg",
  "species": "Bear",
  "personality": "Peppy",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "September 9",
  "wiki": "http://animalcrossing.wikia.com/wiki/Pinky",
  "store": "https://www.redbubble.com/people/purplepixel/works/16606051-pinky-animal-crossing"
}, {
  "name": "Piper",
  "id": "Piper",
  "head": "Piper.jpg",
  "species": "Bird",
  "personality": "Peppy",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "April 18",
  "wiki": "http://animalcrossing.wikia.com/wiki/Piper",
  "store": "https://www.redbubble.com/people/purplepixel/works/20846118-piper-animal-crossing"
}, {
  "name": "Pippy",
  "id": "Pippy",
  "head": "Pippy.jpg",
  "species": "Rabbit",
  "personality": "Peppy",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "June 14",
  "wiki": "http://animalcrossing.wikia.com/wiki/Pippy",
  "store": "https://www.redbubble.com/people/purplepixel/works/25257095-pippy-animal-crossing"
}, {
  "name": "Pironkon",
  "id": "Pironkon",
  "head": "wip.jpg",
  "species": "Alligator",
  "personality": "Cranky",
  "coffee": "",
  "birthday": "June 26",
  "wiki": "http://animalcrossing.wikia.com/wiki/Pironkon",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Plucky",
  "id": "Plucky",
  "head": "Plucky.jpg",
  "species": "Chicken",
  "personality": "Uchi",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "October 12",
  "wiki": "http://animalcrossing.wikia.com/wiki/Plucky",
  "store": "https://www.redbubble.com/people/purplepixel/works/21656928-plucky-animal-crossing"
}, {
  "name": "Poko",
  "id": "Poko",
  "head": "wip.jpg",
  "species": "Cub",
  "personality": "Jock",
  "coffee": "",
  "birthday": "July 4",
  "wiki": "http://animalcrossing.wikia.com/wiki/Poko",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Pompom",
  "id": "Pompom",
  "head": "Pompom.jpg",
  "species": "Duck",
  "personality": "Peppy",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "February 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Pompom",
  "store": "https://www.redbubble.com/people/purplepixel/works/21368271-pompom-animal-crossing"
}, {
  "name": "Poncho",
  "id": "Poncho",
  "head": "Poncho.jpg",
  "species": "Cub",
  "personality": "Jock",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "January 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Poncho",
  "store": "https://www.redbubble.com/people/purplepixel/works/21999605-poncho-animal-crossing"
}, {
  "name": "Poppy",
  "id": "Poppy",
  "head": "Poppy.jpg",
  "species": "Squirrel",
  "personality": "Normal",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "August 5",
  "wiki": "http://animalcrossing.wikia.com/wiki/Poppy",
  "store": "https://www.redbubble.com/people/purplepixel/works/15427516-poppy-animal-crossing"
}, {
  "name": "Portia",
  "id": "Portia",
  "head": "wip.jpg",
  "species": "Dog",
  "personality": "Snooty",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "October 25",
  "wiki": "http://animalcrossing.wikia.com/wiki/Portia",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Prince",
  "id": "Prince",
  "head": "Prince.jpg",
  "species": "Frog",
  "personality": "Lazy",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "July 21",
  "wiki": "http://animalcrossing.wikia.com/wiki/Prince",
  "store": "https://www.redbubble.com/people/purplepixel/works/15238485-prince-animal-crossing"
}, {
  "name": "Puck",
  "id": "Puck",
  "head": "Puck.jpg",
  "species": "Penguin",
  "personality": "Lazy",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "February 21",
  "wiki": "http://animalcrossing.wikia.com/wiki/Puck",
  "store": "https://www.redbubble.com/people/purplepixel/works/25390855-puck-animal-crossing"
}, {
  "name": "Puddles",
  "id": "Puddles",
  "head": "Puddles.jpg",
  "species": "Frog",
  "personality": "Peppy",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "January 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Puddles",
  "store": "https://www.redbubble.com/people/purplepixel/works/15513085-puddles-animal-crossing"
}, {
  "name": "Pudge",
  "id": "Pudge",
  "head": "Pudge.jpg",
  "species": "Cub",
  "personality": "Lazy",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "June 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Pudge",
  "store": "https://www.redbubble.com/people/purplepixel/works/16461572-pudge-animal-crossing"
}, {
  "name": "Punchy",
  "id": "Punchy",
  "head": "Punchy.jpg",
  "species": "Cat",
  "personality": "Lazy",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "April 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Punchy",
  "store": "https://www.redbubble.com/people/purplepixel/works/17518912-punchy-animal-crossing"
}, {
  "name": "Purrl",
  "id": "Purrl",
  "head": "Purrl.jpg",
  "species": "Cat",
  "personality": "Snooty",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "May 29",
  "wiki": "http://animalcrossing.wikia.com/wiki/Purrl",
  "store": "https://www.redbubble.com/people/purplepixel/works/26784198-purrl-animal-crossing"
}, {
  "name": "Queenie",
  "id": "Queenie",
  "head": "wip.jpg",
  "species": "Ostrich",
  "personality": "Snooty",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "November 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Queenie",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Quetzal",
  "id": "Quetzal",
  "head": "wip.jpg",
  "species": "Eagle",
  "personality": "Jock",
  "coffee": "",
  "birthday": "September 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Quetzal",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Quillson",
  "id": "Quillson",
  "head": "wip.jpg",
  "species": "Duck",
  "personality": "Smug",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "December 22",
  "wiki": "http://animalcrossing.wikia.com/wiki/Quillson",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Raddle",
  "id": "Raddle",
  "head": "Raddle.jpg",
  "species": "Frog",
  "personality": "Lazy",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "June 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Raddle",
  "store": "https://www.redbubble.com/people/purplepixel/works/22389852-raddle-animal-crossing"
}, {
  "name": "Rasher",
  "id": "Rasher",
  "head": "Rasher.jpg",
  "species": "Pig",
  "personality": "Cranky",
  "coffee": "Blue Mountain - A Little Milk - 1 Sugar",
  "birthday": "April 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rasher",
  "store": "https://www.redbubble.com/people/purplepixel/works/16237287-rasher-animal-crossing"
}, {
  "name": "Renée",
  "id": "Renee",
  "head": "Renee.jpg",
  "species": "Rhino",
  "personality": "Uchi",
  "coffee": "Kilimanjaro - Regular Milk - 2 Sugars",
  "birthday": "May 28",
  "wiki": "http://animalcrossing.wikia.com/wiki/Renée",
  "store": "https://www.redbubble.com/people/purplepixel/works/18109500-ren-e-animal-crossing"
}, {
  "name": "Rex",
  "id": "Rex",
  "head": "Rex.jpg",
  "species": "Lion",
  "personality": "Lazy",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "July 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rex",
  "store": "https://www.redbubble.com/people/purplepixel/works/23455827-rex-animal-crossing"
}, {
  "name": "Rhoda",
  "id": "Rhoda",
  "head": "Rhoda.jpg",
  "species": "Chicken",
  "personality": "Snooty",
  "coffee": "",
  "birthday": "March 31",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rhoda",
  "store": "https://www.redbubble.com/people/purplepixel/works/20708872-rhoda-animal-crossing"
}, {
  "name": "Rhonda",
  "id": "Rhonda",
  "head": "Rhonda.jpg",
  "species": "Rhino",
  "personality": "Normal",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "January 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rhonda",
  "store": "https://www.redbubble.com/people/purplepixel/works/24995320-rhonda-animal-crossing"
}, {
  "name": "Ribbot",
  "id": "Ribbot",
  "head": "Ribbot.jpg",
  "species": "Frog",
  "personality": "Jock",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "February 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Ribbot",
  "store": "https://www.redbubble.com/people/purplepixel/works/15979463-ribbot-animal-crossing"
}, {
  "name": "Ricky",
  "id": "Ricky",
  "head": "Ricky.jpg",
  "species": "Squirrel",
  "personality": "Cranky",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "September 14",
  "wiki": "http://animalcrossing.wikia.com/wiki/Ricky",
  "store": "https://www.redbubble.com/people/purplepixel/works/21141918-ricky-animal-crossing"
}, {
  "name": "Rilla",
  "id": "Rilla",
  "head": "wip.jpg",
  "species": "Gorilla",
  "personality": "Peppy",
  "coffee": "Blue Mountain - None - None",
  "birthday": "November 1",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rilla",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Rio",
  "id": "Rio",
  "head": "wip.jpg",
  "species": "Ostrich",
  "personality": "Peppy",
  "coffee": "",
  "birthday": "October 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rio",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Rizzo",
  "id": "Rizzo",
  "head": "Rizzo.jpg",
  "species": "Mouse",
  "personality": "Cranky",
  "coffee": "Mocha - None - None",
  "birthday": "January 17",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rizzo",
  "store": "https://www.redbubble.com/people/purplepixel/works/23026007-rizzo-animal-crossing"
}, {
  "name": "Roald",
  "id": "Roald",
  "head": "Roald.jpg",
  "species": "Penguin",
  "personality": "Jock",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "January 5",
  "wiki": "http://animalcrossing.wikia.com/wiki/Roald",
  "store": "https://www.redbubble.com/people/purplepixel/works/20071267-roald-animal-crossing"
}, {
  "name": "Robin",
  "id": "Robin",
  "head": "wip.jpg",
  "species": "Bird",
  "personality": "Snooty",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "December 4",
  "wiki": "http://animalcrossing.wikia.com/wiki/Robin",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Rocco",
  "id": "Rocco",
  "head": "Rocco.jpg",
  "species": "Hippo",
  "personality": "Cranky",
  "coffee": "Mocha - None - None",
  "birthday": "August 18",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rocco",
  "store": "https://www.redbubble.com/people/purplepixel/works/23228098-rocco-animal-crossing"
}, {
  "name": "Rocket",
  "id": "Rocket",
  "head": "Rocket.jpg",
  "species": "Gorilla",
  "personality": "Uchi",
  "coffee": "Kilimanjaro - Regular Milk - 2 Sugars",
  "birthday": "April 14",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rocket",
  "store": "https://www.redbubble.com/people/purplepixel/works/21492045-rocket-animal-crossing"
}, {
  "name": "Rod",
  "id": "Rod",
  "head": "Rod.jpg",
  "species": "Mouse",
  "personality": "Jock",
  "coffee": "Mocha - None - None",
  "birthday": "August 14",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rod",
  "store": "https://www.redbubble.com/people/purplepixel/works/15469973-rod-animal-crossing"
}, {
  "name": "Rodeo",
  "id": "Rodeo",
  "head": "wip.jpg",
  "species": "Bull",
  "personality": "Lazy",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "October 29",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rodeo",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Rodney",
  "id": "Rodney",
  "head": "wip.jpg",
  "species": "Hamster",
  "personality": "Smug",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "November 10",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rodney",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Rolf",
  "id": "Rolf",
  "head": "Rolf.jpg",
  "species": "Tiger",
  "personality": "Cranky",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "August 22",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rolf",
  "store": "https://www.redbubble.com/people/purplepixel/works/15326272-rolf-animal-crossing"
}, {
  "name": "Rollo",
  "id": "Rollo",
  "head": "wip.jpg",
  "species": "Hippo",
  "personality": "Lazy",
  "coffee": "",
  "birthday": "July 22",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rollo",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Rooney",
  "id": "Rooney",
  "head": "wip.jpg",
  "species": "Kangaroo",
  "personality": "Cranky",
  "coffee": "Blue Mountain - A Little Milk - 1 Sugar",
  "birthday": "December 1",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rooney",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Rory",
  "id": "Rory",
  "head": "Rory.jpg",
  "species": "Lion",
  "personality": "Jock",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "August 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rory",
  "store": "https://www.redbubble.com/people/purplepixel/works/29609257-rory-animal-crossing"
}, {
  "name": "Roscoe",
  "id": "Roscoe",
  "head": "Roscoe.jpg",
  "species": "Horse",
  "personality": "Cranky",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "June 16",
  "wiki": "http://animalcrossing.wikia.com/wiki/Roscoe",
  "store": "https://www.redbubble.com/people/purplepixel/works/15418237-roscoe-animal-crossing"
}, {
  "name": "Rosie",
  "id": "Rosie",
  "head": "Rosie.jpg",
  "species": "Cat",
  "personality": "Peppy",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "February 27",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rosie",
  "store": "https://www.redbubble.com/people/purplepixel/works/16052066-rosie-animal-crossing"
}, {
  "name": "Rowan",
  "id": "Rowan",
  "head": "Rowan.jpg",
  "species": "Tiger",
  "personality": "Jock",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "August 26",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rowan",
  "store": "https://www.redbubble.com/people/purplepixel/works/23168562-rowan-animal-crossing"
}, {
  "name": "Ruby",
  "id": "Ruby",
  "head": "wip.jpg",
  "species": "Rabbit",
  "personality": "Peppy",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "December 25",
  "wiki": "http://animalcrossing.wikia.com/wiki/Ruby",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Rudy",
  "id": "Rudy",
  "head": "wip.jpg",
  "species": "Cat",
  "personality": "Jock",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "December 20",
  "wiki": "http://animalcrossing.wikia.com/wiki/Rudy",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Sally",
  "id": "Sally",
  "head": "Sally.jpg",
  "species": "Squirrel",
  "personality": "Normal",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "June 19",
  "wiki": "http://animalcrossing.wikia.com/wiki/Sally",
  "store": "https://www.redbubble.com/people/purplepixel/works/15588891-sally-animal-crossing"
}, {
  "name": "Samson",
  "id": "Samson",
  "head": "Samson.jpg",
  "species": "Mouse",
  "personality": "Jock",
  "coffee": "Mocha - None - None",
  "birthday": "July 5",
  "wiki": "http://animalcrossing.wikia.com/wiki/Samson",
  "store": "https://www.redbubble.com/people/purplepixel/works/23214160-samson-animal-crossing"
}, {
  "name": "Sandy",
  "id": "Sandy",
  "head": "Sandy.jpg",
  "species": "Ostrich",
  "personality": "Normal",
  "coffee": "Blend - None - None",
  "birthday": "October 21",
  "wiki": "http://animalcrossing.wikia.com/wiki/Sandy",
  "store": "https://www.redbubble.com/people/purplepixel/works/35556240-sandy-animal-crossing"
}, {
  "name": "Savannah",
  "id": "Savannah",
  "head": "Savannah.jpg",
  "species": "Horse",
  "personality": "Normal",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "January 25",
  "wiki": "http://animalcrossing.wikia.com/wiki/Savannah",
  "store": "https://www.redbubble.com/people/purplepixel/works/16012479-savannah-animal-crossing"
}, {
  "name": "Scoot",
  "id": "Scoot",
  "head": "Scoot.jpg",
  "species": "Duck",
  "personality": "Jock",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "June 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Scoot",
  "store": "https://www.redbubble.com/people/purplepixel/works/15861187-scoot-animal-crossing"
}, {
  "name": "Shari",
  "id": "Shari",
  "head": "Shari.jpg",
  "species": "Monkey",
  "personality": "Uchi",
  "coffee": "Blend - None - None",
  "birthday": "April 10",
  "wiki": "http://animalcrossing.wikia.com/wiki/Shari",
  "store": "https://www.redbubble.com/people/purplepixel/works/20415371-shari-animal-crossing"
}, {
  "name": "Sheldon",
  "id": "Sheldon",
  "head": "Sheldon.jpg",
  "species": "Squirrel",
  "personality": "Jock",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "February 26",
  "wiki": "http://animalcrossing.wikia.com/wiki/Sheldon",
  "store": "https://www.redbubble.com/people/purplepixel/works/21374258-sheldon-animal-crossing"
}, {
  "name": "Shep",
  "id": "Shep",
  "head": "wip.jpg",
  "species": "Dog",
  "personality": "Smug",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "November 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Shep",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Shinabiru",
  "id": "Shinabiru",
  "head": "wip.jpg",
  "species": "Duck",
  "personality": "Jock",
  "coffee": "",
  "birthday": "April 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Shinabiru",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Shoukichi",
  "id": "Shoukichi",
  "head": "wip.jpg",
  "species": "Bird",
  "personality": "Jock",
  "coffee": "",
  "birthday": "May 30",
  "wiki": "http://animalcrossing.wikia.com/wiki/Shoukichi",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Simon",
  "id": "Simon",
  "head": "Simon.jpg",
  "species": "Monkey",
  "personality": "Lazy",
  "coffee": "Blend - None - None",
  "birthday": "January 19",
  "wiki": "http://animalcrossing.wikia.com/wiki/Simon",
  "store": "https://www.redbubble.com/people/purplepixel/works/24909507-simon-animal-crossing"
}, {
  "name": "Skye",
  "id": "Skye",
  "head": "Skye.jpg",
  "species": "Wolf",
  "personality": "Normal",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "March 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Skye",
  "store": "https://www.redbubble.com/people/purplepixel/works/16175124-skye-animal-crossing"
}, {
  "name": "Sly",
  "id": "Sly",
  "head": "wip.jpg",
  "species": "Alligator",
  "personality": "Jock",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "November 15",
  "wiki": "http://animalcrossing.wikia.com/wiki/Sly",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Snake",
  "id": "Snake",
  "head": "wip.jpg",
  "species": "Rabbit",
  "personality": "Jock",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "November 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Snake",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Snooty",
  "id": "Snooty",
  "head": "wip.jpg",
  "species": "Anteater",
  "personality": "Snooty",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "October 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Snooty",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Soleil",
  "id": "Soleil",
  "head": "Soleil.jpg",
  "species": "Hamster",
  "personality": "Snooty",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "August 9",
  "wiki": "http://animalcrossing.wikia.com/wiki/Soleil",
  "store": "https://www.redbubble.com/people/purplepixel/works/22964983-soleil-animal-crossing"
}, {
  "name": "Sparro",
  "id": "Sparro",
  "head": "wip.jpg",
  "species": "Bird",
  "personality": "Jock",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "November 20",
  "wiki": "http://animalcrossing.wikia.com/wiki/Sparro",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Spike",
  "id": "Spike",
  "head": "Spike.jpg",
  "species": "Rhino",
  "personality": "Cranky",
  "coffee": "Kilimanjaro - Regular Milk - 2 Sugars",
  "birthday": "June 17",
  "wiki": "http://animalcrossing.wikia.com/wiki/Spike",
  "store": "https://www.redbubble.com/people/purplepixel/works/19807982-spike-animal-crossing"
}, {
  "name": "Spork",
  "id": "Spork",
  "head": "Spork.jpg",
  "species": "Pig",
  "personality": "Lazy",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "September 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Spork",
  "store": "https://www.redbubble.com/people/purplepixel/works/31409338-spork-animal-crossing"
}, {
  "name": "Sprinkle",
  "id": "Sprinkle",
  "head": "Sprinkle.jpg",
  "species": "Penguin",
  "personality": "Peppy",
  "coffee": "Kilimanjaro - Regular Milk - 2 Sugars",
  "birthday": "February 20",
  "wiki": "http://animalcrossing.wikia.com/wiki/Sprinkle",
  "store": "https://www.redbubble.com/people/purplepixel/works/16028229-sprinkle-animal-crossing"
}, {
  "name": "Sprocket",
  "id": "Sprocket",
  "head": "wip.jpg",
  "species": "Ostrich",
  "personality": "Jock",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "December 1",
  "wiki": "http://animalcrossing.wikia.com/wiki/Sprocket",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Static",
  "id": "Static",
  "head": "Static.jpg",
  "species": "Squirrel",
  "personality": "Cranky",
  "coffee": "Kilimanjaro - A Little Milk - 2 Sugars",
  "birthday": "July 9",
  "wiki": "http://animalcrossing.wikia.com/wiki/Static",
  "store": "https://www.redbubble.com/people/purplepixel/works/16352282-static-animal-crossing"
}, {
  "name": "Stella",
  "id": "Stella",
  "head": "Stella.jpg",
  "species": "Sheep",
  "personality": "Normal",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "April 9",
  "wiki": "http://animalcrossing.wikia.com/wiki/Stella",
  "store": "https://www.redbubble.com/people/purplepixel/works/20794588-stella-animal-crossing"
}, {
  "name": "Sterling",
  "id": "Sterling",
  "head": "wip.jpg",
  "species": "Eagle",
  "personality": "Jock",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "December 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Sterling",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Stinky",
  "id": "Stinky",
  "head": "Stinky.jpg",
  "species": "Cat",
  "personality": "Jock",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "August 17",
  "wiki": "http://animalcrossing.wikia.com/wiki/Stinky",
  "store": "https://www.redbubble.com/people/purplepixel/works/20972085-stinky-animal-crossing"
}, {
  "name": "Stitches",
  "id": "Stitches",
  "head": "Stitches.jpg",
  "species": "Cub",
  "personality": "Lazy",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "February 10",
  "wiki": "http://animalcrossing.wikia.com/wiki/Stitches",
  "store": "https://www.redbubble.com/people/purplepixel/works/15272054-stitches-animal-crossing"
}, {
  "name": "Stu",
  "id": "Stu",
  "head": "Stu.jpg",
  "species": "Bull",
  "personality": "Lazy",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "April 20",
  "wiki": "http://animalcrossing.wikia.com/wiki/Stu",
  "store": "https://www.redbubble.com/people/purplepixel/works/26177021-stu-animal-crossing"
}, {
  "name": "Sue E.",
  "id": "Sue E.",
  "head": "Sue E.jpg",
  "species": "Pig",
  "personality": "Snooty",
  "coffee": "",
  "birthday": "October 20",
  "wiki": "http://animalcrossing.wikia.com/wiki/Sue E.",
  "store": "https://www.redbubble.com/people/purplepixel/works/19873242-sue-e-animal-crossing"
}, {
  "name": "Sunny",
  "id": "Sunny",
  "head": "wip.jpg",
  "species": "Frog",
  "personality": "Normal",
  "coffee": "",
  "birthday": "May 22",
  "wiki": "http://animalcrossing.wikia.com/wiki/Sunny",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Sven",
  "id": "Sven",
  "head": "Sven.jpg",
  "species": "Goat",
  "personality": "Lazy",
  "coffee": "",
  "birthday": "December 28",
  "wiki": "http://animalcrossing.wikia.com/wiki/Sven",
  "store": "https://www.redbubble.com/people/purplepixel/works/25318463-sven-animal-crossing"
}, {
  "name": "Sydney",
  "id": "Sydney",
  "head": "Sydney.jpg",
  "species": "Koala",
  "personality": "Normal",
  "coffee": "Mocha - None - None",
  "birthday": "June 21",
  "wiki": "http://animalcrossing.wikia.com/wiki/Sydney",
  "store": "https://www.redbubble.com/people/purplepixel/works/19973395-sydney-animal-crossing"
}, {
  "name": "Sylvana",
  "id": "Sylvana",
  "head": "Sylvana.jpg",
  "species": "Kangaroo",
  "personality": "Normal",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "October 22",
  "wiki": "http://animalcrossing.wikia.com/wiki/Sylvana",
  "store": "https://www.redbubble.com/people/purplepixel/works/26299195-sylvia-animal-crossing"
}, {
  "name": "Sylvia",
  "id": "Sylvia",
  "head": "wip.jpg",
  "species": "Kangaroo",
  "personality": "Uchi",
  "coffee": "Mocha - None - None",
  "birthday": "May 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Sylvia",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "T-Bone",
  "id": "T-Bone",
  "head": "T-Bone.jpg",
  "species": "Bull",
  "personality": "Cranky",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "May 20",
  "wiki": "http://animalcrossing.wikia.com/wiki/T-Bone",
  "store": "https://www.redbubble.com/people/purplepixel/works/26572785-t-bone-animal-crossing"
}, {
  "name": "Tabby",
  "id": "Tabby",
  "head": "Tabby.jpg",
  "species": "Cat",
  "personality": "Peppy",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "August 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tabby",
  "store": "https://www.redbubble.com/people/purplepixel/works/15376368-tabby-animal-crossing"
}, {
  "name": "Tad",
  "id": "Tad",
  "head": "Tad.jpg",
  "species": "Frog",
  "personality": "Jock",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "August 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tad",
  "store": "https://www.redbubble.com/people/purplepixel/works/19503749-tad-animal-crossing"
}, {
  "name": "Tammi",
  "id": "Tammi",
  "head": "Tammi.jpg",
  "species": "Monkey",
  "personality": "Peppy",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "April 1",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tammi",
  "store": "https://www.redbubble.com/people/purplepixel/works/22010139-tammi-animal-crossing"
}, {
  "name": "Tammy",
  "id": "Tammy",
  "head": "Tammy.jpg",
  "species": "Cub",
  "personality": "Uchi",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "June 23",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tammy",
  "store": "https://www.redbubble.com/people/purplepixel/works/15868993-tammy-animal-crossing"
}, {
  "name": "Tangy",
  "id": "Tangy",
  "head": "Tangy.jpg",
  "species": "Cat",
  "personality": "Peppy",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "June 17",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tangy",
  "store": "https://www.redbubble.com/people/purplepixel/works/15280318-tangy-animal-crossing"
}, {
  "name": "Tank",
  "id": "Tank",
  "head": "Tank.jpg",
  "species": "Rhino",
  "personality": "Jock",
  "coffee": "Blue Mountain - None - None",
  "birthday": "May 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tank",
  "store": "https://www.redbubble.com/people/purplepixel/works/20301936-tank-animal-crossing"
}, {
  "name": "Tarou",
  "id": "Tarou",
  "head": "wip.jpg",
  "species": "Wolf",
  "personality": "Jock",
  "coffee": "",
  "birthday": "October 29",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tarou",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Tasha",
  "id": "Tasha",
  "head": "wip.jpg",
  "species": "Squirrel",
  "personality": "Snooty",
  "coffee": "Mocha - Regular - 2 Sugars",
  "birthday": "October 30",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tasha",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Teddy",
  "id": "Teddy",
  "head": "Teddy.jpg",
  "species": "Bear",
  "personality": "Jock",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "September 26",
  "wiki": "http://animalcrossing.wikia.com/wiki/Teddy",
  "store": "https://www.redbubble.com/people/purplepixel/works/15270570-teddy-animal-crossing"
}, {
  "name": "Tex",
  "id": "Tex",
  "head": "Tex.jpg",
  "species": "Penguin",
  "personality": "Smug",
  "coffee": "Kilimanjaro - Regular Milk - 2 Sugars",
  "birthday": "October 6",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tex",
  "store": "https://www.redbubble.com/people/purplepixel/works/29252553-tex-animal-crossing"
}, {
  "name": "Tia",
  "id": "Tia",
  "head": "wip.jpg",
  "species": "Elephant",
  "personality": "Normal",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "November 18",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tia",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Tiara",
  "id": "Tiara",
  "head": "wip.jpg",
  "species": "Rhino",
  "personality": "Snooty",
  "coffee": "",
  "birthday": "January 17",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tiara",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Tiffany",
  "id": "Tiffany",
  "head": "Tiffany.jpg",
  "species": "Rabbit",
  "personality": "Snooty",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "January 9",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tiffany",
  "store": "https://www.redbubble.com/people/purplepixel/works/16305764-tiffany-animal-crossing"
}, {
  "name": "Timbra",
  "id": "Timbra",
  "head": "wip.jpg",
  "species": "Sheep",
  "personality": "Snooty",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "October 21",
  "wiki": "http://animalcrossing.wikia.com/wiki/Timbra",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Tipper",
  "id": "Tipper",
  "head": "Tipper.jpg",
  "species": "Cow",
  "personality": "Snooty",
  "coffee": "Blue Mountain - None - None",
  "birthday": "August 25",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tipper",
  "store": "https://www.redbubble.com/people/purplepixel/works/15303136-tipper-animal-crossing"
}, {
  "name": "Toby",
  "id": "Toby",
  "head": "Toby.jpg",
  "species": "Rabbit",
  "personality": "Smug",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "July 10",
  "wiki": "http://animalcrossing.wikia.com/wiki/Toby",
  "store": "https://www.redbubble.com/people/purplepixel/works/23098793-toby-animal-crossing"
}, {
  "name": "Tom",
  "id": "Tom",
  "head": "wip.jpg",
  "species": "Cat",
  "personality": "Cranky",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "December 10",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tom",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Truffles",
  "id": "Truffles",
  "head": "Truffles.jpg",
  "species": "Pig",
  "personality": "Peppy",
  "coffee": "Blue Mountain - A Little Milk - 1 Sugar",
  "birthday": "July 28",
  "wiki": "http://animalcrossing.wikia.com/wiki/Truffles",
  "store": "https://www.redbubble.com/people/purplepixel/works/28918794-truffles-animal-crossing"
}, {
  "name": "Tucker",
  "id": "Tucker",
  "head": "Tucker.jpg",
  "species": "Elephant",
  "personality": "Lazy",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "September 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tucker",
  "store": "https://www.redbubble.com/people/purplepixel/works/15844182-tucker-animal-crossing"
}, {
  "name": "Tutu",
  "id": "Tutu",
  "head": "Tutu.jpg",
  "species": "Bear",
  "personality": "Peppy",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "September 15",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tutu",
  "store": "https://www.redbubble.com/people/purplepixel/works/15460233-tutu-animal-crossing"
}, {
  "name": "Twiggy",
  "id": "Twiggy",
  "head": "Twiggy.jpg",
  "species": "Bird",
  "personality": "Peppy",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "July 13",
  "wiki": "http://animalcrossing.wikia.com/wiki/Twiggy",
  "store": "https://www.redbubble.com/people/purplepixel/works/16100636-twiggy-animal-crossing"
}, {
  "name": "Twirp",
  "id": "Twirp",
  "head": "Twirp.jpg",
  "species": "Bird",
  "personality": "Cranky",
  "coffee": "",
  "birthday": "August 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Twirp",
  "store": "https://www.redbubble.com/people/purplepixel/works/31798202-twirp-animal-crossing"
}, {
  "name": "Tybalt",
  "id": "Tybalt",
  "head": "Tybalt.jpg",
  "species": "Tiger",
  "personality": "Jock",
  "coffee": "Kilimanjaro - None - None",
  "birthday": "August 19",
  "wiki": "http://animalcrossing.wikia.com/wiki/Tybalt",
  "store": "https://www.redbubble.com/people/purplepixel/works/24172362-tybalt-animal-crossing"
}, {
  "name": "Ursula",
  "id": "Ursula",
  "head": "Ursula.jpg",
  "species": "Bear",
  "personality": "Uchi",
  "coffee": "Mocha - None - None",
  "birthday": "January 16",
  "wiki": "http://animalcrossing.wikia.com/wiki/Ursula",
  "store": "https://www.redbubble.com/people/purplepixel/works/15943943-ursala-animal-crossing"
}, {
  "name": "Valise",
  "id": "Valise",
  "head": "wip.jpg",
  "species": "Kangaroo",
  "personality": "Snooty",
  "coffee": "",
  "birthday": "December 3",
  "wiki": "http://animalcrossing.wikia.com/wiki/Valise",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Velma",
  "id": "Velma",
  "head": "Velma.jpg",
  "species": "Goat",
  "personality": "Snooty",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "January 14",
  "wiki": "http://animalcrossing.wikia.com/wiki/Velma",
  "store": "https://www.redbubble.com/people/purplepixel/works/20649366-velma-animal-crossing"
}, {
  "name": "Verdun",
  "id": "Verdun",
  "head": "wip.jpg",
  "species": "Bull",
  "personality": "Lazy",
  "coffee": "",
  "birthday": "",
  "wiki": "http://animalcrossing.wikia.com/wiki/Verdun",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Vesta",
  "id": "Vesta",
  "head": "Vesta.jpg",
  "species": "Sheep",
  "personality": "Normal",
  "coffee": "Blue Mountain - A Little Milk - 1 Sugar",
  "birthday": "April 16",
  "wiki": "http://animalcrossing.wikia.com/wiki/Vesta",
  "store": "https://www.redbubble.com/people/purplepixel/works/15313072-vesta-animal-crossing"
}, {
  "name": "Vic",
  "id": "Vic",
  "head": "wip.jpg",
  "species": "Bull",
  "personality": "Cranky",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "December 29",
  "wiki": "http://animalcrossing.wikia.com/wiki/Vic",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Viché",
  "id": "Viche",
  "head": "Viche.jpg",
  "species": "Squirrel",
  "personality": "Normal",
  "coffee": "Blue Mountain - Lots of Milk - 3  Sugars",
  "birthday": "July 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Viche",
  "store": "https://www.redbubble.com/people/purplepixel/works/26757897-vich-animal-crossing"
}, {
  "name": "Victoria",
  "id": "Victoria",
  "head": "Victoria.jpg",
  "species": "Horse",
  "personality": "Peppy",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "July 11",
  "wiki": "http://animalcrossing.wikia.com/wiki/Victoria",
  "store": "https://www.redbubble.com/people/purplepixel/works/16068757-victoria-animal-crossing"
}, {
  "name": "Violet",
  "id": "Violet",
  "head": "Violet.jpg",
  "species": "Gorilla",
  "personality": "Snooty",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "September 1",
  "wiki": "http://animalcrossing.wikia.com/wiki/Violet",
  "store": "https://www.redbubble.com/people/purplepixel/works/31291652-violet-animal-crossing"
}, {
  "name": "Vivian",
  "id": "Vivian",
  "head": "Vivian.jpg",
  "species": "Wolf",
  "personality": "Snooty",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "January 26",
  "wiki": "http://animalcrossing.wikia.com/wiki/Vivian",
  "store": "https://www.redbubble.com/people/purplepixel/works/22050277-vivian-animal-crossing"
}, {
  "name": "Vladimir",
  "id": "Vladimir",
  "head": "Vladimir.jpg",
  "species": "Cub",
  "personality": "Cranky",
  "coffee": "Mocha - Lots of Milk - 3 Sugars",
  "birthday": "August 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Vladimir",
  "store": "https://www.redbubble.com/people/purplepixel/works/15561541-vladimir-animal-crossing"
}, {
  "name": "Wade",
  "id": "Wade",
  "head": "wip.jpg",
  "species": "Penguin",
  "personality": "Lazy",
  "coffee": "Blue Mountain - None - None",
  "birthday": "October 30",
  "wiki": "http://animalcrossing.wikia.com/wiki/Wade",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Walker",
  "id": "Walker",
  "head": "Walker.jpg",
  "species": "Dog",
  "personality": "Lazy",
  "coffee": "Mocha - Regular Milk - 2 Sugars",
  "birthday": "June 10",
  "wiki": "http://animalcrossing.wikia.com/wiki/Walker",
  "store": "https://www.redbubble.com/people/purplepixel/works/15587400-walker-animal-crossing"
}, {
  "name": "Walt",
  "id": "Walt",
  "head": "Walt.jpg",
  "species": "Kangaroo",
  "personality": "Cranky",
  "coffee": "Blue Mountain - A Little Milk - 1 Sugar",
  "birthday": "April 24",
  "wiki": "http://animalcrossing.wikia.com/wiki/Walt",
  "store": "https://www.redbubble.com/people/purplepixel/works/24035776-walt-animal-crossing"
}, {
  "name": "Wart Jr",
  "id": "Wart Jr",
  "head": "Wart Jr.jpg",
  "species": "Frog",
  "personality": "Cranky",
  "coffee": "Blue Mountain - Regular Milk - 2 Sugars",
  "birthday": "August 21",
  "wiki": "http://animalcrossing.wikia.com/wiki/Wart Jr",
  "store": "https://www.redbubble.com/people/purplepixel/works/30318917-wart-jr-animal-crossing"
}, {
  "name": "Weber",
  "id": "Weber",
  "head": "Weber.jpg",
  "species": "Duck",
  "personality": "Lazy",
  "coffee": "Blue Mountain - Lots of Milk - 3 Sugars",
  "birthday": "June 30",
  "wiki": "http://animalcrossing.wikia.com/wiki/Weber",
  "store": "https://www.redbubble.com/people/purplepixel/works/27628277-weber-animal-crossing"
}, {
  "name": "Wendy",
  "id": "Wendy",
  "head": "Wendy.jpg",
  "species": "Sheep",
  "personality": "Peppy",
  "coffee": "Blend - Regular Milk - 2 Sugars",
  "birthday": "August 15",
  "wiki": "http://animalcrossing.wikia.com/wiki/Wendy",
  "store": "https://www.redbubble.com/people/purplepixel/works/17391497-wendy-animal-crossing"
}, {
  "name": "Whitney",
  "id": "Whitney",
  "head": "Whitney.jpg",
  "species": "Wolf",
  "personality": "Snooty",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "September 17",
  "wiki": "http://animalcrossing.wikia.com/wiki/Whitney",
  "store": "https://www.redbubble.com/people/purplepixel/works/16500659-whitney-animal-crossing"
}, {
  "name": "Willow",
  "id": "Willow",
  "head": "wip.jpg",
  "species": "Sheep",
  "personality": "Snooty",
  "coffee": "Mocha - None - None",
  "birthday": "November 26",
  "wiki": "http://animalcrossing.wikia.com/wiki/Willow",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Winnie",
  "id": "Winnie",
  "head": "Winnie.jpg",
  "species": "Horse",
  "personality": "Peppy",
  "coffee": "Mocha - A Little Milk - 1 Sugar",
  "birthday": "January 31",
  "wiki": "http://animalcrossing.wikia.com/wiki/Winnie",
  "store": "https://www.redbubble.com/people/purplepixel/works/25088706-winnie-animal-crossing"
}, {
  "name": "Wolf Link",
  "id": "Wolf Link",
  "head": "wip.jpg",
  "species": "Wolf",
  "personality": "Smug",
  "coffee": "Blue Mountain - Regular - 2 Sugars",
  "birthday": "December 2",
  "wiki": "http://animalcrossing.wikia.com/wiki/Wolf Link",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Wolfgang",
  "id": "Wolfgang",
  "head": "wip.jpg",
  "species": "Wolf",
  "personality": "Cranky",
  "coffee": "Blend - Lots of Milk - 3 Sugars",
  "birthday": "November 25",
  "wiki": "http://animalcrossing.wikia.com/wiki/Wolfgang",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Woolio",
  "id": "Woolio",
  "head": "wip.jpg",
  "species": "Sheep",
  "personality": "Jock",
  "coffee": "",
  "birthday": "April 16",
  "wiki": "http://animalcrossing.wikia.com/wiki/Woolio",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Yodel",
  "id": "Yodel",
  "head": "wip.jpg",
  "species": "Gorilla",
  "personality": "Lazy",
  "coffee": "",
  "birthday": "December 10",
  "wiki": "http://animalcrossing.wikia.com/wiki/Yodel",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Yuka",
  "id": "Yuka",
  "head": "Yuka.jpg",
  "species": "Koala",
  "personality": "Snooty",
  "coffee": "Kilimanjaro - Lots of Milk - 3 Sugars",
  "birthday": "July 20",
  "wiki": "http://animalcrossing.wikia.com/wiki/Yuka",
  "store": "https://www.redbubble.com/people/purplepixel/works/16062096-yuka-animal-crossing"
}, {
  "name": "Zell",
  "id": "Zell",
  "head": "Zell.jpg",
  "species": "Deer",
  "personality": "Smug",
  "coffee": "Blend - A Little Milk - 1 Sugar",
  "birthday": "June 7",
  "wiki": "http://animalcrossing.wikia.com/wiki/Zell",
  "store": "https://www.redbubble.com/people/purplepixel/works/17248858-zell-animal-crossing"
}, {
  "name": "Zoe",
  "id": "Zoe",
  "head": "wip.jpg",
  "species": "Anteater",
  "personality": "Normal",
  "coffee": "",
  "birthday": "January 29",
  "wiki": "http://animalcrossing.wikia.com/wiki/Zoe",
  "store": "https://www.redbubble.com/people/purplepixel/"
}, {
  "name": "Zucker",
  "id": "Zucker",
  "head": "Zucker.jpg",
  "species": "Octopus",
  "personality": "Lazy",
  "coffee": "Kilimanjaro - A Little Milk - 1 Sugar",
  "birthday": "March 8",
  "wiki": "http://animalcrossing.wikia.com/wiki/Zucker",
  "store": "https://www.redbubble.com/people/purplepixel/works/15977970-zucker-animal-crossing"
}];
},{}],"src/components/HTMLElementBuilder.ts":[function(require,module,exports) {
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var HTMLElementBuilder =
/*#__PURE__*/
function () {
  function HTMLElementBuilder(elementTag) {
    _classCallCheck(this, HTMLElementBuilder);

    this.classNames = [];
    this.element = document.createElement(elementTag);
  }

  _createClass(HTMLElementBuilder, [{
    key: "build",
    value: function build() {
      this.element.className = this.classNames.join(' ');
      return this.element;
    }
  }, {
    key: "withTitle",
    value: function withTitle(title) {
      this.element.title = title;
      return this;
    }
  }, {
    key: "withInnerHTML",
    value: function withInnerHTML(innerHTML) {
      this.element.innerHTML = innerHTML;
      return this;
    }
  }, {
    key: "withClassNames",
    value: function withClassNames() {
      for (var _len = arguments.length, classnames = new Array(_len), _key = 0; _key < _len; _key++) {
        classnames[_key] = arguments[_key];
      }

      this.classNames = _toConsumableArray(new Set([].concat(_toConsumableArray(this.classNames), classnames)));
      return this;
    }
  }, {
    key: "withChildren",
    value: function withChildren() {
      var _this = this;

      for (var _len2 = arguments.length, children = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        children[_key2] = arguments[_key2];
      }

      children.forEach(function (child) {
        return _this.element.appendChild(child);
      });
      return this;
    }
  }, {
    key: "appendChild",
    value: function appendChild(child) {
      this.element.appendChild(child);
      return this;
    }
  }, {
    key: "withPadding",
    value: function withPadding(padding) {
      this.element.style.padding = padding.toString();
      return this;
    }
  }, {
    key: "withPaddingLeft",
    value: function withPaddingLeft(padding) {
      this.element.style.paddingLeft = "".concat(padding, "px");
      return this;
    }
  }, {
    key: "withPaddingBottom",
    value: function withPaddingBottom(padding) {
      this.element.style.paddingBottom = "".concat(padding, "px");
      return this;
    }
  }, {
    key: "withPaddingTop",
    value: function withPaddingTop(padding) {
      this.element.style.paddingTop = "".concat(padding, "px");
      return this;
    }
  }, {
    key: "withColor",
    value: function withColor(color) {
      this.element.style.color = color;
      return this;
    }
  }, {
    key: "withDisplay",
    value: function withDisplay(display) {
      this.element.style.display = display;
      return this;
    }
  }, {
    key: "withFloatLeft",
    value: function withFloatLeft() {
      this.element.style.cssFloat = 'left';
      return this;
    }
  }]);

  return HTMLElementBuilder;
}();

exports.default = HTMLElementBuilder;
},{}],"src/components/ButtonBuilder.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var HTMLElementBuilder_1 = __importDefault(require("./HTMLElementBuilder"));

var ButtonBuilder =
/*#__PURE__*/
function (_HTMLElementBuilder_) {
  _inherits(ButtonBuilder, _HTMLElementBuilder_);

  function ButtonBuilder(onclick) {
    var _this;

    _classCallCheck(this, ButtonBuilder);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ButtonBuilder).call(this, 'button'));
    _this.element.onclick = onclick;
    return _this;
  }

  _createClass(ButtonBuilder, [{
    key: "asFontAwesome",
    value: function asFontAwesome(iconName) {
      this.withClassNames('fa', iconName);
      this.element.setAttribute('aria-hidden', 'true');
      return this;
    }
  }, {
    key: "isDisabled",
    value: function isDisabled() {
      var disabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.element.disabled = disabled;
      return this;
    }
  }]);

  return ButtonBuilder;
}(HTMLElementBuilder_1.default);

exports.default = ButtonBuilder;
},{"./HTMLElementBuilder":"src/components/HTMLElementBuilder.ts"}],"src/components/DivisionBuilder.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var HTMLElementBuilder_1 = __importDefault(require("./HTMLElementBuilder"));

var DivisionBuilder =
/*#__PURE__*/
function (_HTMLElementBuilder_) {
  _inherits(DivisionBuilder, _HTMLElementBuilder_);

  function DivisionBuilder() {
    _classCallCheck(this, DivisionBuilder);

    return _possibleConstructorReturn(this, _getPrototypeOf(DivisionBuilder).call(this, 'div'));
  }

  return DivisionBuilder;
}(HTMLElementBuilder_1.default);

exports.default = DivisionBuilder;
},{"./HTMLElementBuilder":"src/components/HTMLElementBuilder.ts"}],"src/components/ImageBuilder.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var HTMLElementBuilder_1 = __importDefault(require("./HTMLElementBuilder"));

var ImageBuilder =
/*#__PURE__*/
function (_HTMLElementBuilder_) {
  _inherits(ImageBuilder, _HTMLElementBuilder_);

  function ImageBuilder(src) {
    var _this;

    _classCallCheck(this, ImageBuilder);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ImageBuilder).call(this, 'img'));
    _this.element.src = src;

    _this.element.setAttribute('aria-hidden', 'true');

    return _this;
  }

  _createClass(ImageBuilder, [{
    key: "withAlt",
    value: function withAlt(alt) {
      this.element.alt = alt;
      return this;
    }
  }, {
    key: "onClick",
    value: function onClick(onclick) {
      this.element.onclick = onclick;
      return this;
    }
  }]);

  return ImageBuilder;
}(HTMLElementBuilder_1.default);

exports.default = ImageBuilder;
},{"./HTMLElementBuilder":"src/components/HTMLElementBuilder.ts"}],"src/components/IconBuilder.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var HTMLElementBuilder_1 = __importDefault(require("./HTMLElementBuilder"));

var IconBuilder =
/*#__PURE__*/
function (_HTMLElementBuilder_) {
  _inherits(IconBuilder, _HTMLElementBuilder_);

  function IconBuilder(iconName) {
    var _this;

    _classCallCheck(this, IconBuilder);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(IconBuilder).call(this, 'i'));
    _this.classNames = ['fa', iconName];

    _this.element.setAttribute('aria-hidden', 'true');

    return _this;
  }

  return IconBuilder;
}(HTMLElementBuilder_1.default);

exports.default = IconBuilder;
},{"./HTMLElementBuilder":"src/components/HTMLElementBuilder.ts"}],"src/views/profile.view.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var actions_1 = require("../actions");

var ButtonBuilder_1 = __importDefault(require("../components/ButtonBuilder"));

var DivisionBuilder_1 = __importDefault(require("../components/DivisionBuilder"));

var IconBuilder_1 = __importDefault(require("../components/IconBuilder"));

var state_service_1 = require("../util/state.service");

var util_1 = require("../util/util");

var ProfileView =
/*#__PURE__*/
function () {
  function ProfileView() {
    _classCallCheck(this, ProfileView);
  }

  _createClass(ProfileView, null, [{
    key: "updateView",
    value: function updateView(villager, fromListId) {
      state_service_1.stateService.currentLoadedProfileId = villager.id;
      util_1.clearElement(util_1.getElement('profile'));
      this.appendVillagerInfo(villager);
      this.appendWikiAndStoreButtons(villager);
      this.updateListSelect(fromListId);
      this.updateProfileImage(villager);
      this.fadeTransition();
    }
  }, {
    key: "updateListSelect",
    value: function updateListSelect(selectedListId) {
      if (!state_service_1.stateService.aProfileIsLoaded()) {
        return;
      }

      if (selectedListId) {
        state_service_1.stateService.currentListSelect = selectedListId;
      }

      util_1.getElement('list_select').disabled = state_service_1.stateService.listsAreEmpty();
      util_1.clearElement(util_1.getElement('list_select'));
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = state_service_1.stateService.getLists()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var list = _step.value;
          // tslint:disable-next-line: triple-equals
          util_1.getElement('list_select').appendChild(this.aListDropdownOption(list, list.id === state_service_1.stateService.currentListSelect));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.updateAddVillagerButton();
    }
  }, {
    key: "updateAddVillagerButton",
    value: function updateAddVillagerButton() {
      util_1.clearElement(util_1.getElement('add_remove_button'));

      if (state_service_1.stateService.villagerIsInList(state_service_1.stateService.currentLoadedProfileId, util_1.getListSelectValue())) {
        util_1.getElement('add_remove_button').appendChild(this.aRemoveVillagerFromListButton());
      } else {
        util_1.getElement('add_remove_button').appendChild(this.anAddVillagerToListButton());
      }
    }
  }, {
    key: "appendVillagerInfo",
    value: function appendVillagerInfo(villager) {
      this.appendVillagerNameInfo(villager.name);
      this.appendABreakElement();
      this.appendVillagerSpeciesInfo(villager.species);
      this.appendABreakElement();
      this.appendVillagerPersonalityInfo(villager.personality);
      this.appendABreakElement();
      this.appendVillagerCoffeeInfo(villager.coffee);
      this.appendABreakElement();
      this.appendVillagerBirthdayInfo(villager);
    }
  }, {
    key: "appendWikiAndStoreButtons",
    value: function appendWikiAndStoreButtons(villager) {
      util_1.getElement('profile').appendChild(this.anAddOrRemoveElement());
      this.appendABreakElement();
      util_1.getElement('profile').appendChild(this.aWikiIconButton(villager.wiki));
      util_1.getElement('profile').appendChild(this.aStoreIconButton(villager.store));
    }
  }, {
    key: "updateProfileImage",
    value: function updateProfileImage(villager) {
      var profileImageElement = util_1.getElement('profile-image');
      profileImageElement.alt = util_1.villagerHasProfileImage(villager) ? "Profile image (".concat(villager.name, ")") : 'Profile image not available (yet)';
      profileImageElement.title = util_1.villagerHasProfileImage(villager) ? "Profile image (".concat(villager.name, ")") : 'Profile image not available (yet)';
      profileImageElement.src = "./villager_heads/".concat(villager.head);
    }
  }, {
    key: "appendABreakElement",
    value: function appendABreakElement() {
      util_1.getElement('profile').appendChild(util_1.aBreakElement());
    }
  }, {
    key: "appendATextNode",
    value: function appendATextNode(text) {
      util_1.getElement('profile').appendChild(this.aTextNode(text));
    }
  }, {
    key: "appendVillagerNameInfo",
    value: function appendVillagerNameInfo(villagerName) {
      util_1.getElement('profile').appendChild(this.aNameIcon());
      this.appendATextNode(villagerName);
    }
  }, {
    key: "appendVillagerSpeciesInfo",
    value: function appendVillagerSpeciesInfo(villagerSpecies) {
      util_1.getElement('profile').appendChild(this.aSpeciesIcon());
      this.appendATextNode(villagerSpecies);
    }
  }, {
    key: "appendVillagerPersonalityInfo",
    value: function appendVillagerPersonalityInfo(villagerPersonality) {
      util_1.getElement('profile').appendChild(this.aPersonalityIcon());
      this.appendATextNode(villagerPersonality);
    }
  }, {
    key: "appendVillagerCoffeeInfo",
    value: function appendVillagerCoffeeInfo(villagerCoffee) {
      util_1.getElement('profile').appendChild(this.aCoffeeIcon());
      this.appendATextNode(villagerCoffee);
    }
  }, {
    key: "appendVillagerBirthdayInfo",
    value: function appendVillagerBirthdayInfo(villager) {
      util_1.getElement('profile').appendChild(this.aBirthdayIcon(villager));
      util_1.getElement('profile').appendChild(this.aBirthdayTextNode(villager.birthday));
    }
  }, {
    key: "anAddOrRemoveElement",
    value: function anAddOrRemoveElement() {
      return new DivisionBuilder_1.default().withPadding(0).withDisplay('inline-block').build();
    }
  }, {
    key: "aWikiIconButton",
    value: function aWikiIconButton(wikiLink) {
      return new ButtonBuilder_1.default(function () {
        window.open(wikiLink, '_blank');
      }).asFontAwesome('fa-wikipedia-w').withTitle('Open Wiki page').withClassNames('clickable').build();
    }
  }, {
    key: "aStoreIconButton",
    value: function aStoreIconButton(storeLink) {
      return new ButtonBuilder_1.default(function () {
        window.open(storeLink, '_blank');
      }).asFontAwesome('fa-shopping-bag').withTitle('Buy this art!').withClassNames('clickable').build();
    }
  }, {
    key: "aListDropdownOption",
    value: function aListDropdownOption(list, isSelected) {
      var dropdownOption = document.createElement('option');
      dropdownOption.innerHTML = list.title;
      dropdownOption.value = list.id.toString();
      dropdownOption.selected = isSelected;
      return dropdownOption;
    }
  }, {
    key: "aTextNode",
    value: function aTextNode(text) {
      return text === '' ? this.anNASpanElement() : document.createTextNode(text);
    }
  }, {
    key: "aNameIcon",
    value: function aNameIcon() {
      return new IconBuilder_1.default('fa-tag').withTitle('Name').build();
    }
  }, {
    key: "aSpeciesIcon",
    value: function aSpeciesIcon() {
      return new IconBuilder_1.default('fa-user').withTitle('Species').build();
    }
  }, {
    key: "aPersonalityIcon",
    value: function aPersonalityIcon() {
      return new IconBuilder_1.default('fa-heart').withTitle('Personality').build();
    }
  }, {
    key: "aCoffeeIcon",
    value: function aCoffeeIcon() {
      return new IconBuilder_1.default('fa-coffee').withTitle('Favourite coffee').build();
    }
  }, {
    key: "aBirthdayIcon",
    value: function aBirthdayIcon(villager) {
      if (util_1.birthdayIsToday(villager.birthday)) {
        return this.aBirthdayButton(villager.name);
      } else {
        return new IconBuilder_1.default('fa-birthday-cake').withTitle('Birthday').build();
      }
    }
  }, {
    key: "aBirthdayTextNode",
    value: function aBirthdayTextNode(birthday) {
      if (util_1.birthdayIsToday(birthday)) {
        var birthdaySpan = document.createElement('span');
        birthdaySpan.innerHTML = birthday;
        birthdaySpan.className = 'birthday';
        return birthdaySpan;
      } else {
        return this.aTextNode(birthday);
      }
    }
  }, {
    key: "aBirthdayButton",
    value: function aBirthdayButton(villagerName) {
      return new ButtonBuilder_1.default(function () {
        new Audio('./happybirthday.mp3').play();
      }).asFontAwesome('fa-birthday-cake').withTitle("Happy birthday to ".concat(villagerName, "!")).withClassNames('clickable').withColor('hotpink').build();
    }
  }, {
    key: "anAddVillagerToListButton",
    value: function anAddVillagerToListButton() {
      var isDisabled = state_service_1.stateService.listsAreEmpty();
      return new ButtonBuilder_1.default(function () {
        actions_1.addVillager(state_service_1.stateService.currentLoadedProfileId, util_1.getListSelectValue());
      }).asFontAwesome('fa-plus').isDisabled(isDisabled).withTitle('Add to list').withClassNames(isDisabled ? 'disabled' : 'clickable').build();
    }
  }, {
    key: "aRemoveVillagerFromListButton",
    value: function aRemoveVillagerFromListButton() {
      return new ButtonBuilder_1.default(function () {
        actions_1.removeVillager(state_service_1.stateService.currentLoadedProfileId, util_1.getListSelectValue());
      }).asFontAwesome('fa-minus').withTitle('Remove from list').withClassNames('clickable').build();
    }
  }, {
    key: "anNASpanElement",
    value: function anNASpanElement() {
      var naElement = document.createElement('span');
      naElement.className = 'na';
      naElement.innerHTML = 'N/A';
      return naElement;
    }
  }, {
    key: "fadeTransition",
    value: function fadeTransition() {
      /* // Transition:
      // Hide:
      let results = document.querySelectorAll<HTMLElement>('#info *');
      for (let i = 0; i < results.length; i++) {
          results[i].style.opacity = '0';
      }
      // Show:
      setTimeout(function () {
          let results = document.querySelectorAll<HTMLElement>('#info *');
          for (let i = 0; i < results.length; i++) {
              results[i].style.opacity = '1';
          }
      }, 100); */
    }
  }]);

  return ProfileView;
}();

exports.default = ProfileView;
},{"../actions":"src/actions.ts","../components/ButtonBuilder":"src/components/ButtonBuilder.ts","../components/DivisionBuilder":"src/components/DivisionBuilder.ts","../components/IconBuilder":"src/components/IconBuilder.ts","../util/state.service":"src/util/state.service.ts","../util/util":"src/util/util.ts"}],"src/views/lists.view.ts":[function(require,module,exports) {
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var actions_1 = require("../actions");

var ButtonBuilder_1 = __importDefault(require("../components/ButtonBuilder"));

var DivisionBuilder_1 = __importDefault(require("../components/DivisionBuilder"));

var ImageBuilder_1 = __importDefault(require("../components/ImageBuilder"));

var state_service_1 = require("../util/state.service");

var util_1 = require("../util/util");

var profile_view_1 = __importDefault(require("./profile.view"));

var ListsView =
/*#__PURE__*/
function () {
  function ListsView() {
    _classCallCheck(this, ListsView);
  }

  _createClass(ListsView, null, [{
    key: "updateView",
    value: function updateView(withListToRenameId) {
      var listContentElement = document.createElement('div');

      if (state_service_1.stateService.listsAreEmpty()) {
        listContentElement = this.anEmptyListInfoElement();
      } else {
        this.appendLists(listContentElement, withListToRenameId);
      }

      util_1.clearElement(util_1.getElement('lists'));
      util_1.getElement('lists').appendChild(listContentElement);

      if (state_service_1.stateService.listsAreEmpty()) {
        util_1.getElement('emptylists_newlist_button').onclick = actions_1.newList;
      }

      this.updateListEditingButtons();

      if (withListToRenameId) {
        this.focusAndSelectRenameInput();
      }
    }
  }, {
    key: "appendLists",
    value: function appendLists(listContentElement, withListToRenameId) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = state_service_1.stateService.getLists()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var list = _step.value;

          if (withListToRenameId && list.id === withListToRenameId) {
            this.appendListWithRenameInputSection(listContentElement, list);
          } else {
            this.appendListSection(listContentElement, list);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "appendListSection",
    value: function appendListSection(listContentElement, list) {
      listContentElement.appendChild(this.aListTitleElement(list));
      listContentElement.appendChild(this.aListDeleteButton(list));
      listContentElement.appendChild(this.aListRenameButton(list));
      listContentElement.appendChild(this.aVillagerListIconsSection(list));
    }
  }, {
    key: "appendListWithRenameInputSection",
    value: function appendListWithRenameInputSection(listContentElement, list) {
      listContentElement.appendChild(this.aListTitleInputElement(list));
      listContentElement.appendChild(this.aListRenameConfirmButton(list));
      listContentElement.appendChild(this.aVillagerListIconsSection(list));
    }
  }, {
    key: "updateListEditingButtons",
    value: function updateListEditingButtons() {
      var exportListsButton = util_1.getElement('exportlists_button');
      var clearListsButton = util_1.getElement('clearlists_button');
      exportListsButton.disabled = state_service_1.stateService.listsAreEmpty();
      clearListsButton.disabled = state_service_1.stateService.listsAreEmpty();
      exportListsButton.className = state_service_1.stateService.listsAreEmpty() ? 'disabled fa fa-upload' : 'clickable fa fa-upload';
      clearListsButton.className = state_service_1.stateService.listsAreEmpty() ? 'disabled fa fa-times' : 'clickable fa fa-times';
    }
  }, {
    key: "aListTitleElement",
    value: function aListTitleElement(list) {
      return new ButtonBuilder_1.default(function () {
        profile_view_1.default.updateListSelect(list.id);
      }).withInnerHTML(list.title).withClassNames('clickable', 'list').build();
    }
  }, {
    key: "aListDeleteButton",
    value: function aListDeleteButton(list) {
      return new ButtonBuilder_1.default(function () {
        actions_1.deleteList(list.id);
      }).asFontAwesome('fa-trash').withTitle('Delete list').withClassNames('clickable').build();
    }
  }, {
    key: "aListRenameButton",
    value: function aListRenameButton(list) {
      return new ButtonBuilder_1.default(function () {
        actions_1.renameList(list.id);
      }).asFontAwesome('fa-pencil').withTitle('Edit list title').withClassNames('clickable').build();
    }
  }, {
    key: "aVillagerListIconsSection",
    value: function aVillagerListIconsSection(list) {
      var _ref,
          _this = this;

      return (_ref = new DivisionBuilder_1.default()).withChildren.apply(_ref, _toConsumableArray(list.members.map(function (villager) {
        return _this.aVillagerListIcon(villager, list.id);
      }))).withPaddingTop(0).withPaddingBottom(0).build();
    }
  }, {
    key: "aVillagerListIcon",
    value: function aVillagerListIcon(villager, listId) {
      return new ImageBuilder_1.default("./villager_icons/".concat(villager, ".gif")).onClick(function () {
        actions_1.loadProfile(villager, listId);
      }).withTitle(util_1.trimName(villager)).build();
    }
  }, {
    key: "anEmptyListInfoElement",
    value: function anEmptyListInfoElement() {
      return new DivisionBuilder_1.default() // .withInnerHTML('Click<i onclick="index.newList();" title="Add list" class="clickable fa fa-plus" aria-hidden="true" style="margin-left:3px;margin-right:3px;"></i>to make a new list!')
      .withInnerHTML('Click<i id="emptylists_newlist_button" title="Add list" class="clickable fa fa-plus" style="color: orange;" aria-hidden="true" style="margin-left:3px;margin-right:3px;"></i>to make a new list!').withPaddingLeft(15).withColor('orange').build();
    }
  }, {
    key: "aListTitleInputElement",
    value: function aListTitleInputElement(list) {
      var _this2 = this;

      var listTitleInputElement = document.createElement('input');

      listTitleInputElement.onchange = function () {
        actions_1.applyTitle(list.id, _this2.getRenameListTitleValue());
      };

      listTitleInputElement.id = 'rename_bar';
      listTitleInputElement.type = 'text';
      listTitleInputElement.value = list.title;
      listTitleInputElement.maxLength = 30;
      return listTitleInputElement;
    }
  }, {
    key: "aListRenameConfirmButton",
    value: function aListRenameConfirmButton(list) {
      var _this3 = this;

      return new ButtonBuilder_1.default(function () {
        actions_1.applyTitle(list.id, _this3.getRenameListTitleValue());
      }).asFontAwesome('fa-check').withTitle('Edit name').withClassNames('clickable').build();
    }
  }, {
    key: "getRenameListTitleValue",
    value: function getRenameListTitleValue() {
      return util_1.getElement('rename_bar').value;
    }
  }, {
    key: "focusAndSelectRenameInput",
    value: function focusAndSelectRenameInput() {
      util_1.getElement('rename_bar').focus();
      util_1.getElement('rename_bar').select();
    }
  }]);

  return ListsView;
}();

exports.default = ListsView;
},{"../actions":"src/actions.ts","../components/ButtonBuilder":"src/components/ButtonBuilder.ts","../components/DivisionBuilder":"src/components/DivisionBuilder.ts","../components/ImageBuilder":"src/components/ImageBuilder.ts","../util/state.service":"src/util/state.service.ts","../util/util":"src/util/util.ts","./profile.view":"src/views/profile.view.ts"}],"src/views/search.view.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var actions_1 = require("../actions");

var ButtonBuilder_1 = __importDefault(require("../components/ButtonBuilder"));

var DivisionBuilder_1 = __importDefault(require("../components/DivisionBuilder"));

var ImageBuilder_1 = __importDefault(require("../components/ImageBuilder"));

var util_1 = require("../util/util");

var villagers_json_1 = __importDefault(require("../util/villagers.json"));

var SearchView =
/*#__PURE__*/
function () {
  function SearchView() {
    _classCallCheck(this, SearchView);
  }

  _createClass(SearchView, null, [{
    key: "updateView",
    value: function updateView() {
      var resultList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : villagers_json_1.default;
      var searchResultsElement = util_1.getElement('search_results');
      util_1.clearElement(searchResultsElement);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = resultList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var villager = _step.value;
          searchResultsElement.appendChild(this.aVillagerSearchResultButton(villager));
          searchResultsElement.appendChild(util_1.aBreakElement());
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.fadeTransition();
    }
  }, {
    key: "aVillagerSearchResultButton",
    value: function aVillagerSearchResultButton(villager) {
      return new ButtonBuilder_1.default(function () {
        actions_1.loadProfile(villager.id);
      }).withClassNames('result').withChildren(this.aVillagersSearchResultImage(villager), this.aVillagersSearchResultNameElement(villager.name)).build();
    }
  }, {
    key: "aVillagersSearchResultNameElement",
    value: function aVillagersSearchResultNameElement(villagerName) {
      return new DivisionBuilder_1.default().withInnerHTML(villagerName).build();
    }
  }, {
    key: "aVillagersSearchResultImage",
    value: function aVillagersSearchResultImage(villager) {
      return new ImageBuilder_1.default("./villager_icons/".concat(villager.id, ".gif")).withAlt(villager.name).withFloatLeft().build();
    }
  }, {
    key: "fadeTransition",
    value: function fadeTransition() {
      /* // Transition:
      // Hide:
      document.querySelectorAll<HTMLElement>('.result')
          .forEach(result => result.style.opacity = '0');
      // Show:
      setTimeout(function () {
          document.querySelectorAll<HTMLElement>('.result')
              .forEach(result => result.style.opacity = '1');
      }, 100); */
    }
  }]);

  return SearchView;
}();

exports.default = SearchView;
},{"../actions":"src/actions.ts","../components/ButtonBuilder":"src/components/ButtonBuilder.ts","../components/DivisionBuilder":"src/components/DivisionBuilder.ts","../components/ImageBuilder":"src/components/ImageBuilder.ts","../util/util":"src/util/util.ts","../util/villagers.json":"src/util/villagers.json"}],"node_modules/file-saver/dist/FileSaver.min.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(b,c,d){var e=new XMLHttpRequest;e.open("GET",b),e.responseType="blob",e.onload=function(){a(e.response,c,d)},e.onerror=function(){console.error("could not download file")},e.send()}function d(a){var b=new XMLHttpRequest;return b.open("HEAD",a,!1),b.send(),200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(a,b,d,e){if(e=e||open("","_blank"),e&&(e.document.title=e.document.body.innerText="downloading..."),"string"==typeof a)return c(a,b,d);var g="application/octet-stream"===a.type,h=/constructor/i.test(f.HTMLElement)||f.safari,i=/CriOS\/[\d]+/.test(navigator.userAgent);if((i||g&&h)&&"object"==typeof FileReader){var j=new FileReader;j.onloadend=function(){var a=j.result;a=i?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),e?e.location.href=a:location=a,e=null},j.readAsDataURL(a)}else{var k=f.URL||f.webkitURL,l=k.createObjectURL(a);e?e.location=l:location.href=l,e=null,setTimeout(function(){k.revokeObjectURL(l)},4E4)}});f.saveAs=a.saveAs=a,"undefined"!=typeof module&&(module.exports=a)});


},{}],"src/actions.ts":[function(require,module,exports) {
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var state_service_1 = require("./util/state.service");

var util_1 = require("./util/util");

var villagers_json_1 = __importDefault(require("./util/villagers.json"));

var lists_view_1 = __importDefault(require("./views/lists.view"));

var profile_view_1 = __importDefault(require("./views/profile.view"));

var search_view_1 = __importDefault(require("./views/search.view"));

var file_saver_1 = require("file-saver");

exports.villagers = villagers_json_1.default;

function viewLists(withListToRenameId) {
  lists_view_1.default.updateView(withListToRenameId);
  profile_view_1.default.updateListSelect();
}

exports.viewLists = viewLists;

function renameList(listId) {
  viewLists(listId);
}

exports.renameList = renameList;

function loadProfile(id) {
  var fromListId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : util_1.getListSelectValue();
  profile_view_1.default.updateView(getVillagerById(id), fromListId);
}

exports.loadProfile = loadProfile;

function addVillager(villagerNameToAdd, listId) {
  if (villagerNameToAdd !== '') {
    state_service_1.stateService.addVillagerToList(villagerNameToAdd, listId);
    viewLists();
  }
}

exports.addVillager = addVillager;

function removeVillager(villagerNameToRemove, listId) {
  if (villagerNameToRemove !== '') {
    state_service_1.stateService.removeVillagerFromList(villagerNameToRemove, listId);
    viewLists();
  }
}

exports.removeVillager = removeVillager;

function newList() {
  var newListID = state_service_1.stateService.addNewList();
  viewLists(newListID);
}

exports.newList = newList;

function deleteList(id) {
  var listToDelete = state_service_1.stateService.getListById(id);

  if (confirm("Are you sure you want to delete \"".concat(listToDelete.title, "\"?"))) {
    state_service_1.stateService.deleteList(id);
    viewLists();
  }
}

exports.deleteList = deleteList;

function applyTitle(listId, newTitle) {
  if (newTitle !== '') {
    state_service_1.stateService.renameList(listId, newTitle);
  }

  viewLists();
}

exports.applyTitle = applyTitle;

function clearAllLists() {
  if (confirm('Are you sure you want to clear all lists?')) {
    state_service_1.stateService.clearAllLists();
    viewLists();
  }
}

exports.clearAllLists = clearAllLists;

function updateAddVillagerButton() {
  state_service_1.stateService.currentListSelect = util_1.getListSelectValue();
  profile_view_1.default.updateAddVillagerButton();
}

exports.updateAddVillagerButton = updateAddVillagerButton;

function updateSearch() {
  search(util_1.getElement('search_bar').value);
}

exports.updateSearch = updateSearch;

function openImportDialog() {
  util_1.getElement('file_input').click();
}

exports.openImportDialog = openImportDialog; // TODO

function openViewer() {// window.location.href = 'viewer/index.html';
}

exports.openViewer = openViewer; // Export lists as .json file

function exportLists() {
  var blob = new Blob([JSON.stringify(state_service_1.stateService.getLists(), null, 2)], {
    type: 'text/plain'
  });
  file_saver_1.saveAs(blob, 'ACLists.json');
}

exports.exportLists = exportLists; // Import lists from .json file

function importListsFromFile() {
  if (!state_service_1.stateService.listsAreEmpty()) {
    if (!confirm('Are you sure you want to override current lists?')) {
      return;
    }
  }

  var selectedFile = util_1.getElement('file_input').files[0];
  state_service_1.stateService.importListFromFile(selectedFile, viewLists);
}

exports.importListsFromFile = importListsFromFile;

function getVillagerById(villagerId) {
  return villagers_json_1.default.find(function (v) {
    return v.id === villagerId;
  });
}

function search(query) {
  if (query === '') {
    search_view_1.default.updateView();
    return;
  }

  query = query.toLowerCase();
  var villagersFilteredOnName = villagers_json_1.default.filter(function (villager) {
    return villager.name.toLowerCase().includes(query);
  });
  var villagersFilteredOnPersonality = villagers_json_1.default.filter(function (villager) {
    return villager.personality.toLowerCase().includes(query);
  });
  var villagersFilteredOnSpecies = villagers_json_1.default.filter(function (villager) {
    return villager.species.toLowerCase().includes(query);
  });
  var results = [].concat(_toConsumableArray(villagersFilteredOnName), _toConsumableArray(villagersFilteredOnPersonality), _toConsumableArray(villagersFilteredOnSpecies));
  results = util_1.removeDuplicates(results);
  search_view_1.default.updateView(results);
} // Show loading icon in search bar


function searchbarLoading() {
  util_1.getElement('search_results').innerHTML = '<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>';
} // Useful functions for in the console


function getVillagersWhosBirthdayIsToday() {
  return villagers_json_1.default.filter(function (v) {
    return util_1.birthdayIsToday(v.birthday);
  }).map(function (v) {
    return v.name;
  });
}

function percentageOfVillagersWithProfileImage() {
  var allVillagersCount = villagers_json_1.default.length;
  var villagersWithProfileImageCount = villagers_json_1.default.filter(function (v) {
    return v.head !== 'wip.jpg';
  }).length;
  var percentage = Math.floor(villagersWithProfileImageCount / allVillagersCount * 100);
  return "".concat(percentage, "% of all villagers have a profile image. (").concat(villagersWithProfileImageCount, "/").concat(allVillagersCount, ")");
}
},{"./util/state.service":"src/util/state.service.ts","./util/util":"src/util/util.ts","./util/villagers.json":"src/util/villagers.json","./views/lists.view":"src/views/lists.view.ts","./views/profile.view":"src/views/profile.view.ts","./views/search.view":"src/views/search.view.ts","file-saver":"node_modules/file-saver/dist/FileSaver.min.js"}],"src/init.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var actions_1 = require("./actions");

var util_1 = require("./util/util");

function init() {
  bindEvents();
  actions_1.updateSearch();
  actions_1.viewLists();
}

function bindEvents() {
  util_1.getElement('search_bar').oninput = actions_1.updateSearch;
  util_1.getElement('search_button').onclick = actions_1.updateSearch;
  util_1.getElement('newlist_button').onclick = actions_1.newList;
  util_1.getElement('exportlists_button').onclick = actions_1.exportLists;
  util_1.getElement('importlists_button').onclick = actions_1.openImportDialog;
  util_1.getElement('clearlists_button').onclick = actions_1.clearAllLists;
  util_1.getElement('openviewer_button').onclick = actions_1.openViewer;
  util_1.getElement('file_input').onchange = actions_1.importListsFromFile;
  util_1.getElement('list_select').onchange = actions_1.updateAddVillagerButton;
}

init();
},{"./actions":"src/actions.ts","./util/util":"src/util/util.ts"}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64682" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/init.ts"], null)
//# sourceMappingURL=/init.de039eb1.js.map