using Core.Models.UserStatistics;

namespace Core.Interfaces.IServices
{
    public interface IStatisticsService
    {
        Task<UserStatisticsDay> GetDailyStatisticsAsync(Guid userId, DateTime day);
        Task<UserStatisticsMonth> GetMonthlyStatisticsAsync(Guid userId, int year, int month);
        Task<UserStatisticsYear> GetAnnualStatisticsAsync(Guid userId, int year);
    }
}
