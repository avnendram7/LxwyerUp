const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');

async function start() {
    // Ensure data directory exists
    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
    }

    const mongod = await MongoMemoryServer.create({
        instance: {
            port: 27017,
            // Persist data to local directory
            dbPath: process.cwd() + '/data',
            storageEngine: 'wiredTiger'
        }
    });

    const uri = mongod.getUri();
    console.log(`MongoDB started on ${uri}`);
    console.log('MongoDB is ready for connections on port 27017');

    // Keep the process alive
    process.on('SIGINT', async () => {
        await mongod.stop();
        process.exit(0);
    });
}

start().catch(err => {
    console.error(err);
    process.exit(1);
});
