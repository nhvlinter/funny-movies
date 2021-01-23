using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FunnyMovies.Models
{
	public class SharedView
	{
		public long MovieId { get; set; }
		public string Url { get; set; }
		public string Title { get; set; }
		public string Description { get; set; }
		public string SharedBy { get; set; }
		public int UpVote { get; set; }
		public int DownVote { get; set; }
		public string UserVote { get; set; }
	}
}