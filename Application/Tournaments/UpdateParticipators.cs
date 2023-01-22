using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tournaments
{
    public class UpdateParticipators
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;

            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var tournament = await _context.Tournaments
                .Include(p => p.Participators)
                .ThenInclude(u => u.AppUser)
                .FirstOrDefaultAsync(x => x.Id == request.Id);
                if (tournament == null) return null;

                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                if (user == null) return null;

                var hostUsername = tournament.Participators.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                var participation = tournament.Participators.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                if (participation != null && hostUsername == user.UserName)
                    tournament.IsCancelled = !tournament.IsCancelled;

                if (participation != null && hostUsername != user.UserName)
                    tournament.Participators.Remove(participation);

                if (participation == null)
                {
                    participation = new TournamentParticipator
                    {
                        AppUser = user,
                        Tournament = tournament,
                        IsHost = false
                    };

                    tournament.Participators.Add(participation);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating participation");

            }
        }
    }
}