using Core.Interfaces.IRepositories;
using DataAccess.Entities;
using System.Linq.Expressions;

namespace DataAccess.Repositories.Interfaces
{
    public interface IProductRepository : IBaseRepository<Product>
    {
        public Task<IEnumerable<Product>> FindAllAsync(Expression<Func<Product, bool>> predicate);
        public Task<Product?> FindOneTaskAsync(Guid id);
    }
}
