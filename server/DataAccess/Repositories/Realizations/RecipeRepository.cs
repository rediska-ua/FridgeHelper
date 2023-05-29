using DataAccess.EF;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace DataAccess.Repositories.Realizations
{
    public class RecipeRepository : BaseRepository<Recipe>, IRecipeRepository
    {
        public RecipeRepository(AppDbContext context) : base(context)
        {
        }
        public async Task<IEnumerable<Recipe>> FindAllAsync(Expression<Func<Recipe, bool>> predicate)
        {
            return await context.Set<Recipe>()
                .Where(predicate)
                .ToListAsync();
        }
    }
}
