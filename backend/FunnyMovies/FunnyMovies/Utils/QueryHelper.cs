using FunnyMovies.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading;
using System.Web;

namespace FunnyMovies.Utils
{
	public class QueryHelper
	{
		public static User GetLoginInfo(string userName)
		{
			var u = new User();
			var sqlParameters = new List<SqlParameter>()
			{
				new SqlParameter("@Email", SqlDbType.VarChar, 200) {Value = userName}
			};
			using (var conn = OpenSqlConnection())
			{
				using (var command = GenerateCommand("sp_User_Get", sqlParameters, conn))
				{
					var reader = command.ExecuteReader();
					if (reader.HasRows)
					{
						while (reader.Read())
						{
							u.Id = (long)reader["Id"];
							u.Email = reader["Email"].ToString();
						}
					}
					CloseSqlConnection(conn);
				}
			}
			return u;
		}
		public static bool IsLogin(string userName, string passWord)
		{
			bool rs = false;
			var sqlParameters = new List<SqlParameter>()
			{
				new SqlParameter("@Email", SqlDbType.VarChar, 200) {Value = userName}
			};
			using (var conn = OpenSqlConnection())
			{
				using (var command = GenerateCommand("sp_User_Get", sqlParameters, conn))
				{
					var reader = command.ExecuteReader();
					if (reader.HasRows)
					{
						while (reader.Read())
						{
							if (reader["Password"].ToString() == passWord)
							{
								rs = true;
								break;
							}
						}
					}
					CloseSqlConnection(conn);
				}
			}
			return rs;
		}
		public static bool IsLoginExist(string userName)
		{
			bool rs = false;
			var sqlParameters = new List<SqlParameter>()
			{
				new SqlParameter("@Email", SqlDbType.VarChar, 200) {Value = userName}
			};
			using (var conn = OpenSqlConnection())
			{
				using (var command = GenerateCommand("sp_User_Get", sqlParameters, conn))
				{
					var reader = command.ExecuteReader();
					rs = reader.HasRows;
					CloseSqlConnection(conn);
				}
			}
			return rs;
		}
		public static void Register(string userName,string passWord)
		{
			var sqlParameters = new List<SqlParameter>()
			{
				new SqlParameter("@Email", SqlDbType.VarChar, 200) {Value = userName},
				new SqlParameter("@Password", SqlDbType.VarChar, -1) {Value = passWord}
			};
			using (var conn = OpenSqlConnection())
			{
				using (var command = GenerateCommand("sp_User_Add", sqlParameters, conn))
				{
					command.ExecuteNonQuery();
					CloseSqlConnection(conn);
				}
			}
		}
		public static void AddMovie(Movie movie)
		{
			var sqlParameters = new List<SqlParameter>()
			{
				new SqlParameter("@Url", SqlDbType.VarChar, 500) {Value = movie.Url},
				new SqlParameter("@SharedBy", SqlDbType.BigInt) {Value = movie.SharedBy}
			};
			using (var conn = OpenSqlConnection())
			{
				using (var command = GenerateCommand("sp_Movie_Add", sqlParameters, conn))
				{
					command.ExecuteNonQuery();
					CloseSqlConnection(conn);
				}
			}
		}
		public static List<SharedView> GetMovies(string userId)
		{
			var rs = new List<SharedView>();
			var sqlParameters = userId != null ? new List<SqlParameter>()
			{
				new SqlParameter("@UserId", SqlDbType.BigInt) {Value = userId}
			} : null;
			using (var conn = OpenSqlConnection())
			{
				using (var command = GenerateCommand("sp_Movie_Get", sqlParameters, conn))
				{
					var reader = command.ExecuteReader();
					if (reader.HasRows)
					{
						while (reader.Read())
						{
							var sharedView = new SharedView()
							{
								MovieId = (long)reader["MovieId"],
								Url = reader["Url"].ToString(),
								SharedBy = reader["SharedBy"].ToString(),
								UpVote = (int)reader["UpVote"],
								DownVote = (int)reader["DownVote"],
								UserVote = reader["UserVote"] == DBNull.Value ? null : reader["UserVote"].ToString()
							};
							rs.Add(sharedView);
						}
					}
					CloseSqlConnection(conn);
				}
			}
			return rs;
		}
		public static void SaveVote(Vote vote)
		{
			var sqlParameters = new List<SqlParameter>()
			{
				new SqlParameter("@MovieId", SqlDbType.BigInt) {Value = vote.MovieId},
				new SqlParameter("@UserId", SqlDbType.BigInt) {Value = vote.UserId},
				new SqlParameter("@IsUpVote", SqlDbType.Bit) {Value = vote.IsUpVote}
			};
			using (var conn = OpenSqlConnection())
			{
				using (var command = GenerateCommand("sp_Vote_Add", sqlParameters, conn))
				{
					command.ExecuteNonQuery();
					CloseSqlConnection(conn);
				}
			}
		}
		public static void ClearUnitTestData(long userId, long movieId)
		{
			var sqlParameters = new List<SqlParameter>()
			{
				new SqlParameter("@MovieId", SqlDbType.BigInt) {Value = movieId},
				new SqlParameter("@UserId", SqlDbType.BigInt) {Value = userId},
			};
			using (var conn = OpenSqlConnection())
			{
				using (var command = GenerateCommand("sp_Unit_Clear", sqlParameters, conn))
				{
					command.ExecuteNonQuery();
					CloseSqlConnection(conn);
				}
			}
		}
		#region Common Methods

		public static SqlCommand GenerateCommand(string cmdText, List<SqlParameter> param, SqlConnection conn)
		{
			var command = new SqlCommand(cmdText, conn) { CommandType = CommandType.StoredProcedure };
			if (param != null)
			{
				foreach (var p in param)
				{
					command.Parameters.Add(p);
				}
			}
			command.CommandTimeout = 0;
			return command;
		}

		public static SqlConnection OpenSqlConnection()
		{
			string connStr = ConfigurationManager.ConnectionStrings["connStr"].ConnectionString;
			var conn = new SqlConnection(connStr);
			var isOpen = false;
			while (!isOpen)
			{
				try
				{
					if (conn.State == ConnectionState.Closed)
					{
						conn.Open();
					}
					isOpen = true;
				}
				catch (Exception e)
				{
					Methods.HandleException(e);
					Console.WriteLine("Connection Failed.");
					Thread.Sleep(10000);
					isOpen = false;
				}
			}
			return conn;
		}

		public static void CloseSqlConnection(SqlConnection conn)
		{
			try
			{
				if (conn != null)
				{
					conn.Close();
				}
			}
			catch (Exception e)
			{
				Console.WriteLine(e.ToString());
			}
		}

		#endregion
	}
}