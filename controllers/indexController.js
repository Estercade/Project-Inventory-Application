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
    const target = await db.getPokemonDetails(req.params.id);
    // formatting query results begin
    if (target) {
        target.name = target.name.charAt(0).toUpperCase() + target.name.slice(1);
    }
    // formatting query results end
    res.render("details", { title: "View item details", pokemon: target, links: req.links });
}

async function editPokemonGet(req, res) {
    const target = await db.getPokemonDetails(req.params.id);
    // formatting query results begin
    if (target) { target.name = target.name.charAt(0).toUpperCase() + target.name.slice(1) };
    // formatting query results end
    res.render("edit", { title: "Edit item", pokemon: target, links: req.links });
}

async function editPokemonPost(req, res){
    const { generation, pokedex_number, type1, type2, rarity, price } = req.body;
    const shiny = !!req.body.shiny;
    const name = req.body.name.toLowerCase();
    await db.updatePokemon(name, generation, pokedex_number, type1, type2, rarity, shiny, price);
    res.redirect("/");
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
    let results;
    if (queriesArray) {
        // wrap in array for array comparison in query if only one item
        if (queriesArray.length === 1) { queriesArray = [queriesArray] };
        results = await db.getPokemonById(queriesArray);
        // formatting query results begin
        results.forEach((pokemon) => {
            pokemon.name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            pokemon.pokedex_number = pokemon.pokedex_number.toString().padStart(4, '0');
        // formatting query results end
        })
    }
    res.render("search", { title: "Search results", results: results, links: req.links });
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
    notFound,
}