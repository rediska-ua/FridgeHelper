using System.Text.Json;

namespace API.ViewModels
{
    public class ErrorViewModel
    {
        public string? StatusCode { get; set; }
        public string? Message { get; set; }
        public override string ToString()
        {
            return JsonSerializer.Serialize(this);
        }
    }
}
