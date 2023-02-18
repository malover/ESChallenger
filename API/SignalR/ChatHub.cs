using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);

            await Clients.Group(command.TournamentId.ToString())
            .SendAsync("ReceiveComment", comment.Value);
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var tournamentId = httpContext.Request.Query["tournamentId"];
            await Groups.AddToGroupAsync(Context.ConnectionId, tournamentId);

            var result = await _mediator.Send(new List.Query { TournamentId = Guid.Parse(tournamentId) });
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }
}