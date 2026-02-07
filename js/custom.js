/*---------------------------------------------------------------------
   File Name: custom.js
   TekVion – Site behavior and initializations
---------------------------------------------------------------------*/

$(function () {
	"use strict";

	// ----- Mobile nav: ensure menu toggles on all pages (works with or without Bootstrap) -----
	(function () {
		var toggler = document.querySelector('.navbar-toggler[data-target="#navbarsExample04"]');
		var menu = document.getElementById("navbarsExample04");
		if (!toggler || !menu || toggler._mobileNavHandled) return;
		function closeMenu() {
			menu.classList.remove("show");
			toggler.setAttribute("aria-expanded", "false");
			toggler.setAttribute("aria-label", "Open menu");
		}
		function openMenu() {
			menu.classList.add("show");
			toggler.setAttribute("aria-expanded", "true");
			toggler.setAttribute("aria-label", "Close menu");
		}
		toggler.addEventListener("click", function (e) {
			e.preventDefault();
			e.stopPropagation();
			if (menu.classList.contains("show")) closeMenu();
			else openMenu();
		});
		document.addEventListener("click", function (e) {
			if (menu.classList.contains("show") && !menu.contains(e.target) && !toggler.contains(e.target)) closeMenu();
		});
	})();

	// ----- Preloader (hide quickly – index uses inline script; this is fallback for other pages) -----
	function hideLoader() {
		var $loader = $(".loader_bg");
		if (!$loader.length) return;
		$loader.addClass("loader-js-hiding").css("pointer-events", "none");
		$loader.fadeOut(300, function () {
			$loader.remove();
		});
	}
	setTimeout(hideLoader, 380);
	$(window).on("load", function () {
		setTimeout(hideLoader, 80);
	});

	// ----- AOS (Animate on Scroll) – delay so first paint stays fast -----
	if (typeof AOS !== "undefined") {
		var initAOS = function () {
			AOS.init({ duration: 800, easing: "ease-in-out", once: true });
		};
		if (typeof requestIdleCallback !== "undefined") {
			requestIdleCallback(initAOS, { timeout: 400 });
		} else {
			setTimeout(initAOS, 100);
		}
	}

	// ----- Scroll dropdown effect for cards and components -----
	(function initScrollDrop() {
		var elements = [];

		// Standalone components (single drop)
		var selectors = [
			".about_executive",
			".titlepage",
			".we_do_intro",
			".compliance-hero-inner",
			".compliance-cta",
			".clientsl_text",
			".chose_intro",
			".about_intro",
			".service-card",
		];
		selectors.forEach(function (sel) {
			try {
				document.querySelectorAll(sel).forEach(function (el) {
					if (!el.classList.contains("scroll-drop")) {
						el.classList.add("scroll-drop");
						elements.push(el);
					}
				});
			} catch (e) {}
		});

		// Grid sections: drop + stagger on direct children
		var staggerConfig = [
			".solutions-grid",
			".about_vm",
			".chose .row.d_flex",
			".compliance-list .compliance-cards",
		];
		staggerConfig.forEach(function (parentSel) {
			try {
				document.querySelectorAll(parentSel).forEach(function (parent) {
					if (!parent.children.length) return;
					parent.classList.add("scroll-drop-stagger");
					for (var i = 0; i < parent.children.length; i++) {
						var child = parent.children[i];
						if (!child.classList.contains("scroll-drop")) {
							child.classList.add("scroll-drop");
							elements.push(child);
						}
					}
				});
			} catch (e) {}
		});

		if (elements.length === 0) return;
		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) entry.target.classList.add("is-visible");
				});
			},
			{ threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
		);
		elements.forEach(function (el) {
			observer.observe(el);
		});
	})();

	// ----- Particles.js (hero background) – delay init so first paint is faster -----
	if (typeof particlesJS !== "undefined") {
		var runParticles = function () {
			particlesJS("particles-js", {
				particles: {
					number: { value: 50, density: { enable: true, value_area: 900 } },
				color: { value: "#18A4F9" },
				shape: { type: "circle" },
				opacity: { value: 0.5 },
				size: { value: 3 },
				line_linked: {
					enable: true,
					distance: 150,
					color: "#18A4F9",
					opacity: 0.4,
					width: 1,
				},
				move: { enable: true, speed: 2 },
			},
			interactivity: {
				detect_on: "canvas",
				events: {
					onhover: { enable: true, mode: "grab" },
					onclick: { enable: true, mode: "push" },
				},
				modes: {
					grab: { distance: 140, line_linked: { opacity: 0.6 } },
					push: { particles_nb: 4 },
				},
			},
			retina_detect: true,
			});
		};
		if (typeof requestIdleCallback !== "undefined") {
			requestIdleCallback(runParticles, { timeout: 600 });
		} else {
			setTimeout(runParticles, 200);
		}
	}

	// ----- Hero background rotation (5 sec) -----
	var $rotator = $(".banner_bg_rotator");
	if ($rotator.length) {
		var $slides = $rotator.find(".banner_bg_slide");
		var total = $slides.length;
		if (total > 1) {
			setInterval(function () {
				var $active = $rotator.find(".banner_bg_slide--active");
				$active.removeClass("banner_bg_slide--active");
				var next = ($active.index() + 1) % total;
				$slides.eq(next).addClass("banner_bg_slide--active");
			}, 5000);
		}
	}

	// ----- Typed.js (headline typing, if element exists) -----
	if (typeof Typed !== "undefined" && $("#typed").length) {
		new Typed("#typed", {
			strings: ["Creative Work Idea", "Cutting-edge Technology", "Beautiful Design"],
			typeSpeed: 60,
			backSpeed: 30,
			backDelay: 2000,
			loop: true,
		});
	}

	// ----- Tooltips -----
	$("[data-toggle='tooltip']").tooltip();

	// ----- Megamenu overlay -----
	$(".main-menu ul li.megamenu")
		.mouseover(function () {
			if (!$(this).parent().hasClass("#wrapper")) {
				$("#wrapper").addClass("overlay");
			}
		})
		.mouseleave(function () {
			$("#wrapper").removeClass("overlay");
		});

	// ----- Scroll to top -----
	$(window).on("scroll", function () {
		var scroll = $(window).scrollTop();
		if (scroll >= 100) {
			$("#back-to-top").addClass("b-show_scrollBut");
		} else {
			$("#back-to-top").removeClass("b-show_scrollBut");
		}
	});
	$("#back-to-top").on("click", function () {
		$("body, html").animate({ scrollTop: 0 }, 1000);
	});

	// ----- Countdown (if used) -----
	$("[data-countdown]").each(function () {
		var $this = $(this),
			finalDate = $(this).data("countdown");
		$this.countdown(finalDate, function (event) {
			$this.html(
				event.strftime(
					'<div class="time-bar"><span class="time-box">%w</span> <span class="line-b">weeks</span></div> ' +
						'<div class="time-bar"><span class="time-box">%d</span> <span class="line-b">days</span></div> ' +
						'<div class="time-bar"><span class="time-box">%H</span> <span class="line-b">hr</span></div> ' +
						'<div class="time-bar"><span class="time-box">%M</span> <span class="line-b">min</span></div> ' +
						'<div class="time-bar"><span class="time-box">%S</span> <span class="line-b">sec</span></div>'
				)
			);
		});
	});

	// ----- Sidebar toggle -----
	$("#sidebarCollapse").on("click", function () {
		$("#sidebar").toggleClass("active");
		$(this).toggleClass("active");
	});

	// ----- Blog carousel -----
	$("#blogCarousel").carousel({ interval: 5000 });
});

// ----- Side panel (open/close) -----
function openNav() {
	document.getElementById("mySidepanel").style.width = "250px";
}

function closeNav() {
	document.getElementById("mySidepanel").style.width = "0";
}
