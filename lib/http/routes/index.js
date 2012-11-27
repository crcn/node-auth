var step = require("step"),
vine = require("vine"),
reqOutcome = require("./reqOutcome"),
dust = require("dustjs-linkedin"),
step = require("step"),
fs = require("fs");

exports.plugin = function(httpServer, emailer, auth, loader) {

	var Account = auth.Account;

	eval(dust.compile(fs.readFileSync(loader.params("http.validateEmailTpl"), "utf8"), "validateEmailTpl"));



	function getToken(req, res, account, render) {
		account.getMainToken(function(err, token) {
			if(err) return res.render(render, {
				error: err.message
			});

			req.session.token = token.key;
			res.redirect(req.query.redirect_to || loader.params("http.loginRedirect") || "/");
		});
	}


	httpServer.get("/referral/:account", function(req, res, next) {
		//is object id
		if(req.params.account.length == 24)
		req.session.referredBy = req.params.account;
		res.redirect(loader.params("referralRedirect") || "/"); //home
	});


	httpServer.get("/login", function(req, res) {
		res.render("login", {
			redirect_to: req.query.redirect_to
		});
	});

	httpServer.post("/login", function(req, res) {
		Account.login(req.body, reqOutcome(req, res, "login").success(function(acc) {
			getToken(req, res, acc, "login");
		}));
	});

	httpServer.get("/signup", function(req, res) {
		console.log(req.session.referredBy)
		res.render("signup", {
			referredBy: req.session.referredBy
		});
	});

	httpServer.get("/validate_account", function(req, res) {
		var on = reqOutcome(req, res, "validate_account");

		step(
			function() {
				Account.findOne({ _id: req.query.account }, this);
			},
			on.success(function(account) {
				if(!account) return on(new Error("account does not exist"));
				if(account.validated) return on(new Error("this account has already been validated"));
				// console.log(account.validationKey)
				if(account.validationKey != req.query.validationKey) return on(new Error("incorrect validation key"));
				account.validatedAt = new Date();
				account.validated = true;
				account.save(this);
				Account.emit("validated", account);
			}),
			on.success(function(account) {
				res.render("validate_account", {
					account: account
				});
			})
		);
	});


	httpServer.post("/signup", function(req, res) {
		req.body.referredBy = req.session.referredBy;
		var acc = new Account(req.body),
		on = reqOutcome(req, res, "signup");

		acc.save(reqOutcome(req, res, "signup").success(function(acc) {
			getToken(req, res, acc, "signup");
		}));


		step(
			function() {
				dust.render("validateEmailTpl", { validationKey: acc.validationKey, accountId: acc._id }, this);
			},
			function(err, tpl) {
				if(err) return console.error(err);
				var next = this;

				emailer.send({
					to: acc.email,
					subject: "Validate Account",
					htmlBody: tpl
				}, function(err) {
					if(err) console.error(err)
					next();
				});

			},
			function() {

			}
		);
	});


	require("./lostPassword").plugin(Account, auth.LostPassword, httpServer, emailer, loader);
}