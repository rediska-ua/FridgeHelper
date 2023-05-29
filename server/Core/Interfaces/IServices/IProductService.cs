using Core.Models;

namespace Core.Interfaces.IServices
{
    public interface IProductService
    {
        public Task<ProductModel?> GetProductByIdAsync(Guid productId);
        public Task<IEnumerable<ProductModel>> GetAvailableProductsByUserAsync(Guid userId);
        public Task<ProductModel?> CreateProductAsync(ProductModel productModel);
        public Task DeleteProductAsync(ProductModel productModel);
        public Task<ProductModel?> UpdateProductAsync(ProductModel productModel);
        public Task<IEnumerable<CategoryModel>> GetCategoriesAsync();
        public Task<IEnumerable<IngredientModel>> GetIngredientsAsync();
    }
}
