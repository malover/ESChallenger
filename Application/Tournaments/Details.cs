using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Tournaments
{
    public class Details
    {
        public class Query : IRequest<Result<Tournament>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Tournament>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;

            }
            public async Task<Result<Tournament>> Handle(Query request, CancellationToken cancellationToken)
            {
                var tournament = await _context.Tournaments.FindAsync(request.Id);

                return Result<Tournament>.Success(tournament);
            }
        }
    }
}