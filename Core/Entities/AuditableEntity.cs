
using System;
using System.ComponentModel.DataAnnotations;
using Core.Entities.Interfaces;

namespace Core.Entities
{
    public class AuditableEntity : IAuditableEntity
    {
        public DateTime CreatedDate { get; set; }
        [MaxLength(256)]
        public string CreatedBy { get; set; }
        [MaxLength(256)]
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
