
using System;

namespace Web.ViewModels
{
    public class OrderDetailViewModel 
    {
        public int Id { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal Discount { get; set; }

        public int ProductId { get; set; }
        public ProductViewModel Product { get; set; }

        public int OrderId { get; set; }
        public OrderViewModel Order { get; set; }

        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
    }
}
