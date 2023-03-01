using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListTournaments
    {
        public class Query : IRequest<Result<List<UserTournamentDto>>>
        {
            public string UserName { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserTournamentDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<UserTournamentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.TournamentParticipators
                .Where(u => u.AppUser.UserName == request.UserName)
                .OrderBy(a => a.Tournament.Date)
                .ProjectTo<UserTournamentDto>(_mapper.ConfigurationProvider)
                .AsQueryable();

                query = request.Predicate switch
                {
                    "past" => query.Where(a => a.Date <= DateTime.Now),
                    "hosting" => query.Where(a => a.HostUserName == request.UserName),
                    _ => query.Where(a => a.Date >= DateTime.Now)
                };

                var tournaments = await query.ToListAsync();

                return Result<List<UserTournamentDto>>.Success(tournaments);
            }
        }
    }
}