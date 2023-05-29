using API.ViewModels;
using AutoMapper;
using Core.Models;

namespace API.Mapping
{
    public class RecipeProfile : Profile
    {
        public RecipeProfile()
        {
            CreateMap<RecipeModel, RecipeViewModel>().ReverseMap();
        }
    }
}
