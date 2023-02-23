using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tournaments
{
    public class List
    {
        public class Query : IRequest<Result<List<TournamentDTO>>> { }

        public class Handler : IRequestHandler<Query, Result<List<TournamentDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<TournamentDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var tournaments = await _context.Tournaments
                .ProjectTo<TournamentDTO>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUsername() })
                .ToListAsync(cancellationToken);

                return Result<List<TournamentDTO>>.Success(tournaments);
            }
        }
    }
}