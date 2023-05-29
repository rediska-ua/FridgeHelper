using API.Controllers.Base;
using API.ViewModels;
using AutoMapper;
using Core.Interfaces.IServices;
using Core.Models;
using DataAccess.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Realizations;
using Swashbuckle.AspNetCore.Annotations;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductsController : BaseController
    {
        private readonly IProductService productsService;
        private readonly IMapper mapper;

        public ProductsController(
            IProductService productsService,
            IMapper mapper)
        {
            this.productsService = productsService;
            this.mapper = mapper;
        }


        [HttpGet("getById/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Returns object containing a single product.")]
        [SwaggerResponse(400, "The model state is invalid.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(404, "No product has been found by the provided id.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult<ProductViewModel>> GetProductById(Guid id)
        {
            if (id == Guid.Empty)
            {
                return BadRequest("Product id is empty.");
            }

            var product = await this.productsService.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound("A product wasn`t found.");
            }

            return Ok(mapper.Map<ProductViewModel>(product));
        }


        [HttpGet("getByUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Returns all producs in user inventory.")]
        [SwaggerResponse(400, "The model state is invalid.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult<IEnumerable<ProductViewModel>>> GetProductByUser()
        {
            var userId = this.UserId;

            Console.WriteLine(userId);

            if (userId == Guid.Empty)
            {
                return BadRequest("Task id is empty.");
            }

            var products = await this.productsService.GetAvailableProductsByUserAsync(userId);

            return Ok(mapper.Map<IEnumerable<ProductViewModel>>(products));
        }


        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(201, "Returns created object with product id.")]
        [SwaggerResponse(400, "The model state is invalid.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult<ProductViewModel>> CreateProduct([FromBody] ProductViewModel product)
        {
            Console.WriteLine(product.Price);
            var productModel = mapper.Map<ProductModel>(product);

            productModel.UserId = UserId;

            productModel = await productsService.CreateProductAsync(productModel);

            if (productModel == null)
            {
                return BadRequest();
            }

            var result = mapper.Map<ProductViewModel>(productModel);

            return CreatedAtAction(nameof(this.GetProductById), new { id = result.Id }, result);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Returns success result of product deletion.")]
        [SwaggerResponse(400, "The model state is invalid.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(403, "User cannot delete the product of another person.")]
        [SwaggerResponse(404, "No product found by the provided id.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult> DeleteProduct(Guid id)
        {
            var product = await productsService.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound("Product wasn`t found.");
            }

            if (product.UserId != UserId)
            {
                return Forbid("Can`t delete the product that doesn`t related to current user.");
            }

            await productsService.DeleteProductAsync(product);

            return Ok();
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Returns success result of product updation.")]
        [SwaggerResponse(400, "The model state is invalid.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(403, "User cannot update product of another person.")]
        [SwaggerResponse(404, "No product found by the provided id.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult> UpdateProduct(
            Guid id,
            [FromBody] ProductViewModel product)
        {
            var productModel = await productsService.GetProductByIdAsync(id);

            if (productModel == null)
            {
                return NotFound("Product wasn`t found.");
            }

            if (productModel.UserId != UserId)
            {
                return Forbid("Can`t update the product that doesn`t related to current user.");
            }

            productModel = mapper.Map<ProductModel>(product);

            productModel = await productsService.UpdateProductAsync(productModel);

            if (productModel == null)
            {
                return BadRequest();
            }

            var result = mapper.Map<ProductViewModel>(productModel);

            return AcceptedAtAction(nameof(this.GetProductById), new { id = result.Id }, result);
        }
    }
}
