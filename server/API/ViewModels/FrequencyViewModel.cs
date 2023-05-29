using System.ComponentModel.DataAnnotations;

namespace API.ViewModels
{
    public class FrequencyViewModel
    {
        public Guid Id { get; set; }
        public string? FrequencyValue { get; set; }
        public bool IsCustom { get; set; }

        [Range(0, short.MaxValue, ErrorMessage = "The {0} property must be in the range from {1} to {2}.")]
        public short Every { get; set; }
    }
}
