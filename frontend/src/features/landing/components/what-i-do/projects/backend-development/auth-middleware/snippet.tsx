const code = `using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

public class JwtAuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IUserService _userService;

    public JwtAuthMiddleware(RequestDelegate next, IUserService userService)
    {
        _next = next;
        _userService = userService;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // GET JWT TOKEN FROM HEADER
        var token = context.Request.Headers["Authorization"]
            .FirstOrDefault()?.Split(" ").Last();

        if (token != null)
            await AttachUserToContext(context, token);

        await _next(context);
    }

    private async Task AttachUserToContext(HttpContext context, string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);
            
            // GET USER ID FROM TOKEN
            var userId = int.Parse(jwtToken.Claims.First(x => 
                x.Type == ClaimTypes.NameIdentifier).Value);

            // ATTACH USER TO CONTEXT
            context.Items["User"] = await _userService.GetUserById(userId);
        }
        catch
        {
            // TOKEN VALIDATION FAILED
            context.Items["User"] = null;
        }
    }
}`;

export const snippet = code; 
