const db = require("../db/queries");

async function getAllPokemon(req, res) {
    const pokemon = await db.getAllPokemon();
    // formatting query results begin
    pokemon.forEach((target) => {
        target.name = target.name.charAt(0).toUpperCase() + target.name.slice(1);
        target.pokedex_number = target.pokedex_number.toString().padStart(4, '0');
    })
    // formatting query results end
    res.render("index", { title: "My RAW-ketplace", pokemon: pokemon, links: req.links });
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
    const target = await db.viewPokemonDetails(req.params.id);
    // formatting query results begin
    target.name = target.name.charAt(0).toUpperCase() + target.name.slice(1);
    // formatting query results end
    res.render("details", { title: "View Pok&#233mon details", pokemon: target, links: req.links });
}

async function deletePokemon(req, res) {
    await db.deletePokemon(req.params.id);
    res.redirect("/");
}

async function searchPokemonPost(req, res) {
    let query = req.body.query;
    let results;
    // check if query is an integer or a string
    if (isNaN(query)) {
        // if query is a string, cast to lowercase to normalize results
        query = query.toLowerCase();
        if (query === 'common' | query === 'legendary' | query === 'mythical') {
            results = await db.searchPokemonRarity(query); 
        } else {
            results = await db.searchPokemonString(query);
        }
    // if query is an integer, compare to integer columns
    } else {
        results = await db.searchPokemonInt(query);
    }
    // add result ids into url for redirect
    let url = "";
    for (let i = 0; i < results.length; i++) {
        url === "" ? url = `?id=${results[i].id}` : url = url + `&id=${results[i].id}`;
    }
    res.redirect(`search${url}`);
}

async function searchPokemonGet(req, res) {
    let queriesArray = req.query.id;
    // wrap in array for array comparison in query
    if (queriesArray.length < 2) { queriesArray = [queriesArray] };
    let results = await db.getPokemonById(queriesArray);
    // formatting query results begin
    results.forEach((pokemon) => {
        pokemon.name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        pokemon.pokedex_number = pokemon.pokedex_number.toString().padStart(4, '0');
    })
    // formatting query results end
    res.render("search", { title: "Search results", results: results, links: req.links });
}

module.exports = {
    getAllPokemon,
    createPokemonGet,
    createPokemonPost,
    viewPokemon,
    deletePokemon,
    searchPokemonPost,
    searchPokemonGet,
}