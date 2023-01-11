using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Tournaments
{
    public class List
    {
        public class Query : IRequest<List<Tournament>> { }

        public class Handler : IRequestHandler<Query, List<Tournament>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Tournament>> Handle(Query request, CancellationToken cancellationToken)
            {               
                return await _context.Tournaments.ToListAsync();
            }
        }
    }
}