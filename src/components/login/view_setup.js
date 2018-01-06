module.exports = `
	<div class="app_login">
		<h1> Warcraft Guild Manager</h1>
		<h2> Login to your account</h2>

		<div class="login_panel">
			<div class="setup_wrapper">
				<div class="setup_inner">
					<h3> Setup Application </h3>
					<p> This is your first time using this app, as a result we need to take some time to set it up. You will need to fill in your Blizzard Private and Public API key to continue. </p>
					<input type="password" name="api-key" class="med api_field" placeholder="Enter your Blizzard API Public Key">
					<input type="password" name="api-secret" class="med secret_field" placeholder="Enter your Blizzard API Secret Key">

					<button type="submit" class="primary submit_button"> Submit </button>
				</div>
			</div>
		</div>
		<div class="app_info"> Warcraft Guild Manager is an Open Sourced Javascript application. Created by Scott Jones </div>
	</div>
`;
