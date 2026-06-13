import { onManageActiveEffect } from "../helpers/effects.mjs";
/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class MagesAndMansionsItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['mandm', 'sheet', 'item'],
      width: 520,
      height: 600,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'description',
        },
      ],
    });
  }

  /** @override */
  get template() {
    const path = 'systems/mandm/templates/item';
    // Return a single sheet for all item types.
    return `${path}/${this.item.type}-sheet.hbs`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.hbs`.
    // return `${path}/item-${this.item.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = this.document.toObject(false);

    // Enrich description info for display
    // Enrichment turns text like `[[/r 1d20]]` into buttons
    context.enrichedDescription = await TextEditor.enrichHTML(
      this.item.system.description,
      {
        // Whether to show secret blocks in the finished html
        secrets: this.document.isOwner,
        // Necessary in v11, can be removed in v12
        async: true,
        // Data to fill in for inline rolls
        rollData: this.item.getRollData(),
        // Relative UUID resolution
        relativeTo: this.item,
      }
    );

    // Add the item's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    // Adding a pointer to CONFIG.MANDM
    context.config = CONFIG.MANDM;

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.

    // Add a new Trait
    html.on('click', '.new-trait', (ev) =>
      {
        const new_key = Object.keys(this.item.system.trait).length;
        this.item.addToTraits(new_key, "");
        this._render();
      }
    );

    // Remove a given Trait
    html.on('click', '.remove-trait', (ev) =>
      {
        const removed = ev.currentTarget.dataset.key;
        this.item.removeFromTraits(removed);
        this._render();
      }
    );

    // Add a new Damage Formula
    html.on('click', '.new-dmg', (ev) =>
      {
        this.item.system.damage[Object.values(this.item.system.damage).length] = "0";
        this._render();
      }
    );

    // Remove a Damage Formula
    html.on('click', '.remove-dmg', (ev) =>
      {
        const removed = ev.currentTarget.dataset.key;
        this.item.removeFromDmg(removed);
        this._render();
      }
    );

    // Add a new Crit Formula
    html.on('click', '.new-crit', (ev) =>
      {
        this.item.system.crit[Object.values(this.item.system.crit).length] = "0";
        this._render();
      }
    );

      // Remove a Crit Formula
      html.on('click', '.remove-crit', (ev) => {
        const removed = ev.currentTarget.dataset.key;
        this.item.removeFromCrit(removed);
        this._render();
      }
    );

    // Active Effect management
    html.on('click', '.effect-control', (ev) =>
      onManageActiveEffect(ev, this.item)
    );
  }
}
