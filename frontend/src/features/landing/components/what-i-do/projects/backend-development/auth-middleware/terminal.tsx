const commands = [
    {
        command: "curl -X POST http://api.example.com/api/auth/login -d '{\"email\":\"user@example.com\",\"password\":\"password123\"}'",
        output: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires": "2024-02-12T23:59:59Z"
}`
    },
    {
        command: "curl -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' http://api.example.com/api/users/profile",
        output: `{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}`
    }
];

export const terminalCommands = commands; 
