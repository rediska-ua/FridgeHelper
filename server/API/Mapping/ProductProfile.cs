using API.ViewModels;
using AutoMapper;
using Core.Enums;
using Core.Models;

namespace API.Mapping
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<ProductViewModel, ProductModel>().ReverseMap();
        }
    }
}