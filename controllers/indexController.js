const db = require("../db/queries");

async function getAllPokemon(req, res) {
    const pokemon = await db.getAllPokemon();  
    res.render("index", { title: "Pokemon", pokemon: pokemon });
}

async function createPokemonGet(req, res) {
    res.render("form", { title: "Add Pokemon" });
}

async function createPokemonPost(req, res) {
    const { name, generation, pokedex_number, type1, type2, rarity, price } = req.body;
    const shiny = !!req.body.shiny;
    db.insertPokemon(name, generation, pokedex_number, type1, type2, rarity, shiny, price);
    res.redirect("/");
}

async function viewPokemon(req, res) {
    const target = await db.viewPokemonDetails(req.params.id);
    res.render("details", { title: "View Pokemon details", pokemon: target });
}

module.exports = {
    getAllPokemon,
    createPokemonGet,
    createPokemonPost,
    viewPokemon
}