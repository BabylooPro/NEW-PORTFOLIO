import { ProjectData } from './types';

export const terminal: ProjectData = {
    file: 'Terminal',
    title: 'Terminal Skills',
    language: 'bash',
    snippet: '',
    preview: {
        type: 'terminal' as const,
        content: [
            {
                command: 'ls -la',
                output: 'total 32\ndrwxr-xr-x  12 user  group  384 Jan 1 12:00 .\ndrwxr-xr-x   5 user  group  160 Jan 1 12:00 ..',
                delay: 1000
            },
            {
                command: 'git status',
                output: 'On branch main\nYour branch is up to date with \'origin/main\'.\nnothing to commit, working tree clean',
                delay: 2000
            },
            {
                command: 'docker ps',
                output: 'CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES',
                delay: 1500
            }
        ]
    }
};
