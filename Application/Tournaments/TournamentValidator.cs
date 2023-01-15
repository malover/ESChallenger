using Domain;
using FluentValidation;

namespace Application.Tournaments
{
    public class TournamentValidator : AbstractValidator<Tournament>
    {
        public TournamentValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.Country).NotEmpty();
            RuleFor(x => x.City).NotEmpty();
            RuleFor(x => x.Category).NotEmpty();
            RuleFor(x => x.PrizePool).NotEmpty();
            RuleFor(x => x.Venue).NotEmpty();
        }
    }
}