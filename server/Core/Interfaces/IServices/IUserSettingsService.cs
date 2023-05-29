using Core.Models;

namespace Core.Interfaces.IServices
{
    public interface IUserSettingsService
    {
        Task<UserSettingsModel?> GetUserSettingsAsync(Guid userId);
        Task<UserSettingsModel> CreateSettingsAsync(UserSettingsModel settingsModel);
        Task<UserSettingsModel?> UpdateSettingsAsync(UserSettingsModel settingsModel);
    }
}
