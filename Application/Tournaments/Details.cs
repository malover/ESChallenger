using Domain;
using MediatR;
using Persistence;

namespace Application.Tournaments
{
    public class Details
    {
        public class Query : IRequest<Tournament>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Tournament>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;

            }
            public async Task<Tournament> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Tournaments.FindAsync(request.Id);
            }
        }
    }
}