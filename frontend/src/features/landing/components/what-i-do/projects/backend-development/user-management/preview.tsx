export const preview = {
    type: "json" as const,
    content: {
        "endpoint": "GET /api/users/1",
        "statusCode": 200,
        "response": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "Developer",
            "createdAt": "2023-01-15T08:30:00Z"
        }
    }
};
