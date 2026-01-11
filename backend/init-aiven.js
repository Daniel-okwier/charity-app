const { initDb } = require('./db/schema'); 
const { pool } = require('./db/dbConfig');

async function runInit() {
    try {
        console.log("Initializing Aiven Database...");
        await initDb();
        console.log("Aiven Database is ready for production!");
        process.exit(0);
    } catch (err) {
        console.error("Initialization failed:", err);
        process.exit(1);
    }
}

runInit();