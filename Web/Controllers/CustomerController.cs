
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoMapper;
using Web.Helpers;
using Web.ViewModels;
using DAL;
using Core.Entities;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    public class CustomerController : Controller
    {
        readonly IUnitOfWork _unitOfWork;
        readonly ILogger _logger;
        readonly IEmailSender _emailer;

        public CustomerController(IUnitOfWork unitOfWork, ILogger<CustomerController> logger, IEmailSender emailer)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _emailer = emailer;
        }

        // GET api/customer/5
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Customer))]
        public IActionResult Get(int id)
        {
            var customer =  _unitOfWork.Customers.Get(id);
            return Ok(customer);
        }

        // GET: api/customer
        [HttpGet]
        public IActionResult Get()
        {
            var allCustomers = _unitOfWork.Customers.GetAllCustomersData();
            var model = Mapper.Map<IEnumerable<CustomerViewModel>>(allCustomers);
            return Ok(model);
        }

        /// <summary>
        /// Create customer
        /// </summary>
        /// <param name="customer"></param>
        // POST api/customer
        [HttpPost]
        public void Post([FromBody]CustomerViewModel customer)
        {
            var entity = Mapper.Map<Customer>(customer); 
            _unitOfWork.Customers.Add(entity);
            _unitOfWork.SaveChanges();
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        /// <summary>
        /// TODO: Send email
        /// </summary>
        /// <returns></returns>
        [HttpGet("email")]
        public async Task<string> Email()
        {
            string recepientName = "QickApp Tester"; //         <===== Put the recepient's name here
            string recepientEmail = "test@lana-soft.com"; //   <===== Put the recepient's email here

            string message = EmailTemplates.GetTestEmail(recepientName, DateTime.UtcNow);

            (bool success, string errorMsg) = await _emailer.SendEmailAsync(recepientName, recepientEmail, "Test Email from Web", message);

            if (success)
                return "Success";

            return "Error: " + errorMsg;
        }


        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
