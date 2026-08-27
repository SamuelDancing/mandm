/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class MagesAndMansionsActor extends Actor {
  /** @override */
//  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
  //  super.prepareData();

    //Manually set the call order, to prevent double-effect application
    //this.prepareBaseData();
    //this.prepareDerivedData();

    //Prepare Embedded Documents again, to make sure Active Effects can actually modify Derived Data.
    //this.prepareEmbeddedDocuments();
//  }

  breather() {
    for (let i in this.system.resource) {
      const n = this.system.resource[i].name;
      const uppers = "system.resource."+i+".value";
      if (this.system.resource[i].rest == "breather" || n == "Rage" || n == "Ki") {
        try {
          this.update({[uppers]: this.system.resource[i].max})
        }
        catch {
          console.error("Unable to update value of "+n+"Pleace ensure that "+n+".max is a number.");
        }
      }
      else if (this.system.resource[i].rest == "short" || n == "Sorcery" || n == "Pact Points") {
        try {
          this.update({[uppers]: Math.min(this.system.resource[i].max, this.system.resource[i].value + 1)})   
        }
        catch {
          console.error("Unable to update value of "+n+"Pleace ensure that "+n+".max is a number.");
        }     
      }
      else if (n == "Technique") {
        this.update({[uppers]: 1})
      }
    }
    this.update({"system.slots.current": Math.min(this.system.slots.max, this.system.slots.current+1), "system.pact_slots.current": Math.min(this.system.pact_slots.max, this.system.pact_slots.current+1)});
  }

  shortRest() {
    for (let i in this.system.resource) {
      const n = this.system.resource[i].name;
      const uppers = "system.resource."+i+".value";
      if (this.system.resource[i].rest == "breather" || n == "Rage" || n == "Ki" || this.system.resource[i].rest == "short" || n == "Sorcery" || n == "Pact Points") {
        try {
        this.update({[uppers]: this.system.resource[i].max})
        }
        catch {
          console.error("Unable to update value of "+n+"Pleace ensure that "+n+".max is a number.");
        }
      }
      else if (this.system.resource[i].rest == "long" || n == "Supplies" || n == "Bardic Inspiration" || n == "Divine Intervention" || n == "Druidry" || n == "Cunning" || n == "Sorcery" || n == "Scholar Points") {
        try {
          this.update({[uppers]: Math.min(this.system.resource[i].max, this.system.resource[i].value + 1)})
        }
        catch {
          console.error("Unable to update value of "+n+"Pleace ensure that "+n+".max is a number.");
        }    
      }
      else if (n == "Technique") {
        this.update({[uppers]: 1})
      }
    }
    this.update({"system.slots.current": Math.min(this.system.slots.max, this.system.slots.current+Math.max(this.system.cha_mod, 2)), "system.pact_slots.current": Math.min(this.system.pact_slots.max, this.system.pact_slots.current+Math.max(this.system.cha_mod, 2))});
  }

  longRest() {
    for (let i in this.system.resource) {
      const n = this.system.resource[i].name;
      const uppers = "system.resource."+i+".value";
      if (this.system.resource[i].rest == "breather" || n == "Rage" || n == "Ki" || this.system.resource[i].rest == "short" || n == "Sorcery" || n == "Pact Points" || this.system.resource[i].rest == "long" || n == "Supplies" || n == "Bardic Inspiration" || n == "Divine Intervention" || n == "Druidry" || n == "Cunning" || n == "Sorcery" || n == "Scholar Points") {
        try {
         this.update({[uppers]: this.system.resource[i].max})
        }
        catch {
          console.error("Unable to update value of "+n+"Pleace ensure that "+n+".max is a number.");
        }
      }
      else if (n == "Technique") {
        this.update({[uppers]: 1})
      }
    this.update({"system.slots.current": Math.min(this.system.slots.max, this.system.slots.current+Math.max(this.system.cha_mod, 2)+this.system.level), "system.pact_slots.current": Math.min(this.system.pact_slots.max, this.system.pact_slots.current+Math.max(this.system.cha_mod, 2)+this.system.level)});
    }
  }

  addProf(key, value) {
    //Add a new Trait with the provided Value
    this.system.other_profs[key] = value;
//    this.update();
  }
  
  removeProf(key_to_remove) {
    //Cycle all Traits back by one, then delete the last empty trait.
    var index = key_to_remove;
    var copy = Number(index) + 1;
    while (index < (Object.keys(this.system.other_profs).length)-1) {
      copy = Number(index) + 1;
      this.system.other_profs[index] = this.system.other_profs[copy];
      index = Number(index) + 1;
    };
    const updel = "system.other_profs.-="+index;
    this.update({[updel]: null});
  }

  addSense(key, value) {
    //Add a new Trait with the provided Value
    this.system.sense[key] = value;
//    this.update();
  }
  
  removeSense(key_to_remove) {
    //Cycle all Traits back by one, then delete the last empty trait.
    var index = key_to_remove;
    var copy = Number(index) + 1
    while (index < (Object.keys(this.system.sense).length)-1) {
      copy = Number(index) + 1;
      this.system.sense[index] = this.system.sense[copy];
      index = Number(index) + 1;
    };
    const updel = "system.sense.-="+index;
    this.update({[updel]: null});
//    this.update();
  }
  
  removeVRI(key_to_remove) {
    //Cycle all Traits back by one, then delete the last empty trait.
    var index = key_to_remove;
    var copy = Number(index) + 1
    while (index < (Object.keys(this.system.VRI).length)-1) {
      copy = Number(index) + 1;
      this.system.VRI[index] = this.system.VRI[copy];
      index = Number(index) + 1;
    };
    const updel = "system.VRI.-="+index;
    this.update({[updel]: null});
//    this.update();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
    super.prepareBaseData();
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.systemless || {};

    systemData.role_types = {"Bruiser":"Bruiser", "Skirmisher":"Skirmisher", "Tank":"Tank", "Trapper":"Trapper", "Caster":"Spellcaster", "Spotter":"Spotter", "Healer":"Healer", "Buffer":"Buffer", "Debuffer":"Debuffer"};
    systemData.type_choice = {"None":"None", "Abberation":"Abberation", "Beast":"Beast", "Celestial":"Celestial", "Construct":"Construct", "Dragon":"Dragon", "Elemental":"Elemental", "Fey":"Fey", "Fiend":"Fiend", "Humanoid":"Humanoid", "Plant":"Plant", "Undead":"Undead"};
    systemData.adv_choice = {"dis":"Disadvantage", "norm":"Normal", "adv":"Advantage"};
    systemData.VRIC = {"Resistance":"Resistance", "Immunity":"Immunity", "Vulnerability":"Vulnerability"}
    systemData.size_sel = {"-3":"Miniscule", "-2":"Tiny", "-1":"Small", "0":"Medium", "1":"Large", "2":"Huge", "3":"Gargantuan", "4":"Colossal"};
    if (systemData.size === "Miniscule") {
      systemData.size = -3;
    }
    else if (systemData.size === "Tiny") {
      systemData.size = -2;
    }
    else if (systemData.size === "Small") {
      systemData.size = -1;
    }
    else if (systemData.size === "Large") {
      systemData.size = 1;
    }
    else if (systemData.size === "Huge") {
      systemData.size = 2;
    }
    else if (systemData.size === "Gargantuan") {
      systemData.size = 3;
    }
    else if (systemData.size === "Colossal") {
      systemData.size = 4;
    }
    else if (systemData.size === "Medium") {
      systemData.size = 0;
    }
    if (systemData.adv == "adv") {
      systemData.d20 = "2d20kh";
    }
    else if (systemData.adv == "dis") {
      systemData.d20 = "2d20kl";
    }
    else {
      systemData.d20 = "1d20";
    }
    systemData.armor_dex_max = 99;
    systemData.armor_dex_min = -10;
    systemData.pb = Math.ceil(systemData.level/4)+1;
    systemData.str = systemData.abilities.str_base;
    systemData.dex = systemData.abilities.dex_base;
    systemData.con = systemData.abilities.con_base;
    systemData.int = systemData.abilities.int_base;
    systemData.wis = systemData.abilities.wis_base;
    systemData.cha = systemData.abilities.cha_base;
    systemData.str_mod = Math.trunc(systemData.str/2)-5;
    systemData.dex_mod = Math.trunc(systemData.dex/2)-5;
    systemData.con_mod = Math.trunc(systemData.con/2)-5;
    systemData.int_mod = Math.trunc(systemData.int/2)-5;
    systemData.wis_mod = Math.trunc(systemData.wis/2)-5;
    systemData.cha_mod = Math.trunc(systemData.cha/2)-5;
    systemData.con_save = systemData.con_mod +(systemData.pb)*Number(systemData.proficiencies.constitution);
    systemData.int_save = systemData.int_mod +(systemData.pb)*Number(systemData.proficiencies.intelligence);
    systemData.wis_save = systemData.wis_mod +(systemData.pb)*Number(systemData.proficiencies.wisdom);
    systemData.cha_save = systemData.cha_mod +(systemData.pb)*Number(systemData.proficiencies.charisma);
    systemData.ssdc = systemData.cha;
    systemData.hit_die.max = systemData.level;
    systemData.arcana = systemData.int_mod+(systemData.pb)*Number(systemData.proficiencies.arcana);
    systemData.occultism = systemData.int_mod+(systemData.pb)*Number(systemData.proficiencies.occultism);
    systemData.religion = systemData.int_mod+(systemData.pb)*Number(systemData.proficiencies.religion);
    systemData.survival = systemData.int_mod+(systemData.pb)*Number(systemData.proficiencies.survival);
    systemData.medicine = systemData.wis_mod+(systemData.pb)*Number(systemData.proficiencies.medicine);
    systemData.nurture = systemData.wis_mod+(systemData.pb)*Number(systemData.proficiencies.nurture);
    systemData.perception = systemData.wis_mod+(systemData.pb)*Number(systemData.proficiencies.perception);
    systemData.society = systemData.wis_mod+(systemData.pb)*Number(systemData.proficiencies.society);
    systemData.deception = systemData.cha_mod+(systemData.pb)*Number(systemData.proficiencies.deception);
    systemData.performance = systemData.cha_mod+(systemData.pb)*Number(systemData.proficiencies.performance);
    systemData.persuasion = systemData.cha_mod+(systemData.pb)*Number(systemData.proficiencies.persuasion);
    systemData.intimidation = systemData.cha_mod+(systemData.pb)*Number(systemData.proficiencies.intimidation);
    systemData.ac = 10;
    systemData.sab = systemData.pb + systemData.int_mod + systemData.attack_mod;
    systemData.mal = 2;
    systemData.wdb = systemData.str_mod;
    systemData.wfdb = Math.max(systemData.dex_mod, systemData.str_mod);
    systemData.sdb = systemData.wis_mod;
    systemData.shb = systemData.wis_mod;
    systemData.weight = systemData.str * 4;    
    systemData.carrying = 0;
    systemData.action_up = 0;
    systemData.resource_mult = 1;
    systemData.slot_calc = Math.max(systemData.cha_mod, systemData.pb);

    //for each Item (type: 'item'), get weight, and add to carrying.
    for (const i in this.items) {
      if (i.type === 'item') {
        systemData.carrying = systemData.carrying + i.weight;
      }
    }
    systemData.dex_save = systemData.dex_mod + (systemData.pb)*Number(systemData.proficiencies.dexterity);
    systemData.acrobatics = systemData.dex_mod+(systemData.pb)*Number(systemData.proficiencies.acrobatics);
    systemData.athletics = systemData.str_mod+(systemData.pb)*Number(systemData.proficiencies.athletics);
    systemData.stealth = systemData.dex_mod+(systemData.pb)*Number(systemData.proficiencies.stealth);
    systemData.thievery = systemData.dex_mod+(systemData.pb)*Number(systemData.proficiencies.thievery);
    systemData.wab = systemData.pb + systemData.dex_mod + systemData.attack_mod;
    systemData.str_save = systemData.str_mod + (systemData.pb)*Number(systemData.proficiencies.strength);
    systemData.ac_score = "dex"

    //Do Creature Type Checks before Active Effects can mess with them.
    const ancestry = this.items.find(isAncestry => isAncestry.type === "ancestry");
    if (ancestry && actorData.type == 'actor') {
      systemData.speed.land = ancestry.system.speed;
      if (ancestry.system.type1 !== "None") {
        systemData.types[0] = ancestry.system.type1;
      
      if (ancestry.system.type2 !== "None") {
        systemData.types[1] = ancestry.system.type2;
      
      if (ancestry.system.type3 !== "None") {
        systemData.types[2] = ancestry.system.type3;
      }}}}

    systemData.actions.max = 0

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareActorData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * @override
   * Augment the actor source data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    super.prepareDerivedData();
    const actorData = this;
    const systemData = actorData.system;

    //Clamp Size Values
    if (systemData.size > 4) {
      systemData.size = 4;
    }
    else if (systemData.size < -3) {
      systemData.size = -3;
    }
    

    systemData.actions.max = Math.max(systemData.action_up, systemData.speed.land, systemData.speed.swim, systemData.speed.burrow, systemData.speed.climb, systemData.speed.fly/2) + systemData.actions.max;

    //Size based value changes, which will reflect properly, thanks to some later code.
    systemData.sab += -2*systemData.size;
    systemData.str_mod += 2*systemData.size;
    systemData.wdb += -2*systemData.size;
    systemData.wfdb += 2*systemData.size;
    systemData.dex_mod += -2*systemData.size;
    systemData.weight = systemData.weight * 4**(systemData.size);
    systemData.size_multi = 2**systemData.size;

    if (systemData.size == -3) {
      systemData.size_dis = "Miniscule";
    }
    else if (systemData.size == -2) {
      systemData.size_dis = "Tiny";
    }
    else if (systemData.size == -1) {
      systemData.size_dis = "Small";
    }
    else if (systemData.size == 0) {
      systemData.size_dis = "Medium";
    }
    else if (systemData.size == 1) {
      systemData.size_dis = "Large";
    }
    else if (systemData.size == 2) {
      systemData.size_dis = "Huge";
    }
    else if (systemData.size == 3) {
      systemData.size_dis = "Gargantuan";
    }
    else if (systemData.size === "Colossal") {
      systemData.size_dis = "Colossal";
    }

    //Post-Effect stat updates
    if (systemData.str != systemData.abilities.str_base) {
      let x = (Math.trunc(systemData.str/2)-5) - (Math.trunc(systemData.abilities.str_base/2)-5);
      systemData.str_mod += x;
      systemData.str_save += x;
      systemData.athletics += x;
      systemData.wdb += x;
    }
    if (systemData.str_mod != (Math.trunc(systemData.str/2)-5)) {
      let x = systemData.str_mod - (Math.trunc(systemData.str/2)-5)
      systemData.str_save += x;
      systemData.athletics += x;
      systemData.wdb += x;
    }
    if (systemData.dex != systemData.abilities.dex_base) {
      let x = (Math.trunc(systemData.dex/2)-5) - (Math.trunc(systemData.abilities.dex_base/2)-5);
      systemData.dex_mod += x;
      systemData.dex_save += x;
      systemData.acrobatics += x;
      systemData.stealth += x;
      systemData.thievery += x;
      systemData.wab += x;
      systemData.wfdb += x;
    }
    if (systemData.dex_mod != (Math.trunc(systemData.dex/2)-5)) {
      let x = systemData.dex_mod - (Math.trunc(systemData.dex/2)-5)
      systemData.dex_save += x;
      systemData.acrobatics += x;
      systemData.stealth += x;
      systemData.thievery += x;
      systemData.wab += x;
      systemData.wfdb += x;
    }
    if (systemData.con != systemData.abilities.con_base) {
      let x = (Math.trunc(systemData.con/2)-5) - (Math.trunc(systemData.abilities.con_base/2)-5);
      systemData.con_mod += x;
      systemData.con_save += x;
    }
    if (systemData.con_mod != (Math.trunc(systemData.con/2)-5)) {
      let x = systemData.con_mod - (Math.trunc(systemData.con/2)-5)
      systemData.con_save += x;
    }
    if (systemData.int != systemData.abilities.int_base) {
      let x = (Math.trunc(systemData.int/2)-5) - (Math.trunc(systemData.abilities.int_base/2)-5);
      systemData.int_mod += x;
      systemData.int_save += x;
      systemData.sab += x;
      systemData.arcana += x;
      systemData.religion += x;
      systemData.occultism += x;
      systemData.survival += x;
    }
    if (systemData.int_mod != (Math.trunc(systemData.int/2)-5)) {
      let x = systemData.int_mod - (Math.trunc(systemData.int/2)-5);
      systemData.int_save += x;
      systemData.sab += x;
      systemData.arcana += x;
      systemData.religion += x;
      systemData.occultism += x;
      systemData.survival += x;
    }
    if (systemData.wis != systemData.abilities.wis_base) {
      let x = (Math.trunc(systemData.wis/2)-5) - (Math.trunc(systemData.abilities.wis_base/2)-5);
      systemData.wis_mod += x;
      systemData.wis_save += x;
      systemData.shb += x;
      systemData.sdb += x;
      systemData.medicine += x;
      systemData.nurture += x;
      systemData.perception += x;
      systemData.society += x;
    }
    if (systemData.wis_mod != (Math.trunc(systemData.wis/2)-5)) {
      let x = systemData.wis_mod - (Math.trunc(systemData.wis/2)-5);
      systemData.wis_save += x;
      systemData.shb += x;
      systemData.sdb += x;
      systemData.medicine += x;
      systemData.nurture += x;
      systemData.perception += x;
      systemData.society += x;
    }
    if (systemData.cha != systemData.abilities.cha_base) {
      let x = (Math.trunc(systemData.cha/2)-5) - (Math.trunc(systemData.abilities.cha_base/2)-5);
      systemData.cha_mod += x;
      systemData.cha_save += x;
      systemData.ssdc += systemData.cha - systemData.abilities.cha_base;
      systemData.intimidation += x;
      systemData.persuasion += x;
      systemData.performance += x;
      systemData.deception += x;
    }
    if (systemData.cha_mod != (Math.trunc(systemData.cha/2)-5)) {
      let x = systemData.cha_mod - (Math.trunc(systemData.cha/2)-5);
      systemData.cha_save += x;
      systemData.intimidation += x;
      systemData.persuasion += x;
      systemData.performance += x;
      systemData.deception += x;
    }
    if (systemData.pb != Math.ceil(systemData.level/4)+1) {
      let x = systemData.pb - (Math.ceil(systemData.level/4)+1);
      systemData.con_save += (x)*Number(systemData.proficiencies.constitution);
      systemData.int_save += (x)*Number(systemData.proficiencies.intelligence);
      systemData.wis_save += (x)*Number(systemData.proficiencies.wisdom);
      systemData.cha_save += (x)*Number(systemData.proficiencies.charisma);
      systemData.dex_save += (x)*Number(systemData.proficiencies.dexterity);
      systemData.acrobatics += (x)*Number(systemData.proficiencies.acrobatics);
      systemData.athletics += (x)*Number(systemData.proficiencies.athletics);
      systemData.stealth += (x)*Number(systemData.proficiencies.stealth);
      systemData.thievery += (x)*Number(systemData.proficiencies.thievery);
      systemData.wab += x;
      systemData.str_save += (x)*Number(systemData.proficiencies.strength);
      systemData.arcana += (x)*Number(systemData.proficiencies.arcana);
      systemData.occultism += (x)*Number(systemData.proficiencies.occultism);
      systemData.religion += (x)*Number(systemData.proficiencies.religion);
      systemData.survival += (x)*Number(systemData.proficiencies.survival);
      systemData.medicine += (x)*Number(systemData.proficiencies.medicine);
      systemData.nurture += (x)*Number(systemData.proficiencies.nurture);
      systemData.perception += (x)*Number(systemData.proficiencies.perception);
      systemData.society += (x)*Number(systemData.proficiencies.society);
      systemData.deception += (x)*Number(systemData.proficiencies.deception);
      systemData.performance += (x)*Number(systemData.proficiencies.performance);
      systemData.persuasion += (x)*Number(systemData.proficiencies.persuasion);
      systemData.intimidation += (x)*Number(systemData.proficiencies.intimidation);
      systemData.sab += x;
    }
    systemData.ac_calc = 0;
    if (systemData.ac_score == "dex") {
      systemData.ac_calc = systemData.dex_mod;
    }
    else if (systemData.ac_score == "str") {
      systemData.ac_calc = systemData.str_mod;
    }
    else if (systemData.ac_score == "con") {
      systemData.ac_calc = systemData.con_mod;
    }
    else if (systemData.ac_score == "int") {
      systemData.ac_calc = systemData.int_mod;
    }
    else if (systemData.ac_score == "wis") {
      systemData.ac_calc = systemData.wis_mod;
    }
    else if (systemData.ac_score == "cha") {
      systemData.ac_calc = systemData.cha_mod;
    }
    systemData.armor_dex_max += systemData.size * -2;
    systemData.ac += Math.max(Math.min(systemData.ac_calc, systemData.armor_dex_max), systemData.armor_dex_min);
    systemData.str_save += Number(systemData.save_mod);
    systemData.dex_save += Number(systemData.save_mod);
    systemData.con_save += Number(systemData.save_mod);
    systemData.int_save += Number(systemData.save_mod);
    systemData.wis_save += Number(systemData.save_mod);
    systemData.cha_save += Number(systemData.save_mod);
    systemData.athletics += Number(systemData.skill_mod);
    systemData.acrobatics += Number(systemData.skill_mod);
    systemData.stealth += Number(systemData.skill_mod);
    systemData.thievery += Number(systemData.skill_mod);
    systemData.arcana += Number(systemData.skill_mod);
    systemData.occultism += Number(systemData.skill_mod);
    systemData.religion += Number(systemData.skill_mod);
    systemData.survival += Number(systemData.skill_mod);
    systemData.medicine += Number(systemData.skill_mod);
    systemData.nurture += Number(systemData.skill_mod);
    systemData.perception += Number(systemData.skill_mod);
    systemData.society += Number(systemData.skill_mod);
    systemData.deception += Number(systemData.skill_mod);
    systemData.intimidation += Number(systemData.skill_mod);
    systemData.performance += Number(systemData.skill_mod);
    systemData.persuasion += Number(systemData.skill_mod);
    systemData.ssdc += Number(systemData.dc_mod);
    systemData.wab += Number(systemData.attack_mod);
    systemData.sab += Number(systemData.attack_mod);
    systemData.hp.max += Number(systemData.hp_mod);
    systemData.str_dis = systemData.str_mod + systemData.skill_mod;
    systemData.dex_dis = systemData.dex_mod + systemData.skill_mod;
    systemData.con_dis = systemData.con_mod + systemData.skill_mod;
    systemData.int_dis = systemData.int_mod + systemData.skill_mod;
    systemData.wis_dis = systemData.wis_mod + systemData.skill_mod;
    systemData.cha_dis = systemData.cha_mod + systemData.skill_mod;

    //Set some Minimum values
    systemData.sdb = Math.max(systemData.sdb, 0);
    systemData.shb = Math.max(systemData.shb, 0);

    this._prepareActiveCalcs(actorData);

    //Prepare the display text for Resistances, Vulnerabilities and Immunities.
    systemData.res_dis = "";
    for (const i in systemData.resistance) {
      if (systemData.resistance[i] > 0) {
        systemData.res_dis = systemData.res_dis + i + ": " + systemData.resistance[i] + ", ";
      }
    }
    systemData.res_dis = systemData.res_dis.slice(0, -2);

    systemData.vul_dis = "";
    for (const i in systemData.vulnerability) {
      if (systemData.vulnerability[i] > 0) {
        systemData.vul_dis = systemData.vul_dis + i + ": " + systemData.vulnerability[i] + ", ";
      }
    }
    systemData.vul_dis = systemData.vul_dis.slice(0, -2);

    systemData.per_dis = "";
    for (const i in systemData.persistent_damage) {
      if (systemData.persistent_damage[i] > 0) {
        systemData.per_dis = systemData.per_dis + i + ": " + systemData.persistent_damage[i] + ", ";
      }
    }
    systemData.per_dis = systemData.per_dis.slice(0, -2);

    systemData.imm_dis = "";
    for (const i of systemData.immunity) {
      systemData.imm_dis = systemData.imm_dis + i + ", ";
    }
    systemData.imm_dis = systemData.imm_dis.slice(0, -2);
  }

  /**
   * Post-ActiveEffect Sets
   */
  _prepareActiveCalcs(actorData) {
    const systemData = actorData.system;

    if (actorData.type === 'actor') {
      const class_name = this.items.find(i => i.type === "class");
      if (class_name) {

      //Chain of else ifs to apply the right Ability Score to Actions/Round 
      if (class_name.system.cam1 === "Strength") {systemData.casi1 = Number(systemData.str_mod) - 2*systemData.size;}
      else if (class_name.system.cam1 === "Dexterity") {systemData.casi1 = Number(systemData.dex_mod) + 2*systemData.size;}
      else if (class_name.system.cam1 === "Constitution") {systemData.casi1 = Number(systemData.con_mod);}
      else if (class_name.system.cam1 === "Intelligence") {systemData.casi1 = Number(systemData.int_mod);}
      else if (class_name.system.cam1 === "Wisdom") {systemData.casi1 = Number(systemData.wis_mod);}
      else if (class_name.system.cam1 === "Charisma") {systemData.casi1 = Number(systemData.cha_mod);}
      else {systemData.casi1 = -10}

      if (class_name.system.cam2 === "Strength") {systemData.casi2 = Number(systemData.str_mod) - 2*systemData.size;}
      else if (class_name.system.cam2 === "Dexterity") {systemData.casi2 = Number(systemData.dex_mod) + 2*systemData.size;}
      else if (class_name.system.cam2 === "Constitution") {systemData.casi2 = Number(systemData.con_mod);}
      else if (class_name.system.cam2 === "Intelligence") {systemData.casi2 = Number(systemData.int_mod);}
      else if (class_name.system.cam2 === "Wisdom") {systemData.casi2 = Number(systemData.wis_mod);}
      else if (class_name.system.cam2 === "Charisma") {systemData.casi2 = Number(systemData.cha_mod);}
      else {systemData.casi2 = -10}

      if (class_name.system.both_scores) {
        systemData.action_up = Math.max(1,systemData.con_mod+systemData.casi1+systemData.casi2) + systemData.action_mod;
      }
      else {
        systemData.action_up = Math.max(1,systemData.con_mod+systemData.casi1,systemData.con_mod+systemData.casi2) + systemData.action_mod;}

      }
      else {
        systemData.casi1 = -10,
        systemData.casi2 = -10
        systemData.action_up = 0
      }

      systemData.hp.max = (Math.max(0, systemData.con_mod)*systemData.level+systemData.hp.rolled+systemData.hit_die.type+systemData.hp.base+systemData.hp_mod);
      systemData.resource.primary.max = systemData.level * systemData.resource_mult;
    }

    else if (actorData.type === 'npc') {
      systemData.action_up = systemData.action_base + systemData.action_mod;
      systemData.hp.max = Math.ceil(Math.ceil(((systemData.con_mod+(systemData.hit_die.type+1)/2)*systemData.level))*systemData.size_multi)+systemData.hp_mod;
    }

    for (let i of actorData.appliedEffects) {
      for (let v of i.changes) {
        if (v.type == "override" && v.key == "system.action_up") {
        systemData.action_up = v.value;
        }
      }
    }

    for (let i of actorData.appliedEffects) {
      for (let v of i.changes) {
        if (v.type == "override" && v.key == "system.hp.max") {
        systemData.hp.max = v.value;
        }
      }
    }
  }

  /**
   * Prepare Character type specific data
   */
  _prepareActorData(actorData) {
    if (actorData.type !== 'actor') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    const ancestry = this.items.find(isAncestry => isAncestry.type === "ancestry");

    // Check for Ancestry, and apply common effects, including listing Ancestry.
    if (ancestry) {
      systemData.hp.base = Number(ancestry.system.base_hp);
      let x = ancestry.system.size;
      if (x === "Small") {systemData.size += -1;}
      else if (x === "Tiny") {systemData.size += -2;}
      else if (x === "Miniscule") {systemData.size += -3;}
      else if (x === "Large") {systemData.size += 1;}
      else if (x === "Huge") {systemData.size += 2;}
      else if (x === "Gargantuan") {systemData.size += 3;}
      else if (x === "Colossal") {systemData.size += 4;}
      else {x = 0;}
      systemData.ancestry = ancestry.name;
    }
    else {
      systemData.hp.base = 0;
      systemData.ancestry = "None";
    }

    //Make sure a Character's Class shows up properly.
    const class_name = this.items.find(i => i.type === "class");
    if (class_name) {
      systemData.class = class_name.name;
      systemData.hit_die.type = Number(class_name.system.hit_die);
      systemData.resource.primary.name = class_name.system.resource_name;

      // Remove empty Resource Types (BROKEN)
      for (let i in systemData.resource) {
        if (systemData.resource[i].name == '') {
//          const remove = 'system.resource.-='+i;
//          this.update({[remove]: null})
            console.log(systemData.resource[i].name)
        }
      }
    }
    else {
      systemData.class = "None";
    }

    //Once again, but for Backgrounds this time!
    const background = this.items.find(i => i.type === "background")
    if (background) {
      systemData.background = background.name;
    }
    else {
      systemData.background = "None";
    }

    

    //Iterate through Items, and add their cumulative weight to your Character, in addition to coin weight.
    systemData.carrying = (systemData.money.cp + systemData.money.sp + systemData.money.gp + systemData.money.pp)*0.02
    const itemData = this.items.filter(i => i.type === "item")
    for (let i in itemData) {
      systemData.carrying = Number(systemData.carrying) + Number(itemData[i].system.weight)*Number(itemData[i].system.quantity)
    }
  }

    _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    const systemData = actorData.system;

    // Set the correct Hit Die based on the Creature's Role in Combat. Also set Action Recovery while we're at it.
    if (systemData.role == "Bruiser") {
      systemData.hit_die.type = 10;
      systemData.action_base = Math.max(1,systemData.con_mod+systemData.str_mod);
    }
    else if (systemData.role == "Tank") {
      systemData.hit_die.type = 12;
      systemData.action_base = Math.max(1,systemData.con_mod+systemData.con_mod);
    }
    else if (systemData.role == "Trapper" || systemData.role == "Caster") {
      systemData.hit_die.type = 6;
      systemData.action_base = Math.max(1,systemData.con_mod+systemData.int_mod);
    }
    else {
      systemData.hit_die.type = 8;
    }

    // Check the rest of the Roles to see what Action Recovery should be based on.
    if (systemData.role == "Skirmisher") {
      systemData.action_base = Math.max(1,systemData.con_mod+systemData.dex_mod);
    }
    if (systemData.role == "Healer" || systemData.role == "Spotter") {
      systemData.action_base = Math.max(1,systemData.con_mod+systemData.wis_mod);
    }
    if (systemData.role == "Buffer" || systemData.role == "Debuffer") {
      systemData.action_base = Math.max(1,systemData.con_mod+systemData.cha_mod);
    }

    //Add manual types to actual types
    systemData.types = [];
    if (systemData.type1 !== "None") {
      systemData.types.push(systemData.type1);
    }
    if (systemData.type2 !== "None") {
      systemData.types.push(systemData.type2);
    }
    if (systemData.type3 !== "None") {
      systemData.types.push(systemData.type3);
    }
    if (systemData.type4 !== "None") {
      systemData.types.push(systemData.type4);
    }

    //Add manual Resistances
    for (const i in systemData.VRI) {
      let v = systemData.VRI[i];
      let x = v.value;
      if (x == "pb") {
        x = systemData.pb;
      }
      if (x == "level") {
        x = systemData.level;
      }
      if (v.choice == "Resistance") {
        systemData.resistance[v.type] = x;
      }
      else if (v.choice == "Immunity") {
        systemData.immunity.push(v.type);
      }
      else if (v.choice == "Vulnerability") {
        systemData.vulnerability[v.type] = x;
      }
    };

    //Put the values that are dependant on these last, to avoid delays in value updates.
    systemData.hp_con_boost = systemData.con_mod*systemData.level;
  }
}