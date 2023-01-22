using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Tournaments
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Tournament Tournament { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Tournament).SetValidator(new TournamentValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var tournament = await _context.Tournaments.FindAsync(request.Tournament.Id);

                if (tournament is null) return null;

                _mapper.Map(request.Tournament, tournament);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to update tournament");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}