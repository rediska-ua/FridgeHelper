using Core.Models;

namespace Core.Interfaces.IServices
{
    public interface IUserInfoService
    {
        Task<UserInfoModel> GetUserInfo(Guid userId);
        Task<UserModel?> GetUser(Guid userId);
        Task<UserModel?> UpdateUser(UserInfoModel user);
    }
}
