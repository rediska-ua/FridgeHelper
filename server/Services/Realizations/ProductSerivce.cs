using AutoMapper;
using Core.Enums;
using Core.Interfaces.IServices;
using Core.Models;
using Core.Models.Base;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;

namespace Services.Realizations
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepo;
        private readonly ICategoryRepository _categoryRepo;
        private readonly IIngredientRepository _ingredientRepo;
        private readonly IMapper _mapper;

        public ProductService(
            IProductRepository productRepo,
            ICategoryRepository categoryRepo,
            IIngredientRepository ingredientRepo,
            IMapper mapper)
        {
            _productRepo = productRepo;
            _categoryRepo = categoryRepo;
            _ingredientRepo = ingredientRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ProductModel>> GetAvailableProductsByUserAsync(Guid userId)
        {
            var userProducts = await _productRepo.FindAllAsync(t => t.UserId == userId && t.IsAvailable == true);
            return _mapper.Map<IEnumerable<ProductModel>>(userProducts);
        }

        public async Task<ProductModel?> GetProductByIdAsync(Guid productId)
        {
            var product = await _productRepo.FindOneTaskAsync(productId);

            if (product == null)
            {
                return null;
            }

            return _mapper.Map<ProductModel>(product);
        }


        public async Task<ProductModel?> CreateProductAsync(ProductModel productModel)
        {
            var product = _mapper.Map<Product>(productModel);

            await _productRepo.AddAsync(product);
            await _productRepo.SaveChangesAsync();

            return _mapper.Map<ProductModel>(product);
        }


        public async Task DeleteProductAsync(ProductModel productModel)
        {
            if (productModel == null)
            {
                throw new ArgumentNullException(nameof(productModel), "Can`t be Null.");
            }

            var product = await _productRepo.GetByIdAsync(productModel.Id);

            if (product == null)
            {
                throw new InvalidOperationException("Can`t find product in db.");
            }

            product.IsAvailable = false;

            _productRepo.Update(product);
            await _productRepo.SaveChangesAsync();
        }

        public async Task<ProductModel?> UpdateProductAsync(ProductModel productModel)
        {
            if (productModel == null)
            {
                throw new ArgumentNullException(nameof(productModel), "Can`t be Null.");
            }

            var product = await _productRepo.GetByIdAsync(productModel.Id);

            if (product == null)
            {
                return null;
            }

            product.IngredientId = productModel.IngredientId;
            product.ExpirationDate = productModel.ExpirationDate;
            product.Price = productModel.Price;
            product.IsAvailable = productModel.IsAvailable;

            _productRepo.Update(product);
            await _productRepo.SaveChangesAsync();

            return _mapper.Map<ProductModel>(product);
        }


        public async Task<IEnumerable<CategoryModel>> GetCategoriesAsync()
        {
            var result = await _categoryRepo.GetAllAsync();
            return _mapper.Map<IEnumerable<CategoryModel>>(result);
        }

        public async Task<IEnumerable<IngredientModel>> GetIngredientsAsync()
        {
            var result = await _ingredientRepo.GetAllAsync();
            return _mapper.Map<IEnumerable<IngredientModel>>(result);
        }

    }
}