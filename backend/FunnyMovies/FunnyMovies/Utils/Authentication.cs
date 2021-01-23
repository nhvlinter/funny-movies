using FunnyMovies.Models;
using System;
using System.IO;
using System.Runtime.CompilerServices;
using System.Text;
using System.Web;

[assembly: SuppressIldasm()]
namespace FunnyMovies.Utils
{
    public class Authentication
    {
        private const string FormatDate = "yyyyMMdd-HH";
        private static readonly byte[] Pw = Encoding.UTF8.GetBytes("LongN");
        public string UserName;
        //UserName;CurrentTime;Infomation
        public string Token;

        public Authentication(string userName, string passWord)
        {
            UserName = null;
			if (!QueryHelper.IsLoginExist(userName))
			{
				QueryHelper.Register(userName, passWord);
			}
            //Sục vào database để lấy Login info
            if (QueryHelper.IsLogin(userName, passWord))
            {
                UserName = userName;
                Token= AES.Encrypt(UserName + "$" + DateTime.Now.ToString(FormatDate) + "$" + GetApiLogDetails(),Pw);
            }
        }
        private void SaveAuthentication()
        {
            Token = UserName + ";" + DateTime.Now.ToString(FormatDate) + ";" + GetApiLogDetails();
            string path = HttpContext.Current.Server.MapPath("~/App_Data/" + UserName + ".dat");
            using (var writer = new StreamWriter(path))
            {
                writer.WriteLine(Token);
            }
        }
        private static string GetApiLogDetails()
        {
			if (HttpContext.Current == null) return string.Empty;
            var info = HttpContext.Current.Request.UserHostAddress +"-" + HttpContext.Current.Request.UserAgent;
            return info;
        }
        public static User GetAuthentication(string token)
        {
            try
            {
                //decrypt
                var decrypt = AES.Decrypt(token.Replace(' ','+'),Pw);
                if (!decrypt.Contains("$")) return null;
                var str = decrypt.Split('$');
                
                
                //UserName
                //Sục vào database để lấy Login info
                var isMatched = QueryHelper.IsLoginExist(str[0].Trim());
                if (!isMatched) return null;

                //Date time
                var date = str[1].Split('-');
                var currentDate = DateTime.Now.ToString(FormatDate).Split('-');
                if (date[0] != currentDate[0]) return null;
                if ((int.Parse(currentDate[1]) - int.Parse(date[1])) > 4) return null;

                //Infomation
                if (str[2] != GetApiLogDetails()) return null;

                return QueryHelper.GetLoginInfo(str[0]);
            }
            catch(Exception)
            {

                return null;
            }
        }

    }
}
