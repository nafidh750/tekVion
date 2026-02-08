document.addEventListener("alpine:init", function () {
	Alpine.data("tekvionApp", function () {
		return {
			apiUrl: "",
			settings: {
				address: "Sapphire Tower, Dubai, UAE",
				phone: "+971 522 900 966",
				email: "Info@tekvion.ae",
				we_do_intro: "We design and deliver end-to-end digital transformation solutions.",
				about_intro:
					"We design and deliver end-to-end digital transformation solutions—strategy, cloud, data, and automation—helping organizations modernize, scale, and achieve measurable business outcomes.",
			},
			phoneLink: "tel:+971522900966",
			emailLink: "mailto:Info@tekvion.ae",
			init: function () {
				this.apiUrl = (document.body && document.body.dataset.apiUrl) || "api/get_content.php?type=all";
				this.refreshContactLinks();
				this.fetchContent();
			},
			refreshContactLinks: function () {
				var phone = (this.settings.phone || "").trim();
				if (phone) {
					this.phoneLink = "tel:" + phone.replace(/[\s()-]/g, "");
				}
				var email = (this.settings.email || "").trim();
				if (email) {
					this.emailLink = "mailto:" + email;
				}
			},
			fetchContent: async function () {
				if (!this.apiUrl) return;
				try {
					var response = await fetch(this.apiUrl, {
						headers: { Accept: "application/json" },
					});
					if (!response.ok) return;
					var data = await response.json();
					if (data && data.settings) {
						this.settings = Object.assign({}, this.settings, data.settings);
						this.refreshContactLinks();
					}
				} catch (error) {}
			},
		};
	});
});
