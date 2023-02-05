using Application.Profiles;

namespace Application.Tournaments
{
    public class TournamentDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public decimal PrizePool { get; set; }
        public string HostUsername { get; set; }
        public bool IsCancelled { get; set; }
        public ICollection<ParticipatorDTO> Participators { get; set; }
    }
}