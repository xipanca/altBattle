import Database from '@stuyk/ezmongodb';

const [url, dbName, collections] = ['mongodb://localhost:27017', 'AltBattle', ['User']];

const connect = async () => {
    const connected = await Database.init(url, dbName, collections);
    if (!connected) {
        throw new Error(`Erro ao tentar se conectar ao banco de dados: ${dbName}`);
    }
};
connect();

export default Database;
