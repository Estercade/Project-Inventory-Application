const pool = require("./pool");

async function getAllPokemon() {
    const { rows } = await pool.query("SELECT pokemon.id, pokemon.name, pokemon.pokedex_number, t1.type AS type1, t2.type AS type2, shiny, price FROM pokemon JOIN types t1 ON pokemon.type1 = t1.id JOIN types t2 ON pokemon.type2 = t2.id");
    return rows;
}

async function getPokemonById(query) {
    const { rows } = await pool.query("SELECT pokemon.id, pokemon.name, pokemon.pokedex_number, t1.type AS type1, t2.type AS type2, price FROM pokemon JOIN types t1 ON pokemon.type1 = t1.id JOIN types t2 ON pokemon.type2 = t2.id WHERE pokemon.id = ANY ($1)", [query]);
    return rows;
}

async function insertPokemon(name, generation, pokedex_number, type1, type2, rarity, shiny, price) {
    await pool.query("INSERT INTO pokemon (name, generation, pokedex_number, type1, type2, rarity, shiny, price) VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8))", [name, generation, pokedex_number, type1, type2, rarity, shiny, price]);
}

async function updatePokemon(name, generation, pokedex_number, type1, type2, rarity, shiny, price, id) {
    await pool.query("UPDATE pokemon SET (name, generation, pokedex_number, type1, type2, rarity, shiny, price) = (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8)) WHERE id = ($9)", [name, generation, pokedex_number, type1, type2, rarity, shiny, price, id]);
}

async function getPokemonDetailsForEdit(id) {
    const { rows } = await pool.query("SELECT * FROM pokemon WHERE pokemon.id = ($1)", [id]);
    return rows[0];
}

async function getPokemonDetailsForView(id) {
    const { rows } = await pool.query("SELECT pokemon.id, pokemon.name, pokemon.generation, pokemon.pokedex_number, t1.type AS type1, t2.type AS type2, pokemon.rarity, pokemon.shiny, pokemon.price FROM pokemon JOIN types t1 ON pokemon.type1 = t1.id JOIN types t2 ON pokemon.type2 = t2.id WHERE pokemon.id = ($1)", [id]);
    return rows[0];
}

async function deletePokemon(id) {
    await pool.query("DELETE FROM pokemon WHERE id = ($1)", [id]);
}

async function searchPokemon(query) {
    let results;
    // check if query is an integer or a string
    if (isNaN(query)) {
        // if query is a string, cast to lowercase to normalize results
        query = query.toLowerCase();
        if (query === 'common' | query === 'legendary' | query === 'mythical') {
            results = await searchPokemonRarity(query); 
        } else {
            results = await searchPokemonString(query);
        }
    // if query is an integer, compare to integer columns
    } else {
        results = await searchPokemonInt(query);
    }
    return results;
}

async function searchPokemonString(query) {
    query = query.trim();
    let splitString = query.split(" ");
    if (splitString.length > 1) {
        let dbRequest = "SELECT pokemon.id, pokemon.name, pokemon.generation, pokemon.pokedex_number, t1.type AS type1, t2.type AS type2, pokemon.rarity, pokemon.shiny, pokemon.price FROM pokemon JOIN types t1 ON pokemon.type1 = t1.id JOIN types t2 ON pokemon.type2 = t2.id WHERE";
        for (let i = 0; i < splitString.length; i++) {
            splitString[i] = `%${splitString[i]}%`;
            if (i === 0) {
                dbRequest += ` (pokemon.name LIKE ($${i + 1})) OR (t1.type LIKE ($${i + 1})) OR (t2.type LIKE ($${i + 1}))`;
            } else {
                dbRequest += ` AND (pokemon.name LIKE ($${i + 1})) OR (t1.type LIKE ($${i + 1})) OR (t2.type LIKE ($${i + 1}))`;
            }
        }
        const { rows } = await pool.query(dbRequest, splitString);
        return rows;
    } else {
        query = `%${query}%`;
        const { rows } = await pool.query("SELECT pokemon.id, pokemon.name, pokemon.generation, pokemon.pokedex_number, t1.type AS type1, t2.type AS type2, pokemon.rarity, pokemon.shiny, pokemon.price FROM pokemon JOIN types t1 ON pokemon.type1 = t1.id JOIN types t2 ON pokemon.type2 = t2.id WHERE (pokemon.name LIKE ($1)) OR (t1.type LIKE ($1)) OR (t2.type LIKE ($1))", [query]);
        return rows;
    }
}

