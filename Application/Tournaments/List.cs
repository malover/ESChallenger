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
        public class Query : IRequest<Result<PagedList<TournamentDTO>>>
        {
            public TournamentParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<TournamentDTO>>>
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

            public async Task<Result<PagedList<TournamentDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Tournaments
                .Where(d => d.Date >= request.Params.StartDate)
                .OrderBy(d => d.Date)
                .ProjectTo<TournamentDTO>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUsername() })
                .AsQueryable();

                if (request.Params.IsGoing && !request.Params.IsHosting)
                {
                    query = query.Where(x => x.Participators.Any(a => a.UserName == _userAccessor.GetUsername()));
                }

                if (request.Params.IsHosting && !request.Params.IsGoing)
                {
                    query = query.Where(x => x.HostUsername == _userAccessor.GetUsername());
                }

                return Result<PagedList<TournamentDTO>>.Success(
                    await PagedList<TournamentDTO>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
                );
            }
        }
    }
}