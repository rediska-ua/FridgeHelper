using API.Controllers.Base;
using API.ViewModels;
using AutoMapper;
using Core.Interfaces.IServices;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Realizations;
using Swashbuckle.AspNetCore.Annotations;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RecipeController : BaseController
    {
        private readonly IRecipeService recipeService;
        private readonly IMapper mapper;
        public RecipeController(
            IRecipeService recipeService,
            IMapper mapper)
        {
            this.recipeService = recipeService;
            this.mapper = mapper;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(201, "Add recipe to saved recipes")]
        [SwaggerResponse(400, "The model state is invalid.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult<RecipeViewModel>> AddRecipeToUserFavourites([FromBody] RecipeViewModel recipe)
        {
            var recipeModel = mapper.Map<RecipeModel>(recipe);

            recipeModel = await recipeService.CreateRecipeAsync(recipeModel);

            if (recipeModel == null)
            {
                return BadRequest();
            }

            var result = mapper.Map<RecipeViewModel>(recipeModel);

            return CreatedAtAction(nameof(this.GetRecipeById), new { id = result.Id }, result);
        }

        [HttpGet("getById/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Returns a recipe with specific id.")]
        [SwaggerResponse(400, "The model state is invalid.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult<RecipeViewModel>> GetRecipeById(Guid recipeId)
        {
            if (recipeId == Guid.Empty)
            {
                return BadRequest("Recipe id is empty.");
            }

            var recipe = await recipeService.GetRecipeByIdAsync(recipeId);

            if (recipe == null)
            {
                return NotFound("A recipe wasn`t found.");
            }

            return Ok(mapper.Map<RecipeViewModel>(recipe));
        }


        [HttpGet("getSavedRecipes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Returns all saved recipes for user")]
        [SwaggerResponse(400, "The model state is invalid.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult<IEnumerable<RecipeViewModel>>> GetSavedRecipes()
        {
            var userId = this.UserId;

            if (userId == Guid.Empty)
            {
                return BadRequest("User id is empty.");
            }

            var recipes = await this.recipeService.GetSavedRecipesByUserId(UserId);

            return Ok(recipes);
        }


        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Returns success result of recipe removal.")]
        [SwaggerResponse(400, "The model state is invalid.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(403, "User cannot delete the product of another person.")]
        [SwaggerResponse(404, "No product found by the provided id.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult> RemoveRecipe(Guid id)
        {
            await recipeService.DeleteRecipeAsync(id);
            return Ok();
        }
    }
}
