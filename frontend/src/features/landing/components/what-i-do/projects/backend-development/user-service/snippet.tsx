const code = `using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;

public interface IUserService
{
    Task<User> GetUserById(int id);
    Task<IEnumerable<User>> GetAllUsers();
    Task<User> CreateUser(CreateUserDto dto);
}

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(ApplicationDbContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<User> GetUserById(int id)
    {
        return await _context.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<IEnumerable<User>> GetAllUsers()
    {
        return await _context.Users
            .Include(u => u.Profile)
            .ToListAsync();
    }

    public async Task<User> CreateUser(CreateUserDto dto)
    {
        // VALIDATE USER DATA
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            throw new DomainException("Email already exists");

        // CREATE USER ENTITY
        var user = new User
        {
            Email = dto.Email,
            PasswordHash = _passwordHasher.HashPassword(dto.Password),
            Profile = new UserProfile
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName
            }
        };

        // SAVE TO DATABASE
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }
}`;

export const snippet = code; 
