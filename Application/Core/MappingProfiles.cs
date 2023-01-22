using Application.Tournaments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Tournament, Tournament>();
            CreateMap<Tournament, TournamentDTO>()
            .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Participators.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<TournamentParticipator, Profiles.Profile>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
            .ForMember(d => d.UserBio, o => o.MapFrom(s => s.AppUser.Bio));
        }
    }
}