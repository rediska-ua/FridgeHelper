using AutoMapper;
using Core.Interfaces.IServices;
using Core.Models;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;

namespace Services.Realizations
{
    public class SettingsService : IUserSettingsService
    {
        private readonly IMapper mapper;
        private readonly ISettingsRepository settingsRepository;

        public SettingsService(
            IMapper mapper,
            ISettingsRepository settingsRepository)
        {
            this.mapper = mapper;
            this.settingsRepository = settingsRepository;
        }

        public async Task<UserSettingsModel> CreateSettingsAsync(UserSettingsModel settingsModel)
        {
            if (settingsModel is null)
            {
                throw new ArgumentNullException(nameof(settingsModel));
            }

            var settings = mapper.Map<Settings>(settingsModel);

            await RemoveExistingSettings(settings.UserId);
            await settingsRepository.AddAsync(settings);
            await settingsRepository.SaveChangesAsync();

            return mapper.Map<UserSettingsModel>(settings);
        }

        public async Task<UserSettingsModel?> GetSettingsAsync(Guid id)
        {
            var settings = await settingsRepository.GetByIdAsync(id);
            return mapper.Map<UserSettingsModel>(settings);
        }

        public async Task<UserSettingsModel?> GetUserSettingsAsync(Guid userId)
        {
            if (userId == Guid.Empty)
            {
                throw new ArgumentException("Argument value is all zeroes.", nameof(userId));
            }

            var settings = await settingsRepository
                .FindAsync(s => s.UserId == userId);

            return mapper.Map<UserSettingsModel>(settings?.FirstOrDefault());
        }

        public async Task<UserSettingsModel?> UpdateSettingsAsync(UserSettingsModel settingsModel)
        {
            if (settingsModel is null)
            {
                throw new ArgumentNullException(nameof(settingsModel));
            }

            if (!await settingsRepository
                .HasByIdAsync(settingsModel.Id))
            {
                return null;
            }

            var settings = mapper.Map<Settings>(settingsModel);

            settingsRepository.Update(settings);
            await settingsRepository.SaveChangesAsync();

            return mapper.Map<UserSettingsModel>(settings);
        }

        private async Task RemoveExistingSettings(Guid userId)
        {
            var settings = await settingsRepository
                .FindAsync(s => s.UserId == userId);

            if (settings?.Count() > 0)
            {
                settingsRepository.RemoveRange(settings);
                await settingsRepository.SaveChangesAsync();
            }
        }
    }
}