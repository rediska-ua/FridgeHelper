using Core.Models.Base;

namespace Core.Models.UserStatistics
{
    public class UserStatisticsDay : BaseUserOrientedModel
    {
        public DateTime Day { get; set; }
        public double MoneySpent { get; set; }
        public ICollection<ProductModel> ProductBought { get; set; } = new List<ProductModel>();
    }
}
