// Import Modules
import { RunecairnActor } from './actor/actor.js';
import { RunecairnActorSheet } from './actor/actor-sheet.js';
import { RunecairnItem } from './item/item.js';
import { RunecairnItemSheet } from './item/item-sheet.js';

Hooks.once('init', async function () {
  game.runecairn = {
    RunecairnActor,
    RunecairnItem,
  };

  // Define custom Entity classes
  CONFIG.Actor.documentClass = RunecairnActor;
  CONFIG.Item.entityClass = RunecairnItem;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('runecairn', RunecairnActorSheet, { makeDefault: true });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('runecairn', RunecairnItemSheet, { makeDefault: true });

  // Pre-load templates
  const templatePaths = ['systems/runecairn/templates/parts/items-list.html'];
  loadTemplates(templatePaths);

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function () {
    let outStr = '';

    for (const arg in arguments) {
      if (typeof arguments[arg] !== 'object') {
        outStr += arguments[arg];
      }
    }

    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
  });

  Handlebars.registerHelper('boldIf', function (cond, options) {
    return cond ? '<b>' + options.fn(this) + '</b>' : options.fn(this);
  });
});
