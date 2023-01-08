using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            if (context.Tournaments.Any())
                return;

            var tournaments = new List<Tournament>
            {
                new Tournament{
                    Title = "Starladder season 12",
                    Date = DateTime.UtcNow.AddMonths(-2),
                    Description = "Dota 2 tournament which takes place in Kyiv Cybersports arena.",
                    Country = "Ukraine",
                    City = "Kyiv",
                    Venue = "Cybersports arena",
                    Category = "Dota 2",
                    PrizePool = 250000M
                },
                new Tournament{
                    Title = "ESL season 5",
                    Date = DateTime.UtcNow.AddMonths(-2),
                    Description = "CSGO tournament which takes place in Rio Major arena.",
                    Country = "Brazil",
                    City = "Rio de Janeiro",
                    Venue = "Major arena",
                    Category = "CSGO 2",
                    PrizePool = 600000M
                },new Tournament{
                    Title = "Blast winter finals",
                    Date = DateTime.UtcNow.AddMonths(-2),
                    Description = "CSGO tournament which takes place in Coppenhagen Capital arena.",
                    Country = "Denmark",
                    City = "Coppenhagen",
                    Venue = "Capital arena",
                    Category = "CSGO",
                    PrizePool = 200000M
                },new Tournament{
                    Title = "International 10",
                    Date = DateTime.UtcNow.AddMonths(-2),
                    Description = "Dota 2 tournament which takes place in Boston Grants arena.",
                    Country = "USA",
                    City = "Boston",
                    Venue = "Grants arena",
                    Category = "Dota 2",
                    PrizePool = 250000M
                },new Tournament{
                    Title = "Worlds",
                    Date = DateTime.UtcNow.AddMonths(-2),
                    Description = "LoL tournament which takes place in Tokyo Sinjuan arena.",
                    Country = "Japan",
                    City = "Tokyo",
                    Venue = "Sinjuan arena",
                    Category = "LoL",
                    PrizePool = 250000M
                }
            };
            await context.Tournaments.AddRangeAsync(tournaments);
            await context.SaveChangesAsync();
        }
    }
}