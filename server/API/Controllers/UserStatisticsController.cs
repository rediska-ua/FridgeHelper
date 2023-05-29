using API.Controllers.Base;
using AutoMapper;
using Core.Interfaces.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.ActionFilterAttributes;
using Swashbuckle.AspNetCore.Annotations;
using Core.Models.UserStatistics;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserStatisticsController : BaseController
    {
        private readonly IMapper mapper;
        private readonly IStatisticsService statisticsService;

        public UserStatisticsController(
            IMapper mapper,
            IStatisticsService statisticsService)
        {
            this.mapper = mapper;
            this.statisticsService = statisticsService;
        }

        [HttpGet("daily/{day}")]
        [ValidateDate]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Returns an object containing daily user statistics.")]
        [SwaggerResponse(400, "The model state is invalid or validation error occured.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult<UserStatisticsDay>> GetDailyStatistics(DateTime day)
        {
            var result = await statisticsService
                .GetDailyStatisticsAsync(UserId, day);

            return Ok(result);
        }

        [HttpGet("monthly/{year}/{month}")]
        [ValidateYear]
        [ValidateMonth]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Returns an object containing monthly user statistics.")]
        [SwaggerResponse(400, "The model state is invalid or validation error occured.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult<UserStatisticsMonth>> GetMonthlyStatistics(int year, int month)
        {
            var result = await statisticsService
                .GetMonthlyStatisticsAsync(UserId, year, month);

            return Ok(result);
        }

        [HttpGet("annual/{year}")]
        [ValidateYear]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Returns an object containing annual user statistics.")]
        [SwaggerResponse(400, "The model state is invalid or validation error occured.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult<UserStatisticsYear>> GetAnnualStatistics(int year)
        {
            var result = await statisticsService
                .GetAnnualStatisticsAsync(UserId, year);

            return Ok(result);
        }
    }
}
