using Application.Tournaments;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TournamentsController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Tournament>>> GetTournaments()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Tournament>> GetTournamentById(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<IActionResult> CreateTournament(Tournament tournament)
        {
            return Ok(await Mediator.Send(new Create.Command { Tournament = tournament }));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditTournament(Guid id, Tournament tournament)
        {
            tournament.Id = id;
            return Ok(await Mediator.Send(new Edit.Command { Tournament = tournament }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTournament(Guid id)
        {
            return Ok(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}