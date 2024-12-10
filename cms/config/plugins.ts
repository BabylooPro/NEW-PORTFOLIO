export default ({ env }) => ({
  upload: {
    config: {
      sizeLimit: 250 * 1024 * 1024, // 250MB IN BYTES
      providerOptions: {
        maxBodyLength: 250 * 1024 * 1024,
      },
    },
  },
});
