/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class MagesAndMansionsItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
    const systemData = this.system;
    if (systemData.save_options) {
      systemData.save_options.custom = "Custom"
    }
    systemData.weight_sum = Math.round(systemData.weight * systemData.quantity * 100)/100;
    systemData.value_sum = Math.round(systemData.value * systemData.quantity * 100)/100;
    systemData.trait_list = ["Edge", "Burn", "Blast", "Bleed", "Utility", "Boon"]
    systemData.active_options = {" ":"None", "watt":"Weapon Attack", "satt":"Spell Attack", "save":"Saving Throw", "damage":"Direct Damage/Heal"}
    systemData.save_options = {"ssdc":"Spell Save DC", "str":"Strength", "dex":"Dexterity", "con":"Constitution", "int":"Intelligence", "wis":"Wisdom", "cha":"Charisma", "custom": "Custom"}
    systemData.target_options = {"str":"Strength", "dex":"Dexterity", "con":"Constitution", "int":"Intelligence", "wis":"Wisdom", "cha":"Charisma"}
    systemData.hit_die_choice = {"4":"d4", "6":"d6", "8":"d8", "10":"d10", "12":"d12"}
    systemData.hp_choice = {"4":"4", "6":"6", "8":"8", "10":"10", "12":"12"}
    systemData.size_choice = {"Miniscule":"Miniscule", "Tiny":"Tiny", "Small":"Small", "Medium":"Medium", "Large":"Large", "Huge":"Huge", "Gargantuan":"Gargantuan", "Colossal":"Colossal"}
    systemData.type_choice = {"None":"None", "Abberation":"Abberation", "Beast":"Beast", "Celestial":"Celestial", "Construct":"Construct", "Dragon":"Dragon", "Elemental":"Elemental", "Fey":"Fey", "Fiend":"Fiend", "Humanoid":"Humanoid", "Plant":"Plant", "Undead":"Undead"}
    systemData.scores = {"Strength":"Strength", "Dexterity":"Dexterity", "Constitution":"Constitution", "Intelligence":"Intelligence", "Wisdom":"Wisdom", "Charisma":"Charisma", "None":"None"}
    systemData.schools = {"Abjuration":"Abjuration", "Conjuration":"Conjuration", "Divination":"Divination", "Enchantment":"Enchantment", "Evocation":"Evocation", "Illusion":"Illusion", "Necromancy":"Necromancy", "Transmutation":"Transmutation"}
    systemData.tiers = {"Cantrip":"Cantrip", "1st":"1st", "2nd":"2nd", "3rd":"3rd", "4th":"4th", "5th":"5th", "6th":"6th", "7th":"7th", "8th":"8th", "9th":"9th", "10th":"10th"}
  }

  addToTraits(key, value) {
    //Add a new Trait with the provided Value
    this.system.trait[key] = value;
//    this.update();
  }

  removeFromTraits(key_to_remove) {
    //Cycle all Traits back by one, then delete the last empty trait.
    var index = key_to_remove;
    var copy = Number(index) + 1
    while (index < (Object.keys(this.system.trait).length)-1) {
      copy = Number(index) + 1;
      this.system.trait[index] = this.system.trait[copy];
      index = Number(index) + 1;
    };
    const updel = "system.trait.-="+index;
    this.update({[updel]: null});
  }

  removeFromCrit(key_to_remove) {
    //Cycle all Crits back by one, then delete the last empty trait.
    var index = key_to_remove;
    var copy = Number(index) + 1
    while (index < (Object.keys(this.system.crit).length)-1) {
      copy = Number(index) + 1;
      this.system.crit[index] = this.system.crit[copy];
      index = Number(index) + 1;
    };
    const updel = "system.crit.-="+index;
    this.update({[updel]: null});
  }

  removeFromDmg(key_to_remove) {
    //Cycle all Damages back by one, then delete the last empty trait.
    var index = key_to_remove;
    var copy = Number(index) + 1
    while (index < (Object.keys(this.system.damage).length)-1) {
      copy = Number(index) + 1;
      this.system.damage[index] = this.system.damage[copy];
      index = Number(index) + 1;
    };
    const updel = "system.damage.-="+index;
    this.update({[updel]: null});
  }

  removeUpdate(path) {
    this.update({[path]: null})
  }

  /**
   * Prepare a data object which defines the data schema used by dice roll commands against this Item
   * @override
   */
  getRollData() {
    // Starts off by populating the roll data with a shallow copy of `this.system`
    const rollData = { ...this.system };

    // Quit early if there's no parent actor
    if (!this.actor) return rollData;

    // If present, add the actor's roll data
    rollData.actor = this.actor.getRollData();

    return rollData;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `${item.name}`;
    let messageObject = {speaker: speaker, flavor: label};
    if (rollMode == "gmroll") {
      if (game.user == game.users.activeGM) {
        messageObject.whisper = game.user;
      }
      else {
        messageObject.whisper = [game.user, game.users.activeGM];
      }
    }
    else if (rollMode == "blindroll") {
      messageObject.whisper = game.users.activeGM;
      messageObject.blind = true
    }
    else if (rollMode == "selfroll") {
      messageObject.whisper = game.user;
    }

    // If there's no roll data, send a chat message.
    // Otherwise, potential roll types: watt, satt, save, damage
    if (this.system.roll == "" || this.system.roll == " ") {
      messageObject.content = "<div class='flexrow' style='height: fitcontent'><img src='" + item.img + "' title='" + item.name + "' width='48px' height='48px' class='flexshrink'> <h4>"+ item.name +"</h4></div>" + item.system.description ?? '';
      ChatMessage.create(messageObject);
    }

    // Weapon Attack!
    else if (this.system.roll == "watt") {
      const rollData = this.getRollData();
      // Header & Label Row
      var message = "<div class='flexrow' style='height: fitcontent'><img src='" + item.img + "' title='" + item.name + "' width='48px' height='48px' class='flexshrink'> <h4>"+ item.name +"</h4></div><table>";
      // Target Indicator
      if (String(item.system.target).trim() != "") {
        message += "<h5>Affects: " + item.system.target + "</h5>";
      }
      if (game.user.targets.size > 0) {
        message += "<h5>Targeting: ";
        for (let i in game.user.targets.ids) {
          message += canvas.tokens.get(game.user.targets.ids[i]).name + ", ";
        }
        message = message.slice(0, -2) + "</h5>";
      }
      // Attack & Save Row
      message += "<tr><td>Attack Roll:";

      if (this.actor.system.adv == "adv") {message += " (Advantage)";}
      else if (this.actor.system.adv == "dis") {message += " (Disadvantage)";}

      message += "</td><td>[[";

      if (this.actor.system.adv == "adv") {message += "2d20kh";}
      else if (this.actor.system.adv == "dis") {message += "2d20kl";}
      else {message += "1d20"}

      message += " + @wab"
      if (rollData.roll_mod) {message += "+"+rollData.roll_mod;}
      message += "]]</td></tr>";
      // Damage Row
      message += "<tr><td>Damage/Healing:</td><td><ul style='list-style: none;'>";
      for (let i in item.system.damage) {
        message += "<li>[["+item.system.damage[i]+"]]";
        if (item.actor.system.size_multi != 1) {
          message += "(Size: * "+item.actor.system.size_multi+")";
        }
        message += "</li>";
      }
      message += "</ul></td></tr>";
      // Crit Row
      message += "<tr><td>Crit:</td><td><ul style='list-style: none;'>";
      for (let i in item.system.crit) {
        message += "<li>[["+item.system.crit[i]+"]]</li>";
      }
      message += "</ul></td></tr>";
      // Close Table
      message += "</table>";
      // Roll Description (If valid)
      if (item.system.roll_desc) {
        message += item.system.roll_desc;
      }

      messageObject.content = message;
      ChatMessage.create(messageObject);
//      ChatMessage.create(
//        {
//        speaker: speaker,
//        rollMode: rollMode,
//        content: message,
//      });
    }

    //Spell Attack!
    else if (this.system.roll == "satt") {
      const rollData = this.getRollData();
      // Header & Label Row
      var message = "<div class='flexrow' style='height: fitcontent'><img src='" + item.img + "' title='" + item.name + "' width='48px' height='48px' class='flexshrink'> <h4>"+ item.name +"</h4></div><table>";
      // Target Indicator
      if (String(item.system.target).trim() != "") {
        message += "<h5>Affects: " + item.system.target + "</h5>";
      }
      if (game.user.targets.size > 0) {
        message += "<h5>Targeting: ";
        for (let i in game.user.targets.ids) {
          message += canvas.tokens.get(game.user.targets.ids[i]).name + ", ";
        }
        message = message.slice(0, -2) + "</h5>";
      }
      // Attack & Save Row
      message += "<tr><td>Spell Attack Roll:";

      if (this.actor.system.adv == "adv") {message += " (Advantage)";}
      else if (this.actor.system.adv == "dis") {message += " (Disadvantage)";}

      message += "</td><td>[[";

      if (this.actor.system.adv == "adv") {message += "2d20kh";}
      else if (this.actor.system.adv == "dis") {message += "2d20kl";}
      else {message += "1d20"}

      message += " + @sab";

      if (rollData.roll_mod) {message += "+"+rollData.roll_mod;}
      message += "]]</td></tr>";
      // Damage Row
      message += "<tr><td>Damage/Healing:</td><td><ul style='list-style: none;'>";
      for (let i in item.system.damage) {
        message += "<li>[["+item.system.damage[i]+"]]";
        if (item.actor.system.size_multi != 1) {
          message += "(Size: * "+item.actor.system.size_multi+")";
        }
        message += "</li>";
      }
      message += "</ul></td></tr>";
      // Crit Row
      message += "<tr><td>Crit:</td><td><ul style='list-style: none;'>";
      for (let i in item.system.crit) {
        message += "<li>[["+item.system.crit[i]+"]]</li>";
      }
      message += "</ul></td></tr>";
      // Close Table
      message += "</table>";
      // Roll Description (If valid)
      if (item.system.roll_desc) {
        message += item.system.roll_desc;
      }

      messageObject.content = message;
      ChatMessage.create(messageObject);
//      ChatMessage.create({
//        speaker: speaker,
//        rollMode: rollMode,
//        content: message,
//      });
    }

    // Saving Throw!
    else if (this.system.roll == "save") {
      const rollData = this.getRollData();
      // Header & Label Row
      var message = "<div class='flexrow' style='height: fitcontent'><img src='" + item.img + "' title='" + item.name + "' width='48px' height='48px' class='flexshrink'> <h4>"+ item.name +"</h4></div><table>";
      // Target Indicator
      if (String(item.system.target).trim() != "") {
        message += "<h5>Affects: " + item.system.target + "</h5>";
      }
      if (game.user.targets.size > 0) {
        message += "<h5>Targeting: ";
        for (let i in game.user.targets.ids) {
          message += canvas.tokens.get(game.user.targets.ids[i]).name + ", ";
        }
        message = message.slice(0, -2) + "</h5>";
      }
      // Attack & Save Row
      message += "<tr><td>"+this.system.target_options[this.system.save_target]+" Save DC:</td><td>[[";
      if (rollData.save_source == "custom") {
        message += rollData.custom_dc;
      }
      else {
        message += "@"+rollData.save_source;
      }
      if (rollData.save_source != "ssdc") {
        message += "+@dc_mod";
      }
      message +="]]</td></tr>";
      // Damage Row
      message += "<tr><td>Damage/Healing:</td><td><ul style='list-style: none;'>";
      for (let i in item.system.damage) {
        message += "<li>[["+item.system.damage[i]+"]]";
        if (item.actor.system.size_multi != 1) {
          message += "(Size: * "+item.actor.system.size_multi+")";
        }
        message += "</li>";
      }
      message += "</ul></td></tr>";
      // Crit Row
      message += "<tr><td>Crit:</td><td><ul style='list-style: none;'>";
      for (let i in item.system.crit) {
        message += "<li>[["+item.system.crit[i]+"]]</li>";
      }
      message += "</ul></td></tr>";
      // Close Table
      message += "</table>";
      // Roll Description (If valid)
      if (item.system.roll_desc) {
        message += item.system.roll_desc;
      }

      messageObject.content = message;
      ChatMessage.create(messageObject);
//      ChatMessage.create({
//        speaker: speaker,
//        rollMode: rollMode,
//        content: message,
//      });
//      const rollData = this.getRollData();
//      const roll = new Roll("@actor."+rollData.save_source+"+@actor.dc_mod", rollData);
//
//      roll.toMessage({
//        speaker: speaker,
//        rollMode: rollMode,
//        flavor: rollData.save_target.concat(" Save DC")
//      });
//      new Roll(rollData.damage, rollData).toMessage({
//        speaker: speaker,
//        rollmode: rollMode,
//        flavor: "Damage Roll"
//      });
    }

    
    // Otherwise, create a roll and send a chat message from it.
    else if (this.system.roll == "damage") {
      // Header & Label Row
      var message = "<div class='flexrow' style='height: fitcontent'><img src='" + item.img + "' title='" + item.name + "' width='48px' height='48px' class='flexshrink'> <h4>"+ item.name +"</h4></div><table>";
      // Target Indicator
      if (String(item.system.target).trim() != "") {
        message += "<h5>Affects: " + item.system.target + "</h5>";
      }
      if (game.user.targets.size > 0) {
        message += "<h5>Targeting: ";
        for (let i in game.user.targets.ids) {
          message += canvas.tokens.get(game.user.targets.ids[i]).name + ", ";
        }
        message = message.slice(0, -2) + "</h5>";
      }
      // Attack & Save Row not needed for Damage Only.
      // Damage Row
      message += "<tr><td>Direct Damage/Healing:</td><td><ul style='list-style: none;'>";
      for (let i in item.system.damage) {
        message += "<li>[["+item.system.damage[i]+"]]";
        if (item.actor.system.size_multi != 1) {
          message += "(Size: * "+item.actor.system.size_multi+")";
        }
        message += "</li>";
      }
      message += "</ul></td></tr>";
      // Crit Row not needed for Damage Only.
      // Close Table
      message += "</table>";
      // Roll Description (If valid)
      if (item.system.roll_desc) {
        message += item.system.roll_desc;
      }

      messageObject.content = message;
      ChatMessage.create(messageObject);
//      ChatMessage.create({
//        speaker: speaker,
//        rollMode: rollMode,
//        content: message,
//      });
      // Retrieve roll data.
//      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat.
//      if (this.system.roll == "damage") {
//        const roll = new Roll(rollData.damage, rollData);
//      roll.toMessage({
//        speaker: speaker,
//        rollMode: rollMode,
//        flavor: label,
//      });
//      return roll;
//      }
//      else {
//        const roll = new Roll(rollData.roll, rollData);
//      roll.toMessage({
//        speaker: speaker,
//        rollMode: rollMode,
//        flavor: label,
//      });
//      new Roll(rollData.damage, rollData).toMessage({
//        speaker: speaker,
//        rollmode: rollMode,
//        flavor: "Damage Roll"
//      });
//      return roll;
//      }
      // If you need to store the value first, uncomment the next line.
      // const result = await roll.evaluate();
    }
    else {
      throw new Error("The roll you attempted is not supported. Set system.roll to something like watt or satt, or USE THE DROPDOWN (unless you're a dev).")
    }
  }
}
