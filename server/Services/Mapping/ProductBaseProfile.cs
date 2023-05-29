using AutoMapper;
using Core.Models;
using DataAccess.Entities;

namespace Services.Mapping
{
    public class ProductBaseProfile : Profile
    {
        public ProductBaseProfile()
        {
           CreateMap<Category, CategoryModel>();
           CreateMap<Product, ProductModel>();
           CreateMap<Ingredient, IngredientModel>();
        }
    }
}
