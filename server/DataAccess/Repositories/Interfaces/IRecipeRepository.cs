using Core.Interfaces.IRepositories;
using DataAccess.Entities;
using System.Linq.Expressions;

namespace DataAccess.Repositories.Interfaces
{
    public interface IRecipeRepository : IBaseRepository<Recipe>
    {
        public Task<IEnumerable<Recipe>> FindAllAsync(Expression<Func<Recipe, bool>> predicate);
    }
}
