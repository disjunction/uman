// export "uman" namespace globally
uman = {
    entity: {
        Group: require('entity/Group'),
        User: require('entity/User')
    },
    storage: {
        LocalUserStorage: require('storage/LocalUserStorage'),
        LocalGroupStorage: require('storage/LocalGroupStorage'),
        RemoteStorage: require('storage/RemoteStorage')
    }
};
