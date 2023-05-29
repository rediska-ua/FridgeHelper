using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.ActionFilterAttributes
{
    public class ValidateMonthAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            const string monthParam = "month";
            const string yearParam = "year";

            int month = context.ActionArguments.GetValue<int>(monthParam);
            int year = context.ActionArguments.GetValue<int>(yearParam);

            if (month != default && year != default)
            {
                const int min = 1;
                const int max = 12;

                if (month < min || month > max)
                    context.Result = new BadRequestObjectResult(
                         $"The {monthParam} parameter must be in the range " +
                         $"from {min} to {max}.");
                else if (year == DateTime.UtcNow.Year && month > DateTime.UtcNow.Month)
                    context.Result = new BadRequestObjectResult(
                         $"The {monthParam} parameter according to the " +
                         $"{yearParam} parameter cannot represent a month " +
                         $"in the future (in UTC).");
            }

            base.OnActionExecuting(context);
        }
    }
}
