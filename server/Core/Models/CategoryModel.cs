using Core.Models.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class CategoryModel : BaseModel
    {
        public string? Value { get; set; }
        public string? Image { get; set; }
    }
}
