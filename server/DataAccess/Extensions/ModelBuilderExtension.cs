using Microsoft.EntityFrameworkCore;
using DataAccess.Entities;
using DataAccess.Extensions;
using Core.Enums;
using System.Text.Json;

namespace DataAccess.Extensions
{
    class JsonData
    {
        public string? name { get; set; }
        public List<string>? items { get; set; }
        public string? image { get; set; }
    }
    internal static class ModelBuilderExtension
    {
        internal static void Seed(this ModelBuilder builder)
        {
            //builder.SeedIngredients();
            builder.SeedCategoriesAndIngredients();
        }

        private static void SeedIngredients(this ModelBuilder builder)
        {
            var jsonData = File.ReadAllText("../DataAccess/db.json");
            var products = JsonSerializer.Deserialize<List<JsonData>>(jsonData);

            foreach (var product in products)
            {
                Console.WriteLine(product?.name?.ToString());
            }
        }

        private static void SeedCategoriesAndIngredients(this ModelBuilder builder)
        {
            var jsonData = File.ReadAllText("../DataAccess/db.json");
            var products = JsonSerializer.Deserialize<List<JsonData>>(jsonData);

            List<Category> seedDataCategory = new List<Category>();
            List<Ingredient> seedDataIngredient = new List<Ingredient>();
            foreach (var category in products)
            {
                Category toAdd = new Category
                {
                    Id = Guid.NewGuid(),
                    Value = category.name,
                    Image = category.image
                };
                seedDataCategory.Add(toAdd);
                foreach (var name in category.items)
                {
                    Ingredient newIngredient = new Ingredient
                    {
                        Id = Guid.NewGuid(),
                        Value = name.ToString(),
                        CategoryId = toAdd.Id,
                    };
                    seedDataIngredient.Add(newIngredient);
                }
            }
            builder.Seed(seedDataCategory.ToArray());
            builder.Seed(seedDataIngredient.ToArray());
        }

        private static void Seed<TEntity>(
            this ModelBuilder builder, params TEntity[] data)
            where TEntity : class
        {
            Console.WriteLine(data.Length);
            builder.Entity<TEntity>().HasData(data);
        }
    }
}
