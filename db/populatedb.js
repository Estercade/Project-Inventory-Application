const { Client } = require("pg");
const client = new Client({
    connectionString: process.env.connectionString
});

const typeSQL = `
CREATE TABLE IF NOT EXISTS types (
    id INTEGER,
    type VARCHAR ( 255 ),
    PRIMARY KEY(id)
);

INSERT INTO types (id, type)
VALUES 
    (0, ''),
    (1, 'normal'),
    (2, 'fighting'),
    (3, 'flying'),
    (4, 'poison'),
    (5, 'ground'),
    (6, 'rock'),
    (7, 'bug'),
    (8, 'ghost'),
    (9, 'steel'),
    (10, 'fire'),
    (11, 'water'),
    (12, 'grass'),
    (13, 'electric'),
    (14, 'psychic'),
    (15, 'ice'),
    (16, 'dragon'),
    (17, 'dark'),
    (18, 'fairy'),
    (19, 'stellar'),
    (20, 'unknown')
;`

const pokeSQL = `
CREATE TABLE IF NOT EXISTS pokemon (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ),
    generation INTEGER,
    pokedex_number INTEGER,
    type1 INTEGER,
    type2 INTEGER,
    rarity VARCHAR ( 255 ),
    shiny BOOLEAN,
    price INTEGER,
    CONSTRAINT fk_type1
        FOREIGN KEY (type1)
        REFERENCES types (id),
    CONSTRAINT fk_type2
        FOREIGN KEY (type2)
        REFERENCES types (id)
);

INSERT INTO pokemon (name, generation, pokedex_number, type1, type2, rarity, shiny, price)
VALUES 
    ('bulbasaur', 1, 1, 12, 4, 'common', false, '2'),
    ('charizard', 1, 6, 10, 3, 'common', false, '60'),
    ('mew', 1, 151, 14, 0, 'mythical', false, '700'),
    ('wooper', 2, 194, 11, 5, 'common', true, '300'),
    ('groudon', 3, 383, 5, 0, 'legendary', false, '500')
;`


async function main() {
    console.log("seeding...");
    await client.connect();
    try {
        await client.query(typeSQL);
        await client.query(pokeSQL);
    } catch (err) {
        console.log(err);
    } finally {
        await client.end();
        console.log("done");
    }
}

main();