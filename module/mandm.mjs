// Import document classes.
import { MagesAndMansionsActor } from './documents/actor.mjs';
import { MagesAndMansionsItem } from './documents/item.mjs';
// Import sheet classes.
import { MagesAndMansionsActorSheet } from './sheets/actor-sheet.mjs';
import { MagesAndMansionsItemSheet } from './sheets/item-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { MANDM } from './helpers/config.mjs';

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.mandm = {
    MagesAndMansionsActor,
    MagesAndMansionsItem,
  };

  // Add custom constants for configuration.
  CONFIG.MANDM = {
    initiativeUpdate: async function(updateOptions, combat) {
      let tok = game.scenes.current.tokens.filter(t => (t.inCombat));
      let tok1 = game.combats.active.combatants
      for (let t in tok) {
        if (!tok[t].combatant.isDefeated) {
          tok[t].actor.update({"system.actions.value": Math.min(tok[t].actor.system.actions.value + (tok[t].actor.system.action_up*updateOptions.direction), tok[t].actor.system.actions.max)});
          tok[t].combatant.rollInitiative(String(Math.min(tok[t].actor.system.actions.value + (tok[t].actor.system.action_up*updateOptions.direction), tok[t].actor.system.actions.max)));
          }
        else {tok[t].combatant.rollInitiative}
      }
    }
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: '@actions.value',
    decimals: 2,
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = MagesAndMansionsActor;
  CONFIG.Item.documentClass = MagesAndMansionsItem;

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  //CONFIG.ActiveEffect.legacyTransferral = false;

  // Register sheet application classes
  Actors.registerSheet('mandm', MagesAndMansionsActorSheet, {
    makeDefault: true,
    label: 'MANDM.SheetLabels.Actor',
  });
  Items.registerSheet('mandm', MagesAndMansionsItemSheet, {
    makeDefault: true,
    label: 'MANDM.SheetLabels.Item',
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

// This is supposed to handle Initiative when a new Round starts. Yay, automation!
Hooks.on('combatRound', async function (combat, updateData, updateOptions) {
  if (game.user.isGM) {
    CONFIG.MANDM.initiativeUpdate(updateOptions, combat);
  }
  else {
    await game.socket.emit('system.mandm', {
      type: 'gmUpdateRequest',
      updateOptions: updateOptions,
      combat: combat
    })
  }

  //Set the current Turn to the Top or Bottom of the Turn Order
  //Note: This lets you skip Turns at 0.
    if (updateOptions.direction < 0) {
      combat.turn = 0;
    }
    else {
      combat.turn = combat.turns.length;
    }
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

 Hooks.once('ready', function () {
   // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
   Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));

   game.socket.on('system.mandm', (data) => {
    if (data.type === 'gmUpdateRequest' && game.user.isGM) {
      CONFIG.MANDM.initiativeUpdate(data.updateOptions, data.combat);
    }})
 });

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

 /**
  * Create a Macro from an Item drop.
  * Get an existing item macro if one exists, otherwise create a new one.
  * @param {Object} data     The dropped data
  * @param {number} slot     The hotbar slot to use
  * @returns {Promise}
  */
 async function createItemMacro(data, slot) {
   // First, determine if this is a valid owned item.
   if (data.type !== 'Item') return;
   if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
     return ui.notifications.warn(
       'You can only create macro buttons for owned Items'
     );
   }
   // If it is, retrieve it based on the uuid.
   const item = await Item.fromDropData(data);

   // Create the macro command using the uuid.
   const command = `game.mandm.rollItemMacro("${data.uuid}");`;
   let macro = game.macros.find(
     (m) => m.name === item.name && m.command === command
   );
   if (!macro) {
     macro = await Macro.create({
       name: item.name,
       type: 'script',
       img: item.img,
       command: command,
       flags: { 'mandm.itemMacro': true },
     });
   }
   game.user.assignHotbarMacro(macro, slot);
   return false;
 }

 /**
  * Create a Macro from an Item drop.
  * Get an existing item macro if one exists, otherwise create a new one.
  * @param {string} itemUuid
  */
 function rollItemMacro(itemUuid) {
   // Reconstruct the drop data so that we can load the item.
   const dropData = {
     type: 'Item',
     uuid: itemUuid,
   };
   // Load the item from the uuid.
   Item.fromDropData(dropData).then((item) => {
     // Determine if the item loaded and if it's an owned item.
     if (!item || !item.parent) {
       const itemName = item?.name ?? itemUuid;
       return ui.notifications.warn(
         `Could not find item ${itemName}. You may need to delete and recreate this macro.`
       );
     }

     // Trigger the item roll
     item.roll();
   });
 }

/**
 * Adds a datalist helper for suggesting valid Actor attribute keys in the ActiveEffect config dialog.
 */
Hooks.on("renderActiveEffectConfig", (activeEffectConfig, html, data) => {
  const effectsSection = html.querySelector("section[data-tab='effects']");
  if (!effectsSection) return;

  const datalist = document.createElement("datalist");
  datalist.id = "attribute-key-list";

  const inputFields = effectsSection.querySelectorAll(".key input");
  inputFields.forEach(input => input.setAttribute("list", datalist.id));

  const attributeKeys = [];

  for (const model of Object.values(CONFIG.Actor.dataModels)) {
    model.schema.apply(function() {
      if (!(this instanceof foundry.data.fields.SchemaField)) {
        attributeKeys.push({
          key: this.fieldPath,
          label: this.label,
        });
      }
    });
  }

  attributeKeys
    .sort((a, b) => a.key.localeCompare(b.key))
    .forEach(({ key, label }) => {
      const option = document.createElement("option");
      option.value = key;
      if (label) option.label = label;
      datalist.appendChild(option);
    });

  effectsSection.appendChild(datalist);
});
