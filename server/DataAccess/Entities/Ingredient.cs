using Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Entities
{
    public class Ingredient : BaseEntity
    {
        [Column(TypeName = "varchar(255)")]
        public string? Value { get; set; }
        public Guid CategoryId {  get; set; }
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
