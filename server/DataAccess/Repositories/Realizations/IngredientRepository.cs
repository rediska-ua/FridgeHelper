using DataAccess.EF;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.X509Certificates;

namespace DataAccess.Repositories.Realizations
{
    public class IngredientRepository : BaseRepository<Ingredient>, IIngredientRepository
    {
        public IngredientRepository(AppDbContext context) : base(context)
        {
          
        }

        new public async Task<IEnumerable<Ingredient>> GetAllAsync() =>
            await context.Set<Ingredient>().OrderBy(i => i.Value).ToListAsync();

    }
}
