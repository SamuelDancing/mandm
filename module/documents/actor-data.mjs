//Define and export the Actor Data for a Player. Items will be migrated separately if needed.

export class PlayerActorData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {            
    hp: new fields.SchemaField({
        value: new fields.NumberField({initial: 0}),
        max: new fields.NumberField({initial: 0}),
        rolled: new fields.NumberField({initial: 0})
    }),
    actions: new fields.SchemaField({
        value: new fields.NumberField({initial: 0}),
        max: new fields.NumberField({initial: 0})
    }),
    abilities: new fields.SchemaField({
        str_base: new fields.NumberField({
            initial: 10
        }),
        dex_base: new fields.NumberField({
            initial: 10
        }),
        con_base: new fields.NumberField({
            initial: 10
        }),
        int_base: new fields.NumberField({
            initial: 10
        }),
        wis_base: new fields.NumberField({
            initial: 10
        }),
        cha_base: new fields.NumberField({
            initial: 10
        })
    }),
    proficiencies: new fields.SchemaField({
        athletics: new fields.BooleanField({initial: false}),
        acrobatics: new fields.BooleanField({initial: false}),
        stealth: new fields.BooleanField({initial: false}),
        thievery: new fields.BooleanField({initial: false}),
        arcana: new fields.BooleanField({initial: false}),
        occultism: new fields.BooleanField({initial: false}),
        religion: new fields.BooleanField({initial: false}),
        survival: new fields.BooleanField({initial: false}),
        medicine: new fields.BooleanField({initial: false}),
        nurture: new fields.BooleanField({initial: false}),
        perception: new fields.BooleanField({initial: false}),
        society: new fields.BooleanField({initial: false}),
        deception: new fields.BooleanField({initial: false}),
        intimidation: new fields.BooleanField({initial: false}),
        performance: new fields.BooleanField({initial: false}),
        persuasion: new fields.BooleanField({initial: false}),
        strength: new fields.BooleanField({initial: false}),
        dexterity: new fields.BooleanField({initial: false}),
        constitution: new fields.BooleanField({initial: false}),
        intelligence: new fields.BooleanField({initial: false}),
        wisdom: new fields.BooleanField({initial: false}),
        charisma: new fields.BooleanField({initial: false})
    }), //From here on out, values will need to be set up.
    slots: new fields.SchemaField({
        max: new fields.NumberField({initial: 0}),
        current: new fields.NumberField({initial: 0})
    }),
    pact_slots: new fields.SchemaField({
        max: new fields.NumberField({initial: 0}),
        current: new fields.NumberField({initial: 0})
    }),
    hit_die: new fields.SchemaField({
        value: new fields.NumberField({initial: 0}),
        max: new fields.NumberField({initial: 0}),
        type: new fields.NumberField({initial: 4})
    }),
    hp_temp: new fields.NumberField({initial: 0}),
    speed: new fields.SchemaField({
        land: new fields.NumberField({initial: 30}),
        swim: new fields.NumberField({initial: 0}),
        burrow: new fields.NumberField({initial: 0}),
        climb: new fields.NumberField({initial: 0}),
        fly: new fields.NumberField({initial: 0}),
        hover: new fields.BooleanField({initial: false})
    }),
    resistance: new fields.ObjectField({}),
    vulnerability: new fields.ObjectField({}),
    immunity: new fields.ArrayField(new fields.StringField({})),
    persistent_damage: new fields.ObjectField({}),
            xp: new fields.NumberField({}),
            ancestry: new fields.StringField({initial: "None"}),
            background: new fields.StringField({initia: "None"}),
            class: new fields.StringField({initia: "None"}),
            death_saves: new fields.SchemaField({
                failure: new fields.NumberField({initial: 0}),
                success: new fields.NumberField({initial: 0})
            }),
            inspiration: new fields.NumberField({initial: 0}),
            resource: new fields.ObjectField({ initial: {primary: {name: "Resource 1", value: 0}}
//                primary: new fields.SchemaField({
//                    name: new fields.StringField({initial: "Resource 1"}),
//                    value: new fields.NumberField({initial: 0})
//                })
            }),
            money: new fields.SchemaField({
                pp: new fields.NumberField({initial: 0}),
                gp: new fields.NumberField({initial: 0}),
                sp: new fields.NumberField({initial: 0}),
                cp: new fields.NumberField({initial: 0})
            }),
            types: new fields.ObjectField({}),
            appearance: new fields.StringField({}),
            bonds: new fields.StringField({}),
            flaws: new fields.StringField({}),
            deity: new fields.StringField({}),
            backstory: new fields.StringField({}),
            lists: new fields.SchemaField({
                arcane: new fields.BooleanField({initial: false}),
                divine: new fields.BooleanField({initial: false}),
                occult: new fields.BooleanField({initial: false}),
                primal: new fields.BooleanField({initial: false})
            }),
    other_profs: new fields.ObjectField({}),
    biography: new fields.HTMLField({initial: 0}),
    sense: new fields.ObjectField({}),
    size: new fields.AnyField({initial: 0}),
    adv: new fields.StringField({initial: "norm"}),
    level: new fields.NumberField({initial: 1}),
    save_mod: new fields.NumberField({initial: 0}),
    skill_mod: new fields.NumberField({initial: 0}),
    action_mod: new fields.NumberField({initial: 0}),
    attack_mod: new fields.NumberField({initial: 0}),
    dc_mod: new fields.NumberField({initial: 0}),
    hp_mod: new fields.NumberField({initial: 0})
        }
    }
}

