using backend.Domain;
using backend.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsersAsync() 
        { 
            var users = await _userService.GetAllUsersAsync();
            if (users is null)
                return NotFound("There is No users Created");
            return Ok(users);
        }
        [HttpGet("getFriend/{id}")]
        public async Task<IActionResult> GetUserFriends(Guid id)
        {
            var friends = await _userService.GetUserFriends(id);
            if (friends is null)
                return NotFound("This user has no friends");
            return Ok(friends);
        } 

    }
}
