/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    'systems/mandm/templates/actor/parts/actor-items.hbs',
    'systems/mandm/templates/actor/parts/actor-feats.hbs',
    'systems/mandm/templates/actor/parts/actor-spells.hbs',
    'systems/mandm/templates/actor/parts/actor-misc.hbs',
    'systems/mandm/templates/actor/parts/actor-actions.hbs',
    'systems/mandm/templates/actor/parts/actor-effects.hbs',
    'systems/mandm/templates/actor/parts/actor-afflictions.hbs',

    // Item Partial(s)
    'systems/mandm/templates/item/parts/item-effects.hbs',
    'systems/mandm/templates/item/parts/item-action-config.hbs'
  ]);
};
