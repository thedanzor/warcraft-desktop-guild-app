module.exports = `
	<div class="app_login">
		<h1> Warcraft Guild Manager</h1>
		<h2> Login to your account</h2>

		<div class="login_panel">
			<div class="battlenet">
				<img class="logo" src="assests/img/battlenet.jpg" alt="Blizzard Login" />
				<button class="login-bnet secondary"> Login with battle.net </button>
				<p class="extra_info">
					<i class="icon-info"></i>
					 Privacy & Account Information
					<div class="tool_tip">
						 You will be directed to the Battle.net official login, from there you can authenticate this app.
						 This will give the application a list of your characters, guilds and ranking. No other information is given and no information is stored.
					</div>
				</p>
			</div>
			<div class="login_form">
				<h3> Manager Account </h3>
				<form>
					<input placeholder="Username or Email Address" />
					<input placeholder="Account Password" />
					<button class="primary"> Login </button>
				</form>
			</div>
			<img src="assests/img/or.png" class="login_or" />
		</div>
		<div class="app_info"> Warcraft Guild Manager is an Open Sourced Javascript application. Created by Scott Jones </div>
	</div>
`;
