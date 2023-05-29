using AutoMapper;
using Core.Enums;
using Core.Interfaces.IServices;
using Core.Models;
using Core.Models.UserStatistics;
using DataAccess.Repositories.Interfaces;
using System;

namespace Services.Realizations
{
    public class StatisticsService : IStatisticsService
    {
        private readonly IProductRepository _productRepo;
        private readonly IMapper _mapper;

        public StatisticsService(
            IProductRepository productRepository,
            IMapper mapper
        )   {
            this._productRepo = productRepository;
            this._mapper = mapper;
        }


        public async Task<UserStatisticsDay> GetDailyStatisticsAsync(Guid userId, DateTime date)
        {
            var dailyStatistics = new UserStatisticsDay
            {
                UserId = userId,
                Day = date
            };

            var nextDay = date.AddDays(1);

            var userProducts = await _productRepo.FindAllAsync(t => t.UserId == userId 
            && t.CreationDate >= date && t.CreationDate < nextDay );

            var result = _mapper.Map<IEnumerable<ProductModel>>(userProducts).ToList();
            dailyStatistics.ProductBought = result;
            dailyStatistics.MoneySpent = result.Select(x => x.Price).ToList().Sum();

            return dailyStatistics;
        }

        public async Task<UserStatisticsMonth> GetMonthlyStatisticsAsync(Guid userId, int year, int month)
        {
            var monthlyStatistics = new UserStatisticsMonth
            {
                UserId = userId,
                Month = (Month) month,

            };

            var userProducts = await _productRepo.FindAllAsync(t => t.UserId == userId
            && t.CreationDate.Year == year && t.CreationDate.Month >= month && t.CreationDate.Month < month + 1);

            var result = _mapper.Map<IEnumerable<ProductModel>>(userProducts).ToList();
            monthlyStatistics.ProductBought = result;
            monthlyStatistics.MoneySpent = result.Select(x => x.Price).ToList().Sum();

            return monthlyStatistics;
        }

        public async Task<UserStatisticsYear> GetAnnualStatisticsAsync(Guid userId, int year)
        {
            var yearStatistics = new UserStatisticsYear
            {
                UserId = userId,
                Year = year,
                AnalyticsPerMonths = new List<UserStatisticsMonth> { }
            };

            foreach (int month in Enum.GetValues(typeof(Month)))
            {
                var analyticsPerMonth = await this.GetMonthlyStatisticsAsync(userId, year, month);
                yearStatistics.AnalyticsPerMonths.Add(analyticsPerMonth);
            }

            return yearStatistics;
        }

    }
}