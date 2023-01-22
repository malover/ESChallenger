namespace Domain
{
    public class TournamentParticipator
    {
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public Guid TournamentId { get; set; }
        public Tournament Tournament { get; set; }
        public bool IsHost { get; set; }
                
    }
}