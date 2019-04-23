
using DAL.Repositories.Interfaces;
using Core.Entities;

namespace DAL.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(AppDbContext context) : base(context)
        { }

        //private AppDbContext _appContext => (AppDbContext)_context;
    }
}
