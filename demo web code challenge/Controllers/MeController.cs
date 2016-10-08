using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Owin;
using demo_web_code_challenge.Models;

namespace demo_web_code_challenge.Controllers
{
    [RoutePrefix("api")]
    //[Authorize]
    public class MeController : ApiController
    {
        private ApplicationUserManager _userManager;

        public MeController()
        {
        }

        public MeController(ApplicationUserManager userManager)
        {
            UserManager = userManager;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        [Route("info")]
        // GET api/Me
        public IHttpActionResult Get()
        {
            
            var user = UserManager.FindById(User.Identity.GetUserId());
            return Ok(new { name = "Hiển", phone = "000393003930" });
            //return new GetViewModel() { Hometown = user.Hometown };
        }
    }
}