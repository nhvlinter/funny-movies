using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FunnyMovies.Models
{
	public class Movie
	{
		public long Id { get; set; }
		public string Url { get; set; }
		public long SharedBy { get; set; }
	}
}