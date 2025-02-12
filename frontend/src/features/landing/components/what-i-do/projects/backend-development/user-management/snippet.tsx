const code = `using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
     private readonly IUserService _userService; // INJECTED SERVICE

     // CONSTRUCTOR INJECTION
     public UsersController(IUserService userService)
     {
         _userService = userService;
     }

     // GET: api/users
     [HttpGet]
     public async Task<ActionResult<IEnumerable<User>>> GetUsers()
     {
         var users = await _userService.GetAllUsers();
         return Ok(users);
     }

     // GET: api/users/1
     [HttpGet("{id}")]
     public async Task<ActionResult<User>> GetUser(int id)
     {
         var user = await _userService.GetUserById(id);
         if (user == null)
             return NotFound();
             
         return Ok(user);
     }
}`;

export const snippet = code;
