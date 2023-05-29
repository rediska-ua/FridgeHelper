using API.ViewModels;
using AutoMapper;
using Core.Models;

namespace API.Mapping
{
    public class SettingsProfile : Profile
    {
        public SettingsProfile()
        {
            CreateMap<UserSettingsModel, SettingsViewModel>()
                .ReverseMap();
        }
    }
}
