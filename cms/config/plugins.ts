export default ({ env }) => ({
    upload: {
        config: {
            provider: 'aws-s3',
            providerOptions: {
                s3Options: {
                    region: env('AWS_REGION'),
                    params: {
                        Bucket: env('AWS_BUCKET'),
                        ACL: env('AWS_ACL', 'public-read'),
                        signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 15 * 60),
                    },
                    credentials: {
                        accessKeyId: env('AWS_ACCESS_KEY_ID'),
                        secretAccessKey: env('AWS_ACCESS_SECRET'),
                    },
                },
                baseUrl: `https://${env('AWS_BUCKET')}.s3.${env('AWS_REGION')}.amazonaws.com`,
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
