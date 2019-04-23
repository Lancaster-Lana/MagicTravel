using System;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Web.Helpers;
using DAL;
using Core.Entities;
using Web.ViewModels;

namespace Web.Controllers
{
    [Route("api/products")]
    [AutoValidateAntiforgeryToken]
    public class ProductApiController : Controller
    {
        private IUnitOfWork _unitOfWork;
        readonly ILogger _logger;
        readonly IEmailSender _emailer;

        public ProductApiController(IUnitOfWork unitOfWork, ILogger<OrderApiController> logger, IEmailSender emailer)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _emailer = emailer;
        }

        [HttpGet]
        public async Task<IActionResult> List(string category = "", string search = "")//, bool metadata = false)
        {
            var products = _unitOfWork.Products.GetAll();
            //if (!string.IsNullOrWhiteSpace(category))
            //    products = products.Where(c => c.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrWhiteSpace(search))
                products = products.Where(p => p.Name.ToLower().Contains(search.ToLower())
                    || p.Description.ToLower().Contains(search.ToLower()));
            var list = products.ToList();

            list.ForEach((e) => 
            {
                //Image bytes => image string to be displayed in <img src=
                //e.ImageFileString = GetImageStringFromContent(e.ImageContent);
            });
            return Ok(list);
        }

        //[HttpGet("categories")]
        //public IActionResult Categories(string search = "")
        //{
        //    var list = new string[] { Category.Sweets, Category.Tart, Category.Cookies, Category.Bread, Category.Candies, };//_context.Categories.ToList(); 
        //    return Ok(list);
        //}

        [HttpGet("{id}")]
        //[AllowAnonymous]
        public Product GetProduct(long id)
        {
            var query = _unitOfWork.Products.GetAll();//.Include(p => p.Ratings);

            if (HttpContext.User.IsInRole("Administrator"))
            {
                //query = query.Include(p => p.Supplier).ThenInclude(s => s.Products);
            }

            var product = query.First(p => p.Id == id);

            if (product != null)
            {
                //Hack: convert to proper image string format from byte array
                //product.ImageFileString = GetImageStringFromContent(product.ImageContent);
            }
            return product;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] Product product)
        {
            if (ModelState.IsValid)
            {
                //if (product.Supplier != null && product.Supplier.SupplierId != 0)
                //{
                //    _context.Attach(product.Supplier);
                //}

                //Get and save image bytes from passed image string
                //if (!String.IsNullOrWhiteSpace(product.ImageFileString))
                //{
                //    var base64Data = Regex.Match(product.ImageFileString, @"data:image/(?<type>.+?),(?<data>.+)").Groups["data"].Value;
                //    product.ImageContent = Convert.FromBase64String(base64Data);
                //    //back = GetImageStringFromContent(product.ImageContent);
                //}

                _unitOfWork.Products.Add(product);
                _unitOfWork.SaveChanges();
                return Ok(product);
            }
            return BadRequest(ModelState);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] Product product)
        {
            if (ModelState.IsValid)
            {
                //product.ImageContent = ImageStringToBytesContent(product.ImageFileString);
      
                 _unitOfWork.Products.Update(product);
                _unitOfWork.SaveChanges();
                return Ok(product); //result.Entity TODO:
            }
            return BadRequest(ModelState);
        }

        [HttpDelete("{id}")]
        public ActionResult<bool> Delete(Product product)
        {
             _unitOfWork.Products.Remove(product);// new Product { ProductId = id });
            _unitOfWork.SaveChanges();

            return Ok(true);
            //return (result.State == EntityState.Deleted || result.State == EntityState.Detached);
        }

        #region private methods

        private static byte[] ImageStringToBytesContent(string base64DataString)
        {
            //Get and save image bytes from passed image string
            if (!string.IsNullOrWhiteSpace(base64DataString))
            {
                var base64Data = Regex.Match(base64DataString, @"data:image/(?<type>.+?),(?<data>.+)").Groups["data"].Value;
                return Convert.FromBase64String(base64Data);
            }
            return null;
        }

        private static string GetImageStringFromContent(byte[] imageContent)
        {
            return imageContent != null 
                ?"data:image/jpeg;base64," + Convert.ToBase64String(imageContent)
                : null;
        }
        #endregion
    }
}

//[HttpPatch("update")]
//public IActionResult Update(Product product)
//{
//    Product product = _context.Products//.Include(p => p.Supplier)
//                        .First(p => p.ProductId == id);
//    //var pdata = new ProductData { Product = product };
//    //patch.ApplyTo(pdata, ModelState);

//    if (ModelState.IsValid && TryValidateModel(patch))
//    {
//        /*
//        if (product.Supplier != null && product.Supplier.SupplierId != 0) {
//            _context.Attach(product.Supplier);
//        */
//        _context.SaveChanges();
//        return Ok();
//    }
//    return BadRequest(ModelState);
//}

/*
[HttpPatch("updateProduct/{id}")]
public IActionResult UpdateProduct(long id, [FromBody]JsonPatchDocument<Product> patch)
{
    Product product = _context.Products//.Include(p => p.Supplier)
                        .First(p => p.ProductId == id);
    //var pdata = new ProductData { Product = product };
    //patch.ApplyTo(pdata, ModelState);

    if (ModelState.IsValid && TryValidateModel(patch))
    {
        if (product.Supplier != null && product.Supplier.SupplierId != 0) {
            _context.Attach(product.Supplier);
        _context.SaveChanges();
        return Ok();
    }
    return BadRequest(ModelState);
}*/

/*
[HttpGet]
[AllowAnonymous]
public IActionResult GetProducts(string category, string search,
    bool related = false, bool metadata = false) {
IQueryable<Product> query = context.Products;

if (!string.IsNullOrWhiteSpace(category)) {
    string catLower = category.ToLower();
    query = query.Where(p => p.Category.ToLower().Contains(catLower));
}
if (!string.IsNullOrWhiteSpace(search)) {
    string searchLower = search.ToLower();
    query = query.Where(p => p.Name.ToLower().Contains(searchLower)
        || p.Description.ToLower().Contains(searchLower));
}

if (related && HttpContext.User.IsInRole("Administrator")) {
    query = query.Include(p => p.Supplier).Include(p => p.Ratings);
    List<Product> data = query.ToList();
    data.ForEach(p => {
        if (p.Supplier != null) {
            p.Supplier.Products = null;
        }
        if (p.Ratings != null) {
            p.Ratings.ForEach(r => r.Product = null);
        }
    });
    return metadata ? CreateMetadata(data) : Ok(data);
} else {
    return metadata ? CreateMetadata(query) : Ok(query);
}
}

private IActionResult CreateMetadata(IEnumerable<Product> products) {
return Ok(new {
    data = products,
    categories = context.Products.Select(p => p.Category)
        .Distinct().OrderBy(c => c)
});
}
*/
