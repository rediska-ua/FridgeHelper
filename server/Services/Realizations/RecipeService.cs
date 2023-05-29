using AutoMapper;
using Core.Enums;
using Core.Interfaces.IServices;
using Core.Models;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;

namespace Services.Realizations
{
    public class RecipeService : IRecipeService
    {
        private readonly IRecipeRepository _recipeRepo;
        private readonly IMapper _mapper;

        public RecipeService(
            IRecipeRepository recipeRepo,
            IMapper mapper)
        {
            _mapper = mapper;
            _recipeRepo = recipeRepo;
        }


        public async Task<RecipeModel?> CreateRecipeAsync(RecipeModel recipeModel)
        {
            if (recipeModel == null)
            {
                throw new ArgumentNullException(nameof(recipeModel), "Model can`t be null.");
            }

            var checkRecipe = await _recipeRepo.FindAsync(r => r.RecipeId == recipeModel.RecipeId 
                && r.UserId == recipeModel.UserId);

            if (checkRecipe.FirstOrDefault() != null)
            {
                throw new ArgumentNullException(nameof(recipeModel), "This recipe is already saved");
            }

            var recipe = _mapper.Map<Recipe>(recipeModel);

            await _recipeRepo.AddAsync(recipe);
            await _recipeRepo.SaveChangesAsync();

            return _mapper.Map<RecipeModel>(recipe);
        }


        public async Task<RecipeModel?> UpdateRecipeAsync(RecipeModel recipeModel)
        {
            if (recipeModel == null)
            {
                throw new ArgumentNullException(nameof(recipeModel), "Model can`t be null.");
            }

            var recipe = await _recipeRepo.GetByIdAsync(recipeModel.Id);

            if (recipe == null)
            {
                return null;
            }

            _recipeRepo.Update(_mapper.Map<Recipe>(recipeModel));
            await _recipeRepo.SaveChangesAsync();

            return recipeModel;

        }

        public async Task DeleteRecipeAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentNullException("Id can not be empty");
            }

            var recipe = await _recipeRepo.GetByIdAsync(id);

            if (recipe == null)
            {
                throw new InvalidOperationException("Can`t find recipe in db.");
            }

            _recipeRepo.Remove(recipe);
            await _recipeRepo.SaveChangesAsync();

            return;
        }

        public async Task<RecipeModel?> GetRecipeByIdAsync(Guid id)
        {
            var recipe = await this._recipeRepo.FindAsync(r => r.Id == id);
            return _mapper.Map<RecipeModel>(recipe);
        }

        public async Task<IEnumerable<RecipeModel?>> GetSavedRecipesByUserId(Guid userId)
        {
            var savedRecipes = await this._recipeRepo.FindAllAsync(x => x.UserId == userId); 
            return _mapper.Map<IEnumerable<RecipeModel?>>(savedRecipes);
        }
    }
}
