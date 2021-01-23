using FunnyMovies.Models;
using FunnyMovies.Utils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace FunnyMovies.Controllers
{
    public class MovieController : ApiController
    {
        // GET: api/Movie
        public HttpResponseMessage Get(string uid)
        {
			if (!Int64.TryParse(uid, out long rs) && uid != string.Empty && uid != null)
			{
				return Methods.getHttpResponseMessage("error");
			}
			var fullList = QueryHelper.GetMovies(uid);
			for(var i = 0; i < fullList.Count; i++)
			{
				fullList[i].Title = Methods.GetYoutubeInfo(fullList[i].Url, "title");
				fullList[i].Description = Methods.GetYoutubeInfo(fullList[i].Url, "shortDescription");
			}
			return Methods.getHttpResponseMessage(JsonConvert.SerializeObject(fullList));
		}
		// POST: api/Movie
		[HttpPost]
		public HttpResponseMessage Post(Movie movie)
		{
			if (movie.Url.ToLower().Contains("youtube"))
			{
				Uri videoUri = new Uri(movie.Url);
				string videoID = HttpUtility.ParseQueryString(videoUri.Query).Get("v");
				movie.Url = videoID;
			}
			try
			{
				var title = Methods.GetYoutubeInfo(movie.Url, "title");
				var description = Methods.GetYoutubeInfo(movie.Url, "shortDescription");
			}
			catch(Exception e)
			{
				return Methods.getHttpResponseMessage("{\"error\":\"Invalid Url\"}");
			}
			QueryHelper.AddMovie(movie);
			return Methods.getHttpResponseMessage(string.Empty);
		}
    }
}
