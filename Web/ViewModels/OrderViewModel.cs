
using System.Collections.Generic;

namespace Web.ViewModels
{
    public class OrderViewModel
    {
        public int Id { get; set; }
        public decimal Discount { get; set; }
        public string Comments { get; set; }
        //public DateTime DateCreated { get; set; }
        //public DateTime DateModified { get; set; }

        public string CashierId { get; set; }
        public UserViewModel Cashier { get; set; }

        public int CustomerId { get; set; }
        public CustomerViewModel Customer { get; set; }// = new CustomerViewModel();

        public List<OrderDetailViewModel> OrderDetails { get; set; }// = new List<OrderDetailViewModel>();
    }
}
