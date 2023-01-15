using Application.Tournaments;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TournamentsController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetTournaments()
        {
            var response = await Mediator.Send(new List.Query());
            return HandleResult(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTournamentById(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost]
        public async Task<IActionResult> CreateTournament(Tournament tournament)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Tournament = tournament }));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditTournament(Guid id, Tournament tournament)
        {
            tournament.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { Tournament = tournament }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTournament(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}