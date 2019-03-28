
using Microsoft.EntityFrameworkCore;
using DAL.Repositories.Interfaces;
using Core.Entities;

namespace DAL.Repositories
{
    public class OrdersRepository : Repository<Order>, IOrdersRepository
    {
        public OrdersRepository(DbContext context) : base(context)
        { }

        private AppDbContext _appContext => (AppDbContext)_context;
    }
}
