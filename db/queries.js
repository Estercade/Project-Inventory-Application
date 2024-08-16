const pool = require("./pool");

async function getAllPokemon() {
    const { rows } = await pool.query("SELECT pokemon.id, pokemon.name, pokemon.pokedex_number, t1.type AS type1, t2.type AS type2, price FROM pokemon JOIN types t1 ON pokemon.type1 = t1.id JOIN types t2 ON pokemon.type2 = t2.id");
    return rows;
}

async function getPokemonById(query) {
    const { rows } = await pool.query("SELECT pokemon.id, pokemon.name, pokemon.pokedex_number, t1.type AS type1, t2.type AS type2, price FROM pokemon JOIN types t1 ON pokemon.type1 = t1.id JOIN types t2 ON pokemon.type2 = t2.id WHERE pokemon.id = ANY ($1)", [query]);
    return rows;
}

async function insertPokemon(name, generation, pokedex_number, type1, type2, rarity, shiny, price) {
    await pool.query("INSERT INTO pokemon (name, generation, pokedex_number, type1, type2, rarity, shiny, price) VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8))", [name, generation, pokedex_number, type1, type2, rarity, shiny, price]);
}

async function viewPokemonDetails(id) {
    const { rows } = await pool.query("SELECT pokemon.id, pokemon.name, pokemon.generation, pokemon.pokedex_number, t1.type AS type1, t2.type AS type2, pokemon.rarity, pokemon.price FROM pokemon JOIN types t1 ON pokemon.type1 = t1.id JOIN types t2 ON pokemon.type2 = t2.id WHERE pokemon.id = ($1)", [id]);
    return rows[0];
}

async function deletePokemon(id) {
    await pool.query("DELETE FROM pokemon WHERE id = ($1)", [id]);
}

async function searchPokemonString(query) {
    query = `%${query}%`;
    const { rows } = await pool.query("SELECT pokemon.id FROM pokemon JOIN types t1 ON pokemon.type1 = t1.id JOIN types t2 ON pokemon.type2 = t2.id WHERE (pokemon.name LIKE ($1)) OR (t1.type LIKE ($1)) OR (t2.type LIKE ($1)) OR (pokemon.rarity LIKE ($1))", [query]);
    return rows;
}

async function searchPokemonInt(query) {
    const { rows } = await pool.query("SELECT pokemon.id FROM pokemon WHERE pokemon.pokedex_number = ($1)", [query]);
    return rows;
}

async function searchPokemonRarity(query) {
    const { rows } = await pool.query("SELECT pokemon.id FROM pokemon WHERE pokemon.rarity = ($1)", [query]);
    return rows;
}

module.exports = {
    getAllPokemon,
    getPokemonById,
    insertPokemon,
    viewPokemonDetails,
    deletePokemon,
    searchPokemonString,
    searchPokemonInt,
    searchPokemonRarity
}