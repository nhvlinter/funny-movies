using FunnyMovies.Models;
using FunnyMovies.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FunnyMovies.Controllers
{
    public class VoteController : ApiController
    {
        // POST: api/Vote
		[HttpPost]
        public void Post(Vote vote)
        {
			QueryHelper.SaveVote(vote);
        }
    }
}
