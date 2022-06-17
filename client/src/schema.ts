import Dexie from 'dexie';

export function createStore(db: Dexie) {
    // db.version(2).stores({
    //     friends: "++id, [firstName+lastName], yearOfBirth, *tags", // Change indexes
    //     gameSessions: null // Delete table
    // }).upgrade(tx => {
    //     // Will only be executed if a version below 2 was installed.
    //     return tx.table("friends").modify(friend => {
    //         friend.firstName = friend.name.split(' ')[0];
    //         friend.lastName = friend.name.split(' ')[1];
    //         friend.birthDate = new Date(new Date().getFullYear() - friend.age, 0);
    //         delete friend.name;
    //         delete friend.age;
    //     });
    // });

    db.version(1).stores({
        playlists: "&original_url, title, *tokens",
        entries: "&[id+ie_key], original_url, title, *tokens",
        watched: "&[id+ie_key]",
    });

    return db
}
