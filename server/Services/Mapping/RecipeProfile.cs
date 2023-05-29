using AutoMapper;
using Core.Enums;
using Core.Models;
using DataAccess.Entities;

namespace Services.Mapping
{

    public class RecipeProfile : Profile
    {
        public RecipeProfile()
        {
            CreateMap<RecipeModel, Recipe>().ReverseMap();
        }

    }
}