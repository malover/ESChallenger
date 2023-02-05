using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Tournament> Tournaments { get; set; }
        public DbSet<TournamentParticipator> TournamentParticipators { get; set; }
        public DbSet<Photo> Photos{ get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<TournamentParticipator>(x => x.HasKey(aa => new { aa.AppUserId, aa.TournamentId }));

            builder.Entity<TournamentParticipator>()
            .HasOne(u => u.AppUser)
            .WithMany(a => a.Tournaments)
            .HasForeignKey(aa => aa.AppUserId);

            builder.Entity<TournamentParticipator>()
            .HasOne(u => u.Tournament)
            .WithMany(a => a.Participators)
            .HasForeignKey(aa => aa.TournamentId);
        }
    }
}