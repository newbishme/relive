<html>
<head>
	<style>
	body{
		background:#374F59;
		color:white;
	}
	body,h1,h2,h3,h4,h5,h6{font-family:Oxygen,Roboto,"Helvetica Neue",Helvetica,Arial,sans-serif}
	.container{margin:auto;width:300px;padding-top:200px;}
	.landing-header .landing-title {
    font-family: 'Patua One' !important;
    font-size: 10vh;
    font-weight: 400;
    margin: 0;
	}
	input {
		border-radius: 4px;
		outline: none;
		border: none;
		line-height: 23px;
		padding: 0px 4px;
		margin: 4px 0px;
	}
	</style>
</head>
<body>
	<div class="container">
		<h1 class="landing-title">moderator panel</h1>
		<form method='post'>
			<label>Username: <input type='text' name='username' required></br>
			<label>Password: <input type='password' name='password' required></br>
			<input type="submit" value="LOGIN"></br>
			<?php if ($error) { echo $error; } ?>
		</form>
	</div>
</body>
</html>