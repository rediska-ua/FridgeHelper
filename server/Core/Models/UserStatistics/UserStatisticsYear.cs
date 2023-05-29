using Core.Models.Base;

namespace Core.Models.UserStatistics
{
    public class UserStatisticsYear : BaseUserOrientedModel
    {
        public int Year { get; set; }

        public List<UserStatisticsMonth> AnalyticsPerMonths { get; set; }
            = new List<UserStatisticsMonth>();
    }
}
