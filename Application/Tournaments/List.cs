using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tournaments
{
    public class List
    {
        public class Query : IRequest<Result<List<Tournament>>> { }

        public class Handler : IRequestHandler<Query, Result<List<Tournament>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<List<Tournament>>> Handle(Query request, CancellationToken cancellationToken)
            {
                return Result<List<Tournament>>.Success(await _context.Tournaments.ToListAsync(cancellationToken));
            }
        }
    }
}