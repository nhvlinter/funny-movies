using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FunnyMovies.Models
{
	public class Vote
	{
		public long UserId { get; set; }
		public long MovieId { get; set; }
		public bool IsUpVote { get; set; }
	}
}