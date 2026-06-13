import { onManageActiveEffect } from "../helpers/effects.mjs";
/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class MagesAndMansionsActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['mandm', 'sheet', 'actor'],
      width: 720,
      height: 600,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'core',
        },
      ],
    });
  }

  /** @override */
  get template() {
    return `systems/mandm/templates/actor/${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.document.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Adding a pointer to CONFIG.MANDM
    context.config = CONFIG.MANDM;

    // Prepare character data and items.
    if (actorData.type == 'actor') {
      this._prepareItems(context);
      this._prepareActorData(context);
    }
    else if (actorData.type == 'npc') {
      this._prepareItems(context)
    }

    // Enrich biography info for display
    // Enrichment turns text like `[[/r 1d20]]` into buttons
    context.enrichedBiography = await TextEditor.enrichHTML(
      this.actor.system.biography,
      {
        // Whether to show secret blocks in the finished html
        secrets: this.document.isOwner,
        // Necessary in v11, can be removed in v12
        async: true,
        // Data to fill in for inline rolls
        rollData: this.actor.getRollData(),
        // Relative UUID resolution
        relativeTo: this.actor,
      }
    );

    return context;
  }

  /**
   * Character-specific context modifications
   *
   * @param {object} context The context object to mutate
   */
  _prepareActorData(context) {
    // This is where you can enrich character-specific editor fields
    // or setup anything else that's specific to this type
  }

  /**
   * Organize and classify Items for Actor sheets.
   *
   * @param {object} context The context object to mutate
   */
  _prepareItems(context) {
    // Initialize containers.
    const gear = [];
    const feats = [];
    const spells = [];
    const actions = [];
    const afflictions = [];
    const misc = [];
    const effects = context.effects;

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;
      //Check to see if it's an Action. If the Actor is also an NPC, block the item from wherever else it would go.
      if (!(["", " "].includes(i.system.roll)) || i.system.force_display){
        actions.push(i);
      } 
      if (this.document.type != "npc") {
        // Append to gear.
        if (i.type === 'item') {
          gear.push(i);
        }
        else if (i.type === 'feat') {
          feats.push(i);
        }
        else if (i.type === 'spell') {
          spells.push(i);
        }
        else if (i.type === 'affliction') {
          afflictions.push(i);
        }
        else if (i.type === 'background' || i.type === 'ancestry' || i.type === 'class') {
          misc.push(i);
        }
        if (i.effects) {
          for (let j of i.effects) {
            if (j.transfer) {
              j.system.parentId = i._id;
              effects.push(j);
            }
          }
        }
      }
      else {
      // Append to gear.
      if (i.type === 'item') {
        gear.push(i);
      }
      else if (i.type === 'feat') {
        if (["", " "].includes(i.system.roll) && !(i.system.force_display)) {
          feats.push(i);
        }
      }
      else if (i.type === 'spell') {
        spells.push(i);
      }
      else if (i.type === 'background' || i.type === 'ancestry' || i.type === 'class') {
        misc.push(i);
      }
      if (i.effects) {
        for (let j of i.effects) {
          if (j.transfer) {
            j.system.parentId = i._id;
            effects.push(j);
          }
        }
      }
    }
    }

    // Assign and return
    context.gear = gear;
    context.feats = feats;
    context.spells = spells;
    context.actions = actions;
    context.misc = misc;
    context.effects = effects;
    context.afflictions = afflictions;

  /* -------------------------------------------- */
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Rollable abilities.
    html.on('click', '.rollable', this._onRoll.bind(this));
    

    // Render the item sheet for viewing/editing prior to the editable check.
    html.on('click', '.item-edit', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.on('click', '.item-create', this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on('click', '.item-delete', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.on('click', '.effect-control', (ev) => {
      const row = ev.currentTarget.closest('li');
      var document = this.actor;
      if (row.dataset.parentId && row.dataset.parentId !== this.actor.id) {
        document = this.actor.items.get(row.dataset.parentId);
      }
//        row.dataset.parentId === this.actor.id
//          ? this.actor
//          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

    // Add Active Effect
//    html.on('click', '.add-effect', (ev) => {
//      const effectData = {
//        name: "New Effect"
//      };
//      const new_effect = ActiveEffect.implementation.create({name: "New Effect"},{parent: this.actor})
//    });

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains('inventory-header')) return;
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', handler, false);
      });
    }

    //Add a Proficiency
    html.on('click', '.new-prof', (ev) =>
      {
        const new_key = Object.keys(this.actor.system.other_profs).length;
        this.actor.addProf(new_key, "");
        this._render();
      }
    );

    //Remove a given Proficiency
    html.on('click', '.remove-prof', (ev) =>
      {
        const removed = ev.currentTarget.dataset.key;
        this.actor.removeProf(removed);
        this._render();
      }
    );

    //Add a Sense
    html.on('click', '.new-sense', (ev) =>
      {
        const new_key = Object.keys(this.actor.system.sense).length;
        this.actor.addSense(new_key, "");
        this._render();
      }
    );

    //Remove a given Sense
    html.on('click', '.remove-sense', (ev) =>
      {
        const removed = ev.currentTarget.dataset.key;
        this.actor.removeSense(removed);
        this._render();
      }
    );

    //Add a VRI
    html.on('click', '.new-VRI', (ev) =>
      {
        const new_key = Object.keys(this.actor.system.VRI).length;
        this.actor.system.VRI[new_key] = {"choice":"Resistance", "type":"Fire", "value":0};
        this._render();
      }
    );

    //Remove a given VRI
    html.on('click', '.remove-VRI', (ev) =>
      {
        const removed = ev.currentTarget.dataset.key;
        this.actor.removeVRI(removed);
        this._render();
      }
    );

    //Handle Breathers
    html.on('click', '.breather', (ev) =>
      {
        this.actor.breather();
    ChatMessage.create({speaker: ChatMessage.getSpeaker({ actor: this.actor }), whisper: game.users.activeGM, content: "<p title='Dont forget caps on Resource Names, and set max to a number.'>You have taken a Breather.<br>Your Resources and Spell Slots have been replenished accordingly.<br>You may roll 1 Hit Die [[/r 1d(@hit_die.type) + @con_mod]] of [[@hit_die.value]]</p>"})
      }
    );

    //Handle Short Rests
    html.on('click', '.short-rest', (ev) =>
      {
        this.actor.shortRest();
    ChatMessage.create({speaker: ChatMessage.getSpeaker({ actor: this.actor }), whisper: game.users.activeGM, content: "<p title='Dont forget caps on Resource Names, and set max to a number.'>You have taken a Short Rest.<br>Your Resources and Spell Slots have been replenished accordingly.<br>You may roll up to [[@hit_die.value]] Hit Die [[/r 1d(@hit_die.type) + @con_mod]]<br>Don't forget to roll against Afflictions you were exposed to, or Infection if Bloodied.<br>Taking 10 is not supported with this button.</p>"})
      }
    );

    //Handle Long Rests
    html.on('click', '.long-rest', (ev) =>
      {
        this.actor.longRest();
    ChatMessage.create({speaker: ChatMessage.getSpeaker({ actor: this.actor }), whisper: game.users.activeGM, content: "<p title='Dont forget caps on Resource Names, and set max to a number.'>You have taken a Long Rest.<br>Your Resources and Spell Slots have been replenished accordingly.<br>You may roll up to [[@hit_die.value]] Hit Die [[/r 1d(@hit_die.type) + @con_mod]]<br>Don't forget to roll against Afflictions you were exposed to, or Infection if Bloodied.<br>If you are protected from weather, have eaten a Cooked Meal, and are sleeping on comfortable bedding, this is a Full Rest.<br>Full Rests reduce Drained, Exhaustion and Impaired by Quality and restore Hit Dice equal to Quality<br>Taking 10 is not supported with this button.</p>"})
      }
    );
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system['type'];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  };

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());      
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode')
      });
      return roll;
    }
  }
}