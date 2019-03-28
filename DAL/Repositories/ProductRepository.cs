
using Microsoft.EntityFrameworkCore;
using DAL.Repositories.Interfaces;
using Core.Entities;

namespace DAL.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(DbContext context) : base(context)
        { }




        private AppDbContext _appContext => (AppDbContext)_context;
    }
}
