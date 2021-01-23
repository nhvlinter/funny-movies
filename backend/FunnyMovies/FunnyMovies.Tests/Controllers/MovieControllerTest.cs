using FunnyMovies.Controllers;
using FunnyMovies.Models;
using FunnyMovies.Utils;
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
	public class MovieControllerTest
	{
		public static string TestUrl = "v5N_hBxsjSY";
		[TestMethod]
		public void _1_ShareMovie()
		{
			try
			{
				var loginController = new LoginController();
				var httpResponseMessage = loginController.Post(new Models.MyString(LoginControllerTest.UserTest));
				var token = (JObject)JsonConvert.DeserializeObject(httpResponseMessage.Content.ReadAsStringAsync().Result);
				var httpResponseMessage2 = loginController.Get(token["token"].ToString());
				var userInfo = (JObject)JsonConvert.DeserializeObject(httpResponseMessage2.Content.ReadAsStringAsync().Result);
				var movieController = new MovieController();
				movieController.Post(new Models.Movie()
				{
					Url = TestUrl,
					SharedBy = Int64.Parse(userInfo["Id"].ToString())
				});
				Assert.IsTrue(true);
			}
			catch (Exception)
			{
				Assert.Fail();
			}
		}
		[TestMethod]
		public void _2_GetSharedView()
		{
			var loginController = new LoginController();
			var httpResponseMessage = loginController.Post(new Models.MyString(LoginControllerTest.UserTest));
			var token = (JObject)JsonConvert.DeserializeObject(httpResponseMessage.Content.ReadAsStringAsync().Result);
			var httpResponseMessage2 = loginController.Get(token["token"].ToString());
			var userInfo = (JObject)JsonConvert.DeserializeObject(httpResponseMessage2.Content.ReadAsStringAsync().Result);
			var movieController = new MovieController();
			var httpResponseMessage3 = movieController.Get(userInfo["Id"].ToString());
			Assert.AreNotEqual("good-bye", httpResponseMessage3.Content.ReadAsStringAsync().Result);
		}
		[TestMethod]
		public void _3_Vote()
		{
			try
			{
				var loginController = new LoginController();
				var httpResponseMessage = loginController.Post(new Models.MyString(LoginControllerTest.UserTest));
				var token = (JObject)JsonConvert.DeserializeObject(httpResponseMessage.Content.ReadAsStringAsync().Result);
				var httpResponseMessage2 = loginController.Get(token["token"].ToString());
				var userInfo = (JObject)JsonConvert.DeserializeObject(httpResponseMessage2.Content.ReadAsStringAsync().Result);
				var movieController = new MovieController();
				var httpResponseMessage3 = movieController.Get(userInfo["Id"].ToString());
				var sharedList = JsonConvert.DeserializeObject<SharedView[]>(httpResponseMessage3.Content.ReadAsStringAsync().Result);
				foreach (var s in sharedList)
				{
					if (s.Url == TestUrl)
					{
						var voteController = new VoteController();
						voteController.Post(new Vote() { MovieId = s.MovieId, UserId = Int64.Parse(userInfo["Id"].ToString()), IsUpVote = true });
						//success
						QueryHelper.ClearUnitTestData(Int64.Parse(userInfo["Id"].ToString()), s.MovieId);
						Assert.IsTrue(true);
						return;
					}
				}
				//failed
			}
			catch (Exception)
			{
				//failed
			}

			Assert.Fail();
		}
	}
}
