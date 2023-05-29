using Core.Enums;
using Core.Models.Base;

namespace Core.Models.UserStatistics
{
    public class UserStatisticsMonth : BaseUserOrientedModel
    {
        public Month Month { get; set; }
        public double MoneySpent { get; set; }
        public ICollection<ProductModel> ProductBought { get; set; } = new List<ProductModel>();
    }
}