//Define the NPC Data Model separately because it's a lot simpler for this dev.

export class NPCActorData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {            
    hp: new fields.SchemaField({
        value: new fields.NumberField({initial: 0}),
        max: new fields.NumberField({initial: 0}),
        rolled: new fields.NumberField({initial: 0})
    }),
    actions: new fields.SchemaField({
        value: new fields.NumberField({initial: 0}),
        max: new fields.NumberField({initial: 0})
    }),
    abilities: new fields.SchemaField({
        str_base: new fields.NumberField({
            initial: 10
        }),
        dex_base: new fields.NumberField({
            initial: 10
        }),
        con_base: new fields.NumberField({
            initial: 10
        }),
        int_base: new fields.NumberField({
            initial: 10
        }),
        wis_base: new fields.NumberField({
            initial: 10
        }),
        cha_base: new fields.NumberField({
            initial: 10
        })
    }),
    proficiencies: new fields.SchemaField({
        athletics: new fields.BooleanField({initial: false}),
        acrobatics: new fields.BooleanField({initial: false}),
        stealth: new fields.BooleanField({initial: false}),
        thievery: new fields.BooleanField({initial: false}),
        arcana: new fields.BooleanField({initial: false}),
        occultism: new fields.BooleanField({initial: false}),
        religion: new fields.BooleanField({initial: false}),
        survival: new fields.BooleanField({initial: false}),
        medicine: new fields.BooleanField({initial: false}),
        nurture: new fields.BooleanField({initial: false}),
        perception: new fields.BooleanField({initial: false}),
        society: new fields.BooleanField({initial: false}),
        deception: new fields.BooleanField({initial: false}),
        intimidation: new fields.BooleanField({initial: false}),
        performance: new fields.BooleanField({initial: false}),
        persuasion: new fields.BooleanField({initial: false}),
        strength: new fields.BooleanField({initial: false}),
        dexterity: new fields.BooleanField({initial: false}),
        constitution: new fields.BooleanField({initial: false}),
        intelligence: new fields.BooleanField({initial: false}),
        wisdom: new fields.BooleanField({initial: false}),
        charisma: new fields.BooleanField({initial: false})
    }), //From here on out, values will need to be set up.
    slots: new fields.SchemaField({
        max: new fields.NumberField({initial: 0}),
        current: new fields.NumberField({initial: 0})
    }),
    pact_slots: new fields.SchemaField({
        max: new fields.NumberField({initial: 0}),
        current: new fields.NumberField({initial: 0})
    }),
    hit_die: new fields.SchemaField({
        value: new fields.NumberField({initial: 0}),
        max: new fields.NumberField({initial: 0}),
        type: new fields.NumberField({initial: 4})
    }),
    hp_temp: new fields.NumberField({initial: 0}),
    speed: new fields.SchemaField({
        land: new fields.NumberField({initial: 30}),
        swim: new fields.NumberField({initial: 0}),
        burrow: new fields.NumberField({initial: 0}),
        climb: new fields.NumberField({initial: 0}),
        fly: new fields.NumberField({initial: 0}),
        hover: new fields.BooleanField({initial: false})
    }),
    resistance: new fields.ObjectField({}),
    vulnerability: new fields.ObjectField({}),
    immunity: new fields.ArrayField(new fields.StringField({})),
    persistent_damage: new fields.ObjectField({}),
    other_profs: new fields.ObjectField({}),
    biography: new fields.HTMLField({initial: 0}),
    sense: new fields.ObjectField({}),
    size: new fields.AnyField({initial: 0}),
    types: new fields.ObjectField({}),
    adv: new fields.StringField({initial: "norm"}),
            money: new fields.SchemaField({
                pp: new fields.NumberField({initial: 0}),
                gp: new fields.NumberField({initial: 0}),
                sp: new fields.NumberField({initial: 0}),
                cp: new fields.NumberField({initial: 0})}),
    level: new fields.NumberField({initial: 1}),
    save_mod: new fields.NumberField({initial: 0}),
    skill_mod: new fields.NumberField({initial: 0}),
    action_mod: new fields.NumberField({initial: 0}),
    attack_mod: new fields.NumberField({initial: 0}),
    dc_mod: new fields.NumberField({initial: 0}),
    hp_mod: new fields.NumberField({initial: 0}),
    weakness: new fields.StringField({initial: "None"}),
    threshold: new fields.NumberField({initial: 0}),
    role:  new fields.StringField({initial: "Bruiser"}),
    type1: new fields.StringField({initial: "None"}),
    type2: new fields.StringField({initial: "None"}),
    type3: new fields.StringField({initial: "None"}),
    type4: new fields.StringField({initial: "None"}),
    VRI: new fields.ObjectField({})
        }
    }
}