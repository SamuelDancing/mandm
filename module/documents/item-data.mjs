//Define and export the Item Data for an Affliction.

export class ItemData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            weight: new fields.NumberField({initial: 0}),
            size: new fields.StringField({initial:"Miniscule"}),
            value: new fields.NumberField({initial: 0}),
            complexity: new fields.NumberField({initial: 0}),
            material: new fields.StringField({initial:"None"}),
            equipped: new fields.BooleanField({initial:false}),
            quantity: new fields.NumberField({initial: 1}),
            description: new fields.HTMLField({initial:""}),
            special: new fields.StringField({initial:""}),
            t_main: new fields.StringField({initial:"Edge"}),
            trait: new fields.ObjectField({initial: {}}),
            actions: new fields.NumberField({initial: 0}),
            duration: new fields.StringField({initial:"None"}),
            damage: new fields.ObjectField({initial: {
                0: new fields.StringField({initial:"0"})
                }
            }),
            crit: new fields.ObjectField({initial: {
                0: new fields.StringField({initial:"0"})
                }
            }),
            roll: new fields.StringField({initial:""}),
            active: new fields.BooleanField({initial:false}),
            target: new fields.StringField({initial:""}),
            trigger: new fields.StringField({initial:""}),
            range: new fields.StringField({initial:""}),
            resource_cost: new fields.StringField({initial:""}),
            save_target: new fields.StringField({initial:"Strength"}),
            save_source: new fields.StringField({initial:"@actor.ssdc"}),
            force_display: new fields.BooleanField({initial:false}),
            roll_desc: new fields.StringField({initial:""}),
            custom_dc: new fields.StringField({initial:""}),
            roll_mod: new fields.StringField({initial:""})
        }
    }
}

//Define the Other Data Models separately because it's a lot simpler for this dev.

export class ClassData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            asi1: new fields.StringField({initial:"Strength"}),
            asi2: new fields.StringField({initial:"None"}),
            hit_die: new fields.StringField({initial:"4"}),
            skills: new fields.StringField({initial:""}),
            save1: new fields.StringField({initial:"Strength"}),
            save2: new fields.StringField({initial:"None"}),
            prof_options: new fields.StringField({initial:""}),
            armor_profs: new fields.StringField({initial:""}),
            weapon_profs: new fields.StringField({initial:""}),
            archetype_requirement: new fields.StringField({initial:""}),
            resource_name: new fields.StringField({initial:""}),
            both_scores: new fields.BooleanField({initial:false}),
            cam1: new fields.StringField({initial:"Strength"}),
            cam2: new fields.StringField({initial:"None"}),
            roll: new fields.StringField({initial:""}),
            description: new fields.StringField({initial:""}),
            special: new fields.StringField({initial:""})
        }
    }
}

export class AncestryData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            asi: new fields.StringField({initial:"+2 ???, +2 Pick"}),
            base_hp: new fields.StringField({initial:"4"}),
            speed: new fields.NumberField({initial: 30}),
            size: new fields.StringField({initial:"Medium"}),
            type1: new fields.StringField({initial:"Humanoid"}),
            type2: new fields.StringField({initial:"None"}),
            type3: new fields.StringField({initial:"None"}),
            languages: new fields.StringField({initial:""}),
            roll: new fields.StringField({initial:""}),
            description: new fields.StringField({initial:""}),
            special: new fields.StringField({initial:""})
        }
    }
}

export class BackgroundData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            asi: new fields.StringField({initial:"Strength"}),
            asi_second: new fields.StringField({initial:"Dexterity"}),
            equipment: new fields.StringField({initial:""}),
            profs: new fields.StringField({initial:""}),
            feat: new fields.StringField({initial:""}),
            roll: new fields.StringField({initial:""}),
            description: new fields.StringField({initial:""}),
            special: new fields.StringField({initial:""})
        }
    }
}

export class SpellData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            lists: new fields.SchemaField({
                arcane: new fields.BooleanField({initial:false}),
                divine: new fields.BooleanField({initial:false}),
                occult: new fields.BooleanField({initial:false}),
                primal: new fields.BooleanField({initial:false})
            }),
            school: new fields.StringField({initial:"Abjuration"}),
            tier: new fields.StringField({initial:"Cantrip"}),
            components: new fields.SchemaField({
              v: new fields.BooleanField({initial:false}),
              s: new fields.BooleanField({initial:false}),
              m: new fields.BooleanField({initial:false}),
              material: new fields.StringField({initial:""}),
              f: new fields.BooleanField({initial:false}),
              c: new fields.BooleanField({initial:false})
            }),
            prepared: new fields.StringField({initial:"No"}),
            description: new fields.StringField({initial:""}),
            special: new fields.StringField({initial:""}),
            t_main: new fields.StringField({initial:"Edge"}),
            trait: new fields.ObjectField({initial: {}}),
            actions: new fields.NumberField({initial: 0}),
            duration: new fields.StringField({initial:"None"}),
            damage: new fields.ObjectField({initial: {
                0: new fields.StringField({initial:"0"})
                }
            }),
            crit: new fields.ObjectField({initial: {
                0: new fields.StringField({initial:"0"})
                }
            }),
            roll: new fields.StringField({initial:" "}),
            active: new fields.BooleanField({initial:false}),
            target: new fields.StringField({initial:""}),
            trigger: new fields.StringField({initial:""}),
            range: new fields.StringField({initial:""}),
            resource_cost: new fields.StringField({initial:""}),
            save_target: new fields.StringField({initial:"Strength"}),
            save_source: new fields.StringField({initial:"@actor.ssdc"}),
            force_display: new fields.BooleanField({initial:false}),
            roll_desc: new fields.StringField({initial:""}),
            custom_dc: new fields.StringField({initial:"10"}),
            roll_mod: new fields.StringField({initial:""})
        }
    }
}

export class FeatData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
        source: new fields.StringField({initial:"misc"}),
        restriction: new fields.StringField({initial:""}),
        prerequisite: new fields.StringField({initial:""}),
        description: new fields.StringField({initial:""}),
        special: new fields.StringField({initial:""}),
        t_main: new fields.StringField({initial:"Edge"}),
        trait: new fields.ObjectField({initial: {}}),
        actions: new fields.NumberField({initial: 0}),
        duration: new fields.StringField({initial:"None"}),
        damage: new fields.ObjectField({initial: {
                0: new fields.StringField({initial:"0"})
                }
            }),
        crit: new fields.ObjectField({initial: {
                0: new fields.StringField({initial:"0"})
                }
            }),
        roll: new fields.StringField({initial:" "}),
        active: new fields.BooleanField({initial:false}),
        target: new fields.StringField({initial:""}),
        trigger: new fields.StringField({initial:""}),
        range: new fields.StringField({initial:""}),
        resource_cost: new fields.StringField({initial:""}),
        save_target: new fields.StringField({initial:"Strength"}),
        save_source: new fields.StringField({initial:"@actor.ssdc"}),
        force_display: new fields.BooleanField({initial:false}),
        roll_desc: new fields.StringField({initial:""}),
        custom_dc: new fields.StringField({initial:"10"}),
        roll_mod: new fields.StringField({initial:""})
        }
    }
}

export class AfflictionData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            source: new fields.StringField({initial:""}),
            dc: new fields.NumberField({initial: 0}),
            roll: new fields.StringField({initial:""}),
            description: new fields.StringField({initial:""}),
            special: new fields.StringField({initial:""}),
            t_main: new fields.StringField({initial:"Edge"}),
            trait: new fields.ObjectField({initial: {}})
        }
    }
}