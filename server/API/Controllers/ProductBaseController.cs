using AutoMapper;
using Core.Interfaces.IServices;
using Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductBaseController : Controller
    {
        private readonly IProductService productsService;
        private readonly IMapper mapper;

        public ProductBaseController(
            IProductService productsService,
            IMapper mapper)
        {
            this.productsService = productsService;
            this.mapper = mapper;
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<CategoryModel>>> GetAllCategories()
        {
            var data = await productsService.GetCategoriesAsync();
            return Ok(data);
        }

        [HttpGet("ingredients")]
        public async Task<ActionResult<IEnumerable<IngredientModel>>> GetAllIngredients()
        {
            var data = await productsService.GetIngredientsAsync();
            return Ok(data);
        }
    }
}
