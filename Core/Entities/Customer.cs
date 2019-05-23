using System;
using System.Collections.Generic;

namespace Core.Entities
{
    public class Customer : AuditableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public Gender Gender { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
    }
}
