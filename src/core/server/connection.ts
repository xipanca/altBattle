import * as alt from 'alt-server';
import Database from './db';

interface PlayerData {
    uuid: string;
    socialID: string;
    hwidExHash: string;
    hwidHash: string;
    name: string;
    slaughter: number;
    deaths: number;
    team: string;
    points: number;
    vip: boolean;
}

async function handlePlayerConnect(player: alt.Player): Promise<void> {
    console.time('getUser');
    const playerData = await Database.fetchData<PlayerData>('uuid', player.discordID, 'User');
    console.timeEnd('getUser');
    if (!playerData) {
        await createNewUser(player);
    } else {
        playerInit(player, playerData);
    }
}

alt.on('playerConnect', handlePlayerConnect);

async function createNewUser(player: alt.Player): Promise<void> {
    const newPlayerData: PlayerData = {
        uuid: player.discordID,
        socialID: player.socialID,
        hwidExHash: player.hwidExHash,
        hwidHash: player.hwidHash,
        name: player.name,
        points: 0,
        slaughter: 0,
        deaths: 0,
        team: 'none',
        vip: false,
    };

    const playerData = await Database.insertData(newPlayerData, 'User', true);
    if (!playerData) {
        alt.logError('Failed to create new user.');
        return;
    }
    playerInit(player, playerData);
}

function playerInit(player: alt.Player, playerData: PlayerData): void {
    player.setSyncedMeta('playerData', playerData);
    console.log(player.getSyncedMeta('playerData'));
    alt.emitClient(player, 'playerInit', playerData);
}
