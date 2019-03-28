
using Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace DAL
{ 
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var dbConnectionStr = CONSTS.DBConnectionStr;//configuration["ConnectionStrings:DefaultConnection"];

            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseSqlServer(dbConnectionStr);

            return new AppDbContext(optionsBuilder.Options);
        }

        /*
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            Mapper.Reset();

            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .AddJsonFile("appsettings.Development.json", optional: true)
                .Build();

            var builder = new DbContextOptionsBuilder<ApplicationDbContext>();

            string connectionStr = configuration["ConnectionStrings:DefaultConnection"];

            builder.UseSqlServer(connectionStr, b => b.MigrationsAssembly("DAL"));
            builder.UseOpenIddict();

            return new ApplicationDbContext(builder.Options);
        }*/
    }
}
