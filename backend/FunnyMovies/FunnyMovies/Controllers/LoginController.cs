using FunnyMovies.Models;
using FunnyMovies.Utils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FunnyMovies.Controllers
{
	public class LoginController : ApiController
	{
		//http://stackoverflow.com/questions/14624306/web-api-parameter-always-null
		[HttpPost]
		public HttpResponseMessage Post(MyString loginInfo)
		{
			var str = loginInfo.Value.Split(';');
			var auth = new Authentication(str[0], str[1]);
			if (auth.UserName == str[0]) return Methods.getHttpResponseMessage("{\"token\":\"" + auth.Token + "\"}");
			return Methods.getHttpResponseMessage("good-bye");
		}
		[HttpGet]
		public HttpResponseMessage Get(string token)
		{
			var s = Authentication.GetAuthentication(token);
			if (s.Id == -1)
				return Methods.getHttpResponseMessage("good-bye");
			return Methods.getHttpResponseMessage(JsonConvert.SerializeObject(s));
		}

		//http://forums.asp.net/t/1821728.aspx?Web+API+project+returning+JSON+issues
		
	}
}
