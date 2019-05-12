using System.Collections.Generic;

namespace Core.Entities
{
    public class Order : AuditableEntity
    {
        public int Id { get; set; }
        public decimal Discount { get; set; }
        public string Comments { get; set; }
        //public DateTime DateCreated { get; set; }
        //public DateTime DateModified { get; set; }

        public string CashierId { get; set; }
        public virtual ApplicationUser Cashier { get; set; }

        public int CustomerId { get; set; }
        public virtual Customer Customer { get; set; } = new Customer();

        public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    }
}