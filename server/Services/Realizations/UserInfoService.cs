using AutoMapper;
using Core.Interfaces.IServices;
using Core.Models;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Realizations
{
    public class UserInfoService : IUserInfoService
    {

        private readonly IMapper mapper;
        private readonly IUserRepository userRepository;

        public UserInfoService(
            IMapper mapper,
            IUserRepository userRepository)
        {
            this.mapper = mapper;
            this.userRepository = userRepository;
        }
        public async Task<UserInfoModel> GetUserInfo(Guid userId)
        {
            var result = await userRepository.GetByIdAsync(userId);
            return mapper.Map<UserInfoModel>(result);
        }

        public async Task<UserModel?> GetUser(Guid userId)
        {
            var result = await userRepository.GetByIdAsync(userId);
            return mapper.Map<UserModel>(result);
        }

        public async Task<UserModel?> UpdateUser(UserInfoModel user)
        {
            var updatedUser = await userRepository.FindAsync(u => u.Email == user.Email);
            var newUser = updatedUser.FirstOrDefault();
            Console.WriteLine(user.Name);
            newUser.Name = user.Name;
            userRepository.Update(newUser);
            await userRepository.SaveChangesAsync();
            return mapper.Map<UserModel>(newUser); ;

        }
    }
}
