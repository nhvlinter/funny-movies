using FunnyMovies.Controllers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FunnyMovies.Tests.Controllers
{
	[TestClass]
	public class LoginControllerTest
	{
		public static string UserTest = "user@test.com;password";
		[TestMethod]
		public void _1_RegisterLogin()
		{
			var loginController = new LoginController();
			var httpResponseMessage = loginController.Post(new Models.MyString(UserTest));
			Assert.AreNotEqual("good-bye", httpResponseMessage.Content.ReadAsStringAsync().Result);
		}
		[TestMethod]
		public void _2_InvalidPassword()
		{
			var loginController = new LoginController();
			var httpResponseMessage = loginController.Post(new Models.MyString(UserTest+"123"));
			Assert.AreEqual("good-bye", httpResponseMessage.Content.ReadAsStringAsync().Result);
		}
		[TestMethod]
		public void _3_GetInfo()
		{
			var loginController = new LoginController();
			var httpResponseMessage = loginController.Post(new Models.MyString(UserTest));
			var token = (JObject) JsonConvert.DeserializeObject(httpResponseMessage.Content.ReadAsStringAsync().Result);
			var httpResponseMessage2 = loginController.Get(token["token"].ToString());
			Assert.AreNotEqual("good-bye", httpResponseMessage2.Content.ReadAsStringAsync().Result);
		}
	}
}
