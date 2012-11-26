var vine = require("vine"),
reqOutcome = require("./reqOutcome"),
step = require("step"),
dust = require("dustjs-linkedin"),
fs = require("fs");

exports.plugin = function(Account, LostPassword, httpServer, emailer, loader) {

	if(!emailer) return;

	//register the dust tpl ~ fugly >.>
	eval(dust.compile(fs.readFileSync(loader.params("http.lostPasswordEmailTpl"), "utf8"), "lostPasswordEmailTpl"));


	httpServer.get("/lost_password", function(req, res) {
		res.render("lost_password");
	});

	httpServer.post("/lost_password", function(req, res) {
		var on = reqOutcome(req, res, "lost_password");

		step(
			function() {
				Account.findOne({ email: req.body.email }, this);
			},
			on.success(function(account) {
				if(!account) return on(new Error("account does not exist"));
				this.account = account;

				var lostPassword = new LostPassword({ account: account._id });

				lostPassword.save(this);
			}),
			on.success(function(lostPassword) {
				var next = this;

				dust.render("lostPasswordEmailTpl", { email: "email", token: lostPassword._id }, this);

			}),
			on.success(function(tpl) {
				var next = this;
				emailer.send({
					to: this.account.email,
					subject: "Reset Password",
					htmlBody: tpl
				}, function(err) {
					if(err) return on(new Error("Unable to send password recovery email"));
					next();
				})
			}),
			on.success(function() {
				res.render("lost_password_sent", {
					email: this.account.email
				});
			})
		);
	});
}