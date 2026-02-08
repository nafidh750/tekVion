(function () {
	"use strict";

	var defaultSettings = {
		address: "Sapphire Tower, Dubai, UAE",
		phone: "+971 522 900 966",
		email: "Info@tekvion.ae",
		we_do_intro: "We design and deliver end-to-end digital transformation solutions.",
		about_intro:
			"We design and deliver end-to-end digital transformation solutions—strategy, cloud, data, and automation—helping organizations modernize, scale, and achieve measurable business outcomes.",
	};

	function buildPhoneHref(phone) {
		if (!phone) return "javascript:void(0)";
		return "tel:" + phone.replace(/[\s()-]/g, "");
	}

	function buildEmailHref(email) {
		if (!email) return "javascript:void(0)";
		return "mailto:" + email;
	}

	function applySettings(settings) {
		document.querySelectorAll("[data-setting]").forEach(function (el) {
			var key = el.getAttribute("data-setting");
			if (Object.prototype.hasOwnProperty.call(settings, key)) {
				el.textContent = settings[key];
			}
		});

		var phoneHref = buildPhoneHref((settings.phone || "").trim());
		document.querySelectorAll('[data-contact-link="phone"]').forEach(function (el) {
			el.setAttribute("href", phoneHref);
		});

		var emailHref = buildEmailHref((settings.email || "").trim());
		document.querySelectorAll('[data-contact-link="email"]').forEach(function (el) {
			el.setAttribute("href", emailHref);
		});
	}

	function applyContactAction() {
		var action = document.body.dataset.contactAction;
		if (!action) return;
		document.querySelectorAll("[data-contact-form]").forEach(function (form) {
			form.setAttribute("action", action);
		});
	}

	function fetchSettings(apiUrl, setSettings) {
		if (!apiUrl) return;
		fetch(apiUrl, { headers: { Accept: "application/json" } })
			.then(function (response) {
				if (!response.ok) {
					console.warn("TekVion content fetch failed with status", response.status);
					return null;
				}
				return response.json();
			})
			.then(function (data) {
				if (data && data.settings) {
					setSettings(function (prev) {
						return Object.assign({}, prev, data.settings);
					});
				}
			})
			.catch(function (error) {
				console.warn("TekVion content fetch failed", error);
			});
	}

	function TekvionApp() {
		var _React = window.React;
		var apiUrl = document.body.dataset.apiUrl || "/api/content?type=all";
		var _useState = _React.useState,
			settingsState = _useState(defaultSettings),
			settings = settingsState[0],
			setSettings = settingsState[1];
		var _useEffect = _React.useEffect;

		_useEffect(function () {
			applySettings(settings);
		}, [settings]);

		_useEffect(function () {
			applyContactAction();
			fetchSettings(apiUrl, setSettings);
		}, [apiUrl]);

		return null;
	}

	function initReact() {
		if (!window.React || !window.ReactDOM) {
			console.warn("React is not available.");
			return;
		}
		var root = document.getElementById("tekvion-react-root");
		if (!root) {
			root = document.createElement("div");
			root.id = "tekvion-react-root";
			root.style.display = "none";
			document.body.appendChild(root);
		}
		if (window.ReactDOM.createRoot) {
			window.ReactDOM.createRoot(root).render(window.React.createElement(TekvionApp));
		} else {
			window.ReactDOM.render(window.React.createElement(TekvionApp), root);
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initReact);
	} else {
		initReact();
	}
})();
