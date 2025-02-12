export const terminalCommands = [
    {
        command: 'git status',
        output: 'On branch main\nChanges to be committed:\n  (use "git restore --staged <file>..." to unstage)\n        modified:   .github/workflows/deploy-all.yml\n        modified:   infrastructure/main.tf\n        modified:   README.md',
        delay: 800
    },
    {
        command: 'git add .',
        output: '',
        delay: 500
    },
    {
        command: 'git commit -m "added: gitHub actions workflow for aws and appstore deployments"',
        output: '[main 8e7d23f] added: gitHub actions workflow for aws deployments\n 3 files changed, 89 insertions(+), 12 deletions(-)',
        delay: 1000
    },
    {
        command: 'git push origin main',
        output: 'Enumerating objects: 9, done.\nCounting objects: 100% (9/9), done.\nDelta compression using up to 10 threads\nCompressing objects: 100% (5/5), done.\nWriting objects: 100% (5/5), 1.52 KiB | 1.52 MiB/s, done.\nTotal 5 (delta 3), reused 0 (delta 0), pack-reused 0\nTo github.com:username/project.git\n   e3d9076..8e7d23f  main -> main',
        delay: 2000
    }
];
