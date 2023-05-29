using DataAccess.EF;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories.Realizations
{
    public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(AppDbContext context) : base(context)
        {
        }

        new public async Task<IEnumerable<Category>> GetAllAsync() =>
            await context.Set<Category>().OrderBy(c => c.Value).ToListAsync();
    }
}
