export default ({ env }) => ({
    upload: {
        config: {
            provider: 'aws-s3',
            providerOptions: {
                accessKeyId: env('AWS_ACCESS_KEY_ID'),
                secretAccessKey: env('AWS_ACCESS_SECRET'),
                region: env('AWS_REGION'),
                params: {
                    ACL: env('AWS_ACL', 'public-read'),
                    signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 15 * 60),
                    Bucket: env('AWS_BUCKET'),
                },
                logger: {
                    debug: console.debug,
                    info: console.info,
                    warn: console.warn,
                    error: console.error,
                },
                throwIfCredentialsNotProvided: true,
            },
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
        },
    },
});
