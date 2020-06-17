'use strict';

const express = require('express');
const router = express.Router();

const defaultData = require('../data/default.js');
const subscriptions = require('../data/subscriptions.js');
const Quest = require('../models/quest.js');
const Invasion = require('../models/invasion.js');

router.post('/server/:guild_id/user/:user_id', async (req, res) => {
    const { guild_id, user_id } = req.params;
    const type = req.query.type;
    console.log('Path:', req.path);
    console.log('Query:', req.query);

    if (guild_id === null) {
        console.warn('[WARN] Guild ID is null.');
        return;
    }

    switch (type) {
        case 'subscriptions':
            const subscription = await subscriptions.getUserSubscriptionStats(guild_id, user_id);
            res.json({ data: { subscriptions: subscription } });
            break;
        case 'pokemon':
            const pokemon = await subscriptions.getPokemonSubscriptions(guild_id, user_id);
            if (pokemon) {
                pokemon.forEach(pkmn => {
                    pkmn.buttons = '<button class="btn btn-primary">Edit</button>&nbsp;<button class="btn btn-danger">Delete</button>';
                });
            }
            res.json({ data: { pokemon: pokemon } });
            break;
        case 'raids':
            const raids = await subscriptions.getRaidSubscriptions(guild_id, user_id);
            if (raids) {
                raids.forEach(raid => {
                    raid.buttons = '<button class="btn btn-primary">Edit</button>&nbsp;<button class="btn btn-danger">Delete</button>';
                });
            }
            res.json({ data: { raids: raids } });
            break;
        case 'quests':
            const quests = await subscriptions.getQuestSubscriptions(guild_id, user_id);
            if (quests) {
                quests.forEach(quest => {
                    quest.buttons = '<button class="btn btn-primary">Edit</button>&nbsp;<button class="btn btn-danger">Delete</button>';
                });
            }
            res.json({ data: { quests: quests } });
            break;
        case 'invasions':
            const invasions = await subscriptions.getInvasionSubscriptions(guild_id, user_id);
            if (invasions) {
                invasions.forEach(invasion => {
                    invasion.buttons = '<button class="btn btn-primary">Edit</button>&nbsp;<button class="btn btn-danger">Delete</button>';
                });
            }
            res.json({ data: { invasions: invasions } });
            break;
    }
});


// Pokemon routes
router.post('/pokemon/new', async (req, res) => {
    // TODO: Check if exists already, if so skip
    // TODO: If not, create then redirect
    res.redirect('/pokemon');
});


// Raid routes
router.post('/raids/new', async (req, res) => {
    const { guild_id, pokemon, city } = req.body;
    const user_id = defaultData.user_id;
    // TODO: Check if city is array
    const exists = await Raid.getByPokemon(guild_id, user_id, pokemon, city);
    if (exists) {
        // Already exists
    } else {
        const quest = new Raid(guild_id, user_id, reward, city);
        const result = await quest.create();
        if (result) {
            // Success
        }
    }
    res.redirect('/raids');
});


// Quest routes
router.post('/quests/new', async (req, res) => {
    const { guild_id, reward, city } = req.body;
    const user_id = defaultData.user_id;
    // TODO: Check if city is array
    const exists = await Quest.getByReward(guild_id, user_id, reward, city);
    if (exists) {
        // Already exists
    } else {
        const quest = new Quest(guild_id, user_id, reward, city);
        const result = await quest.create();
        if (result) {
            // Success
        }
    }
    res.redirect('/quests');
});

router.post('/quests/edit', async (req, res) => {
});

// Invasion routes
router.post('/invasions/new', async (req, res) => {
    const { guild_id, reward, city } = req.body;
    const user_id = defaultData.user_id;
    // TODO: Check if city is array
    const exists = await Invasion.getByReward(guild_id, user_id, reward, city);
    if (exists) {
        // Already exists
    } else {
        const invasion = new Invasion(guild_id, user_id, reward, city);
        const result = await invasion.create();
        if (result) {
            // Success
        }
    }
    res.redirect('/invasions');
});

module.exports = router;