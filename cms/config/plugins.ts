export default ({ env }) => ({
    upload: {
        config: {
            sizeLimit: 2 * 1024 * 1024 * 1024, // 2GB IN BYTES
            providerOptions: {
                maxBodyLength: 2 * 1024 * 1024 * 1024, // 2GB IN BYTES
            },
        },
    },
});
