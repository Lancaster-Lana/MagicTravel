using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using DAL;
using Web.Helpers;
using Web.ViewModels;
using AutoMapper;
using Core.Entities;

namespace Web.Controllers
{
    [Route("api/orders")]
    [AutoValidateAntiforgeryToken]
    [Produces("application/json")]
    public class OrderApiController : Controller
    {
        private IUnitOfWork _unitOfWork;
        readonly ILogger _logger;
        readonly IEmailSender _emailer;

        public OrderApiController(IUnitOfWork unitOfWork, ILogger<OrderApiController> logger, IEmailSender emailer)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _emailer = emailer;
        }

        [HttpGet]
        //[Authorize(Roles = "Administrator")]
        public async Task<IActionResult> List(string search = "" )
        {
            var list = _unitOfWork.Orders.GetAll();//.Find(o => o.Customer)
             
            if (!string.IsNullOrWhiteSpace(search))
                list = list.Where(p => p.Customer.Name.ToLower().Contains(search.ToLower()));
            //   || p.Address.Street.ToLower().Contains(search.ToLower()));

            var res = await list
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)   
                //.Include(o => o.Payment) - payed or not
                .ToListAsync();
            return Ok(res);
        }

        [HttpGet("{id}")]
        //[Authorize(Roles = "Administrator")]
        public IActionResult GetOrder(int id)
        {
            if (id <= 0)
            {
               ModelState.AddModelError("", "Order id is 0");
                return BadRequest(ModelState);
            }
            var result =  _unitOfWork.Orders.Get(id);
            //if (HttpContext.User.IsInRole("Administrator".ThenInclude(s => s.Products);

            return Ok(result);
        }

        [HttpPost("create")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromBody]OrderViewModel order)//([ModelBinder]Order order)
        {
            //Check business conditions:
            //if (order.SelectedProducts?.Count == 0)
            //    ModelState.AddModelError("Error", "Order must contain products");
            if (ModelState.IsValid)
            {
                var entity = Mapper.Map<Order>(order);
                _unitOfWork.Orders.Add(entity);
                _unitOfWork.SaveChanges(); //await _context.SaveChangesAsync();
                return Ok(order);
            }
            return BadRequest(ModelState);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] OrderViewModel order)
        {
            if (ModelState.IsValid)
            {
                var entity = Mapper.Map<Order>(order);
                _unitOfWork.Orders.Update(entity);
                _unitOfWork.SaveChanges();
                return Ok(entity); //TODO:
            }
            return BadRequest(ModelState);
        }

        /*
        [HttpPatch("{id}")]
        public IActionResult Update(long id, [FromBody]JsonPatchDocument<Order> patch)
        {
            Order order = _context.Orders.First(p => p.OrderId == id);
            var odata = new  { Order = order };
            patch.ApplyTo(odata, ModelState);

            if (ModelState.IsValid && TryValidateModel(odata))
            {
                _context.SaveChanges();
                return Ok();
            } else {
                return BadRequest(ModelState);
            }
        }*/

        [HttpDelete("{id}")]
        public void Delete([FromBody] OrderViewModel order)
        {
            //TODO: errors check
            var entity = Mapper.Map<Order>(order);
            _unitOfWork.Orders.Remove(entity);
            _unitOfWork.SaveChanges();
        }
    }
}
