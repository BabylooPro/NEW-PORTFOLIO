const commands = [
    {
        command: "dotnet ef migrations add AddUserAndProfile",
        output: `Build started...
Build succeeded.
Done. To undo this action, use 'ef migrations remove'
DbMigration [20240212001] was created successfully.`
    },
    {
        command: "curl -X POST http://api.example.com/api/users -H 'Content-Type: application/json' -d '{\"email\":\"john@example.com\",\"password\":\"secret123\",\"firstName\":\"John\",\"lastName\":\"Doe\"}'",
        output: `{
  "id": 1,
  "email": "john@example.com",
  "profile": {
    "firstName": "John",
    "lastName": "Doe"
  }
}`
    }
];

export const terminalCommands = commands; 
