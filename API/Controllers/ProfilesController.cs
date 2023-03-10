using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { UserName = username }));
        }

        [HttpPut]
        public async Task<IActionResult> EditProfile(Edit.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpGet("{username}/tournaments")]
        public async Task<IActionResult> GetUserTournaments(string username, string predicate)
        {
            return HandleResult(await Mediator.Send(new ListTournaments.Query { UserName = username, Predicate = predicate }));
        }
    }
}