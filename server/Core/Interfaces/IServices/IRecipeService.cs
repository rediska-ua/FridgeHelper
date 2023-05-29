using Core.Models;

namespace Core.Interfaces.IServices
{
    public interface IRecipeService
    {
        public Task<RecipeModel?> CreateRecipeAsync(RecipeModel recipeModel);
        public Task<RecipeModel?> GetRecipeByIdAsync(Guid id);
        public Task<IEnumerable<RecipeModel?>> GetSavedRecipesByUserId(Guid userId);
        public Task DeleteRecipeAsync(Guid id);
    }
}
