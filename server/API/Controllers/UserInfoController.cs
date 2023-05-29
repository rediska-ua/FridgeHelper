using API.Controllers.Base;
using API.ViewModels;
using AutoMapper;
using Core.Interfaces.IServices;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserInfoController : BaseController
    {
        private readonly IUserInfoService userService;
        private readonly IMapper mapper;

        public UserInfoController(
            IUserInfoService userService,
            IMapper mapper)
        {
            this.userService = userService;
            this.mapper = mapper;
        }

        [HttpGet("getUserInfo")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Returns info about user")]
        [SwaggerResponse(400, "The model state is invalid.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult<UserInfoModel>> GetInfo()
        {
            var userId = this.UserId;

            if (userId == Guid.Empty)
            {
                return BadRequest("User id is empty.");
            }

            var info = await this.userService.GetUserInfo(userId);

            return Ok(mapper.Map<UserInfoModel>(info));
        }


        [HttpPut("getUserInfo")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Returns info about user")]
        [SwaggerResponse(400, "The model state is invalid.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult<UserInfoModel>> ChangeInfo(UserInfoModel newUser)
        {
            var userId = this.UserId;

            if (userId == Guid.Empty)
            {
                return BadRequest("User id is empty.");
            }

            var info = await this.userService.UpdateUser(newUser);

            return Ok(mapper.Map<UserInfoModel>(info));
        }
    }
}
