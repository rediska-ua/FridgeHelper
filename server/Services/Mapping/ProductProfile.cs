using AutoMapper;
using Core.Models;
using Core.Models.Base;
using DataAccess.Entities;

namespace Services.Mapping
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<ProductModel, Product>();
            CreateMap<IngredientModel, Ingredient>().ReverseMap();
        }

    }
}