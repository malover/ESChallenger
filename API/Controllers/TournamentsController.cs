using Application.Core;
using Application.Tournaments;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TournamentsController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetTournaments([FromQuery] TournamentParams param)
        {
            return HandlePagedResult(await Mediator.Send(new List.Query { Params = param }));
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

        [Authorize(Policy = "IsTournamentHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditTournament(Guid id, Tournament tournament)
        {
            tournament.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { Tournament = tournament }));
        }

        [Authorize(Policy = "IsTournamentHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTournament(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }

        [HttpPost("{id}/participate")]
        public async Task<IActionResult> Participate(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateParticipators.Command { Id = id }));
        }
    }
}