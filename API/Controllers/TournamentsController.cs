using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class TournamentsController : BaseApiController
    {
        private readonly DataContext _context;
        public TournamentsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Tournament>>> GetTournaments()
        {
            return await _context.Tournaments.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Tournament>> GetTournamentById(Guid id)
        {
            return await _context.Tournaments.FindAsync(id);
        }
    }
}