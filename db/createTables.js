import {getDBConnection} from "./db.js"


async function createTable(){
    const db = await getDBConnection()

    await db.exec(`
        CREATE TABLE IF NOT EXISTS ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ingredient TEXT NOT NULL,
        harmful BOOLEAN,
        rating TEXT NOT NULL,
        description TEXT NOT NULL
        )`)

    // await db.exec(`DROP TABLE IF EXISTS ingredients`)
    // db.close()
    // console.log("Table has been created")



}


await createTable();
