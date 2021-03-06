USE [master]
GO
/****** Object:  Database [FunnyMovie]    Script Date: 1/23/2021 11:57:26 PM ******/
CREATE DATABASE [FunnyMovie]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'FunnyMovie', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\FunnyMovie.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'FunnyMovie_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\FunnyMovie_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [FunnyMovie] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [FunnyMovie].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [FunnyMovie] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [FunnyMovie] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [FunnyMovie] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [FunnyMovie] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [FunnyMovie] SET ARITHABORT OFF 
GO
ALTER DATABASE [FunnyMovie] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [FunnyMovie] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [FunnyMovie] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [FunnyMovie] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [FunnyMovie] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [FunnyMovie] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [FunnyMovie] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [FunnyMovie] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [FunnyMovie] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [FunnyMovie] SET  DISABLE_BROKER 
GO
ALTER DATABASE [FunnyMovie] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [FunnyMovie] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [FunnyMovie] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [FunnyMovie] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [FunnyMovie] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [FunnyMovie] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [FunnyMovie] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [FunnyMovie] SET RECOVERY FULL 
GO
ALTER DATABASE [FunnyMovie] SET  MULTI_USER 
GO
ALTER DATABASE [FunnyMovie] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [FunnyMovie] SET DB_CHAINING OFF 
GO
ALTER DATABASE [FunnyMovie] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [FunnyMovie] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [FunnyMovie] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'FunnyMovie', N'ON'
GO
ALTER DATABASE [FunnyMovie] SET QUERY_STORE = OFF
GO
USE [FunnyMovie]
GO
/****** Object:  Table [dbo].[Movie]    Script Date: 1/23/2021 11:57:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Movie](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Url] [varchar](500) NOT NULL,
	[SharedBy] [bigint] NOT NULL,
 CONSTRAINT [PK_Movie] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 1/23/2021 11:57:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](200) NULL,
	[Password] [nvarchar](max) NULL,
 CONSTRAINT [PK_User_1] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Vote]    Script Date: 1/23/2021 11:57:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Vote](
	[MovieId] [bigint] NOT NULL,
	[UserId] [bigint] NOT NULL,
	[IsUpVote] [bit] NOT NULL,
 CONSTRAINT [PK_Vote] PRIMARY KEY CLUSTERED 
(
	[MovieId] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Vote] ADD  CONSTRAINT [DF_Vote_IsUpVote]  DEFAULT ((0)) FOR [IsUpVote]
GO
/****** Object:  StoredProcedure [dbo].[sp_Movie_Add]    Script Date: 1/23/2021 11:57:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_Movie_Add]
	-- Add the parameters for the stored procedure here
	@Url varchar(500),
	@SharedBy bigint
AS
BEGIN
	INSERT INTO [dbo].[Movie]
			   ([Url]
			   ,[SharedBy])
		 VALUES
			   (@Url
			   ,@SharedBy)
END
GO
/****** Object:  StoredProcedure [dbo].[sp_Movie_Get]    Script Date: 1/23/2021 11:57:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_Movie_Get]
	-- Add the parameters for the stored procedure here
	@UserId bigint = NULL
AS
BEGIN
SELECT [dbo].[Movie].[Id] AS 'MovieId',[Url] ,[dbo].[User].[Email] AS 'SharedBy', 
SUM(case when [dbo].[Vote].[IsUpVote] = 1 THEN 1 ELSE 0 END) AS UpVote, 
SUM(case when [dbo].[Vote].[IsUpVote] = 0 THEN 1 ELSE 0 END) AS DownVote,
SUM(case when Voted.[IsUpVote] = 1 THEN 1 
	when Voted.[IsUpVote] = 0 THEN 0 
	ELSE NULL END) AS 'UserVote'
  FROM [dbo].[Movie] 
	LEFT JOIN [dbo].[Vote] ON [dbo].[Movie].[Id] = [dbo].[Vote].[MovieId]
	LEFT JOIN (SELECT [MovieId],[IsUpVote] FROM [dbo].[Vote] WHERE [UserId]=@UserId) Voted ON [dbo].[Movie].[Id] = Voted.[MovieId]
	,[dbo].[User]
  WHERE [dbo].[Movie].[SharedBy] = [dbo].[User].[Id] 
  Group BY [dbo].[Movie].[Id], [Url], [dbo].[User].[Email]

END
GO
/****** Object:  StoredProcedure [dbo].[sp_Unit_Clear]    Script Date: 1/23/2021 11:57:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_Unit_Clear]
	-- Add the parameters for the stored procedure here
	@MovieId bigint,
	@UserId bigint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DELETE FROM [dbo].[Vote]
      WHERE [MovieId]=@MovieId OR [UserId]=@UserId
	DELETE FROM [dbo].[Movie]
		  WHERE [Id] = @MovieId
	DELETE FROM [dbo].[User]
		  WHERE [Id] = @UserId
END
GO
/****** Object:  StoredProcedure [dbo].[sp_User_Add]    Script Date: 1/23/2021 11:57:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_User_Add]
	-- Add the parameters for the stored procedure here
	@Email nvarchar(200),
	@Password nvarchar(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	INSERT INTO [dbo].[User] ([Email] ,[Password]) VALUES (@Email,@Password)
END
GO
/****** Object:  StoredProcedure [dbo].[sp_User_Get]    Script Date: 1/23/2021 11:57:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_User_Get]
	-- Add the parameters for the stored procedure here
	@Email nvarchar(200)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SELECT [Id]
		  ,[Email]
		  ,[Password]
	  FROM [dbo].[User]
	  WHERE [Email] = @Email
END
GO
/****** Object:  StoredProcedure [dbo].[sp_Vote_Add]    Script Date: 1/23/2021 11:57:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_Vote_Add]
	-- Add the parameters for the stored procedure here
	@MovieId bigint,
	@UserId bigint,
	@IsUpVote bit
AS
BEGIN
	IF EXISTS (SELECT * FROM [dbo].[Vote] WHERE [dbo].[Vote].[MovieId]=@MovieId AND [UserId] = @UserId)
	BEGIN
		UPDATE [dbo].[Vote]
		   SET [IsUpVote] = @IsUpVote
		 WHERE [dbo].[Vote].[MovieId]=@MovieId AND [UserId] = @UserId
	END
	ELSE
	BEGIN
	INSERT INTO [dbo].[Vote]
			   ([MovieId]
			   ,[UserId]
			   ,[IsUpVote])
		 VALUES
			   (@MovieId
			   ,@UserId
			   ,@IsUpVote)
	END
END
GO
USE [master]
GO
ALTER DATABASE [FunnyMovie] SET  READ_WRITE 
GO
