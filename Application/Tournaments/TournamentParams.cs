using Application.Core;

namespace Application.Tournaments
{
    public class TournamentParams : PagingParams
    {
        public bool IsGoing { get; set; }
        public bool IsHosting { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;

    }
}