export const terminalCommands = [
    {
        command: 'docker compose up mysql -d',
        output: 'Creating volume "blog_mysql_data" with default driver\n[+] Running 2/2\n ✔ Network blog_default      Created\n ✔ Container blog-mysql-1   Started',
        delay: 1500
    },
    {
        command: 'mysql -u root -p blog < schema.sql',
        output: 'Enter password: ****\nDatabase schema created successfully\nTables: posts, users, comments created',
        delay: 1500
    },
    {
        command: 'npm run test',
        output: '> frontend@0.1.0 test\n> dotenv --env-file .env.test -- jest --testPathPattern=\'^(?!.*integration).*$\'\n\n PASS  __tests__/app/api/blog/posts.test.ts\n PASS  __tests__/app/api/blog/likes.test.ts\n PASS  __tests__/app/blog/page.test.tsx\n\nTest Suites: 3 passed, 3 total\nTests:       12 passed, 12 total\nSnapshots:   0 total\nTime:        1.245s',
        delay: 2000
    },
    {
        command: 'npm run dev',
        output: '> frontend@0.1.0 dev\n> next dev --turbopack\n\n ⚠ Port 3000 is in use, trying 3001 instead.\n   ▲ Next.js 15.0.3 (Turbopack)\n   - Local:        http://localhost:3001\n   - Environments: .env\n\n ✓ Starting...\n ✓ Ready in 805ms',
        delay: 1800
    }
];