async function searchPokemonInt(query) {
    const { rows } = await pool.query("SELECT pokemon.id, pokemon.name, pokemon.generation, pokemon.pokedex_number, t1.type AS type1, t2.type AS type2, pokemon.rarity, pokemon.shiny, pokemon.price FROM pokemon JOIN types t1 ON pokemon.type1 = t1.id JOIN types t2 ON pokemon.type2 = t2.id WHERE pokemon.pokedex_number = ($1)", [query]);
    return rows;
}

async function searchPokemonRarity(query) {
    const { rows } = await pool.query("SELECT pokemon.id, pokemon.name, pokemon.generation, pokemon.pokedex_number, t1.type AS type1, t2.type AS type2, pokemon.rarity, pokemon.shiny, pokemon.price FROM pokemon JOIN types t1 ON pokemon.type1 = t1.id JOIN types t2 ON pokemon.type2 = t2.id WHERE pokemon.rarity = ($1)", [query]);
    return rows;
}

async function filterPokemon(query) {
    // initialize counter for PG to replace variables in db query
    let counter = 1;
    // initialize array for query values
    let dbQueryArray = [];
    // initialize query string
    let dbRequest = "SELECT pokemon.id, pokemon.name, pokemon.generation, pokemon.pokedex_number, t1.type AS type1, t2.type AS type2, pokemon.rarity, pokemon.shiny, pokemon.price FROM pokemon JOIN types t1 ON pokemon.type1 = t1.id JOIN types t2 ON pokemon.type2 = t2.id";
    // iterate through query obtained from filter form via POST
    for (let i = 0; i < query.length; i++) {
        // check if order by string (cannot be preceded by WHERE or AND)
        if (query[i].startsWith('sortby')) {
            let sortby = query[i].slice(7).replace("-", " ");
            dbRequest += ` ORDER BY ${sortby}`;
            continue;
        }
        if (counter === 1) {
            dbRequest += " WHERE (";
        } else {
            dbRequest += ") AND (";
        }
        if (query[i].startsWith('type')) {
            let subStringArray = query[i].slice(5).split(",");
            for (let i = 0; i < subStringArray.length; i++) {
                if (i > 0) {
                    dbRequest += " OR ";
                }
                dbQueryArray.push(subStringArray[i]);
                dbRequest += `(t1.type = ($${counter}) OR t2.type = ($${counter}))`;
                counter += 1;
            }
        } else if (query[i].startsWith('generation')) {
            let subStringArray = query[i].slice(11).split(",");
            for (let i = 0; i < subStringArray.length; i++) {
                if (i > 0) {
                    dbRequest += " OR ";
                }
                dbQueryArray.push(Number(subStringArray[i]));
                dbRequest += `(pokemon.generation = ($${counter}))`;
                counter += 1;
            }
        } else if (query[i].startsWith('rarity')) {
            let subStringArray = query[i].slice(7).split(",");
            for (let i = 0; i < subStringArray.length; i++) {
                if (i > 0) {
                    dbRequest += " OR ";
                }
                dbQueryArray.push(subStringArray[i]);
                dbRequest += `pokemon.rarity = ($${counter})`;
                counter += 1;
            }
        } else if (query[i].startsWith('shiny')) {
            let subStringArray = query[i].slice(6).split(",");
            for (let i = 0; i < subStringArray.length; i++) {
                if (i > 0) {
                    dbRequest += " OR ";
                }
                dbQueryArray.push(subStringArray[i]);
                dbRequest += `pokemon.shiny = ($${counter})`;
                counter += 1;
            }
        } else if (query[i].startsWith('minimum')) {
            let min = query[i].slice(8);
            dbQueryArray.push(min);
            dbRequest += `pokemon.price >= ($${counter})`;
            counter += 1;
        } else if (query[i].startsWith('maximum')) {
            let max = query[i].slice(8);
            dbQueryArray.push(max);
            dbRequest += `pokemon.price <= ($${counter})`;
            counter += 1;
        }
    }
    dbRequest += ")";
    const { rows } = await pool.query(dbRequest, dbQueryArray);
    return rows;
}

module.exports = {
    getAllPokemon,
    getPokemonById,
    insertPokemon,
    updatePokemon,
    getPokemonDetailsForEdit,
    getPokemonDetailsForView,
    deletePokemon,
    searchPokemon,
    filterPokemon,
}