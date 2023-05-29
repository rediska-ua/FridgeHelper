using DataAccess.EF;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace DataAccess.Repositories.Realizations
{
    public class ProductRepository : BaseRepository<Product>, IProductRepository
    {
        public ProductRepository(AppDbContext context) : base(context)
        {

        }

        public async Task<Product?> FindOneTaskAsync(Guid id)
        {
            return await context.Set<Product>()
                .Where(t => t.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Product>> FindAllAsync(Expression<Func<Product, bool>> predicate)
        {
            return await context.Set<Product>()
                .Where(predicate)
                .ToListAsync();
        }
    }
}
