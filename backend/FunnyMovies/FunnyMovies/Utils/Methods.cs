using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;

namespace FunnyMovies.Utils
{
	public class Methods
	{
		public static string HandleException(Exception e)
		{

			var error = "";
			error += e.Source + ": " + e.Message + "\n";
			error += "\tStackTrace: " + e.StackTrace + "\n";
			var inner = e.InnerException;
			while (inner != null)
			{
				error += inner.Source + ": " + inner.Message + "\n";
				error += "\tStackTrace: " + inner.StackTrace + "\n";

				inner = inner.InnerException;
			}
			//LogError(error);
			return e.Message;
		}
		public static HttpResponseMessage getHttpResponseMessage(string s)
		{
			return new HttpResponseMessage()
			{
				StatusCode = HttpStatusCode.OK,
				Content = new StringContent(s, System.Text.Encoding.UTF8, "application/json")
			};
		}

		public static string GetYoutubeInfo(string url, string type)
		{
			var videoInfoUrl = $"http://youtube.com/get_video_info?video_id=" + url;
			HttpWebRequest request = (HttpWebRequest)WebRequest.Create(videoInfoUrl);
			HttpWebResponse response = (HttpWebResponse)request.GetResponse();

			Stream responseStream = response.GetResponseStream();
			StreamReader reader = new StreamReader(responseStream, Encoding.GetEncoding("utf-8"));

			string videoInfo = HttpUtility.HtmlDecode(reader.ReadToEnd());

			NameValueCollection videoParams = HttpUtility.ParseQueryString(videoInfo);

			return JObject.Parse(videoParams["player_response"])["videoDetails"][type].ToString();
		}
	}
}