using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Astro.Web.App.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SaveFavouriteList(string Id, string setMode)
        {
            HttpCookie getCookie = HttpContext.Request.Cookies["FavouriteList"];
            if (getCookie == null)
            {
                List<string> Ids = new List<string>();
                Ids.Add(Id);
                HttpCookie Cookie = new HttpCookie("FavouriteList", string.Join(",", Ids).ToString());
                Cookie.Expires = DateTime.Now.AddDays(30);
                HttpContext.Response.Cookies.Add(Cookie);
            }
            else
            {
                List<string> Ids = getCookie.Value.Split(',').ToList();
                if (setMode.Equals("Add"))
                {
                    Ids.Add(Id);
                }
                else
                {
                    if (Ids.Contains(Id))
                    {
                        Ids.RemoveAll(x => x.Equals(Id));
                    }
                }
                if (Ids.Count > 0)
                {
                    HttpCookie Cookie = new HttpCookie("FavouriteList", string.Join(",", Ids).ToString());
                    Cookie.Expires = DateTime.Now.AddDays(30);
                    HttpContext.Response.Cookies.Add(Cookie);
                }
                else
                {
                    Response.Cookies["FavouriteList"].Expires = DateTime.Now.AddDays(-1);
                }
            }
            return Json(new { });
        }

        [HttpPost]
        public JsonResult GetFavouriteList()
        {
            List<string> Ids = new List<string>();
            HttpCookie getCookie = HttpContext.Request.Cookies["FavouriteList"];
            if (getCookie != null)
            {
                Ids = getCookie.Value.Split(',').ToList();
            }
            return Json(new { Ids });
        }

    }
}