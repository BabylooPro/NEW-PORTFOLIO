export const terminalCommands = [
    {
        command: 'dotnet clean',
        output: 'Build started.\n     1>Project "UserManagement.sln" on node 1 (Clean target(s)).\n     1>ValidateSolutionConfiguration:\n         Building solution configuration "Debug|Any CPU".\n     1>Done Building Project "UserManagement.sln" (Clean target(s)).\n\nBuild succeeded.\n    0 Warning(s)\n    0 Error(s)\n\nTime Elapsed 00:00:00.48',
        delay: 800
    },
    {
        command: 'dotnet build',
        output: 'Build started...\nBuild succeeded.\n    0 Warning(s)\n    0 Error(s)',
        delay: 1000
    },
    {
        command: 'dotnet test',
        output: 'Starting test execution...\nPassed!  - Failed:     0, Passed:     2, Skipped:     0, Total:     2\nTest Run Successful.',
        delay: 2000
    },
    {
        command: 'dotnet run',
        output: 'info: Microsoft.Hosting.Lifetime[14]\n      Now listening on: http://localhost:5000\ninfo: Microsoft.Hosting.Lifetime[0]\n      Application started. Press Ctrl+C to shut down.',
        delay: 1500
    }
];
