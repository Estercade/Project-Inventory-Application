const db = require("../db/queries");
const imageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

async function getAllPokemon(req, res) {
    const pokemon = await db.getAllPokemon();
    // formatting query results begin
    pokemon.forEach((target) => {
        target.image = `${imageUrl}` + (!target.shiny ? "" : "shiny/") + `${target.pokedex_number}.png`;
        target.name = target.name.charAt(0).toUpperCase() + target.name.slice(1);
        target.price = `$${target.price}`;
        target.pokedex_number = `#${target.pokedex_number.toString().padStart(4, '0')}`;
    })
    // formatting query results end
    res.render("index", { title: "RAWKETPLACE", pokemon: pokemon, links: req.links });
}

async function createPokemonGet(req, res) {
    res.render("form", { title: "Add new item", links: req.links });
}

async function createPokemonPost(req, res) {
    const { generation, pokedex_number, type1, type2, rarity, price } = req.body;
    const shiny = !!req.body.shiny;
    const name = req.body.name.toLowerCase();
    await db.insertPokemon(name, generation, pokedex_number, type1, type2, rarity, shiny, price);
    res.redirect("/");
}

async function viewPokemon(req, res) {
    const target = await db.getPokemonDetailsForView(req.params.id);
    // formatting query results begin
    if (target) {
        target.image = `${imageUrl}` + (!target.shiny ? "" : "shiny/") + `${target.pokedex_number}.png`;
        target.name = target.name.charAt(0).toUpperCase() + target.name.slice(1);
        target.rarity = target.rarity.charAt(0).toUpperCase() + target.rarity.slice(1);
        target.price = `$${target.price}`;
        target.pokedex_number = `#${target.pokedex_number.toString().padStart(4, '0')}`;
    }
    // formatting query results end
    res.render("view", { title: "View item details", pokemon: target, links: req.links });
}

async function editPokemonGet(req, res) {
    const target = await db.getPokemonDetailsForEdit(req.params.id);
    // formatting query results begin
    if (target) { target.name = target.name.charAt(0).toUpperCase() + target.name.slice(1) };
    // formatting query results end
    res.render("edit", { title: "Edit item", pokemon: target, links: req.links });
}

async function editPokemonPost(req, res){
    const id = req.params.id;
    const { generation, pokedex_number, type1, type2, rarity, price } = req.body;
    const shiny = !!req.body.shiny;
    const name = req.body.name.toLowerCase();
    await db.updatePokemon(name, generation, pokedex_number, type1, type2, rarity, shiny, price, id);
    res.redirect("/");
}

async function deletePokemon(req, res) {
    await db.deletePokemon(req.params.id);
    res.redirect("/");
}

async function searchPokemonPost(req, res) {
    let query = req.body.query;
    res.redirect(`search/${query}`);
}

async function searchPokemonGet(req, res) {
    let query = req.params.query;
    let results = await db.searchPokemon(query);
    if (results) {
        // formatting query results begin
        results.forEach((target) => {
            target.image = `${imageUrl}` + (!target.shiny ? "" : "shiny/") + `${target.pokedex_number}.png`;
            target.name = target.name.charAt(0).toUpperCase() + target.name.slice(1);
            target.rarity = target.rarity.charAt(0).toUpperCase() + target.rarity.slice(1);
            target.price = `$${target.price}`;
            target.pokedex_number = `#${target.pokedex_number.toString().padStart(4, '0')}`;
        // formatting query results end
        })
    }
    res.render("search", { title: "Search results", results: results, links: req.links });
}

async function filterPokemonPost(req, res) {
    let query = '';
    function checkIsEmpty(str) {
        if (str !== '') {
            query = str.concat('&');
        }
    }

    if (req.body.generation) {
        checkIsEmpty(query);
        query += (`generation=${req.body.generation}`);
    }
    if (req.body.type) {
        checkIsEmpty(query);
        query += (`type=${req.body.type}`);
    }
    if (req.body.rarity) {
        checkIsEmpty(query);
        query += (`rarity=${req.body.rarity}`);
    }
    if (req.body.shiny) {
        checkIsEmpty(query);
        query += (`shiny=${req.body.shiny}`);
    }
    if (req.body.minimum) {
        checkIsEmpty(query);
        query += (`minimum=${req.body.minimum}`);
    }
    if (req.body.maximum) {
        checkIsEmpty(query);
        query += (`maximum=${req.body.maximum}`);
    }
    if (req.body.sortby) {
        checkIsEmpty(query);
        query += (`sortby=${req.body.sortby}`);
    }
    if (query === '') {
        res.redirect("/");
    } else {
        res.redirect(`filter/${query}`);
    }
}

async function filterPokemonGet(req, res) {
    query = req.params.query.split("&");
    let results = await db.filterPokemon(query);
    if (results) {
        // formatting query results begin
        results.forEach((target) => {
            target.image = `${imageUrl}` + (!target.shiny ? "" : "shiny/") + `${target.pokedex_number}.png`;
            target.name = target.name.charAt(0).toUpperCase() + target.name.slice(1);
            target.rarity = target.rarity.charAt(0).toUpperCase() + target.rarity.slice(1);
            target.price = `$${target.price}`;
            target.pokedex_number = `#${target.pokedex_number.toString().padStart(4, '0')}`;
        // formatting query results end
        })
    }
    res.render("filter", { title: "RAWKETPLACE", results: results, links: req.links });
}

async function notFound(err, req, res, next) {
    res.status(404);
    res.render("404", { title: "Oops!", links: req.links });
}

module.exports = {
    getAllPokemon,
    createPokemonGet,
    createPokemonPost,
    viewPokemon,
    editPokemonGet,
    editPokemonPost,
    deletePokemon,
    searchPokemonPost,
    searchPokemonGet,
    filterPokemonPost,
    filterPokemonGet,
    notFound,
}