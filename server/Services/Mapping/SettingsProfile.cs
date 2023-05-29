using AutoMapper;
using Core.Models;
using DataAccess.Entities;

namespace Services.Mapping
{
    public class SettingsProfile : Profile
    {
        public SettingsProfile()
        {
            CreateMap<Settings, UserSettingsModel>()
                .ReverseMap();
            CreateMap<AppUser, UserInfoModel>().ReverseMap();
            CreateMap<AppUser, UserModel>().ReverseMap();
            CreateMap<UserInfoModel, UserModel>().ReverseMap();
        }
    }
}
