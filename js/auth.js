/*---------------------------------------------------------------------
   auth.js – Login, Signup, Forgot password
   Button ripple, form validation, subtle animations
---------------------------------------------------------------------*/

(function () {
	"use strict";

	// ----- Button ripple effect -----
	function createRipple(ev, btn) {
		var ripple = document.createElement("span");
		ripple.className = "auth-btn-ripple";
		var rect = btn.getBoundingClientRect();
		var size = Math.max(rect.width, rect.height);
		var x = ev.clientX - rect.left - size / 2;
		var y = ev.clientY - rect.top - size / 2;
		ripple.style.width = ripple.style.height = size + "px";
		ripple.style.left = x + "px";
		ripple.style.top = y + "px";
		btn.style.position = "relative";
		btn.style.overflow = "hidden";
		btn.appendChild(ripple);
		setTimeout(function () {
			if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
		}, 600);
	}

	$(document).on("click", ".auth-btn", function (e) {
		if (!this.querySelector(".auth-btn-ripple")) createRipple(e, this);
	});

	// ----- Form submit handlers (demo – no backend) -----
	$("#loginForm").on("submit", function (e) {
		e.preventDefault();
		// Demo: show brief feedback
		var btn = $(this).find(".auth-btn");
		var orig = btn.html();
		btn.prop("disabled", true).html('<span>Signing in...</span> <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
		setTimeout(function () {
			btn.prop("disabled", false).html(orig);
			// In real app: redirect or show error/success
		}, 1200);
	});

	$("#signupForm").on("submit", function (e) {
		e.preventDefault();
		var pass = $("#signupPassword").val();
		var confirm = $("#signupConfirm").val();
		if (pass !== confirm) {
			var $confirm = $("#signupConfirm");
			$confirm.addClass("auth-error").focus();
			setTimeout(function () { $confirm.removeClass("auth-error"); }, 600);
			return;
		}
		$("#signupConfirm").removeClass("auth-error");
		var btn = $(this).find(".auth-btn");
		var orig = btn.html();
		btn.prop("disabled", true).html('<span>Creating account...</span> <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
		setTimeout(function () {
			btn.prop("disabled", false).html(orig);
		}, 1200);
	});

	$("#forgotForm").on("submit", function (e) {
		e.preventDefault();
		var btn = $(this).find(".auth-btn");
		var orig = btn.html();
		btn.prop("disabled", true).html('<span>Sending...</span> <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
		setTimeout(function () {
			btn.prop("disabled", false).html(orig);
		}, 1500);
	});

	// ----- Input focus glow (optional enhancement) -----
	$(".auth-form .form-control").on("focus", function () {
		$(this).parent().addClass("auth-input-focused");
	}).on("blur", function () {
		$(this).parent().removeClass("auth-input-focused");
	});

	// ----- Stagger card elements on load -----
	$(function () {
		$(".auth-card").addClass("auth-card--visible");
	});
})();
