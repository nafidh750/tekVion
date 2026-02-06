/*---------------------------------------------------------------------
   anime-init.js – Anime.js tech-themed animations for TekVion
---------------------------------------------------------------------*/
(function () {
	"use strict";

	if (typeof anime === "undefined") return;

	// ----- Hero carousel: stagger animate caption when slide becomes active -----
	function initHeroCarousel() {
		var carousel = document.getElementById("myCarousel");
		if (!carousel) return;

		function animateActiveBluid() {
			var activeItem = carousel.querySelector(".carousel-item.active .bluid");
			if (!activeItem) return;
			var h1 = activeItem.querySelector("h1");
			var p = activeItem.querySelector("p");
			var links = activeItem.querySelectorAll(".read_more");
			var els = [h1, p].filter(Boolean);
			Array.prototype.push.apply(els, links ? [].slice.call(links) : []);

			els.forEach(function (el) {
				el.style.opacity = "0";
				el.style.transform = "translateY(24px)";
			});

			anime({
				targets: els,
				opacity: [0, 1],
				translateY: [24, 0],
				duration: 700,
				easing: "easeOutCubic",
				delay: anime.stagger(120),
			});
		}

		// Initial active slide
		setTimeout(animateActiveBluid, 400);

		// On slide change (Bootstrap 4 carousel)
		$(carousel).on("slid.bs.carousel", function () {
			animateActiveBluid();
		});
	}

	// ----- Solution cards: stagger when grid enters view -----
	function initSolutionCards() {
		var grid = document.querySelector(".solutions-grid");
		if (!grid) return;

		var cards = grid.querySelectorAll(".solution-card");
		if (!cards.length) return;

		cards.forEach(function (c) {
			c.style.opacity = "0";
			c.style.transform = "translateY(28px)";
		});

		var observer = new IntersectionObserver(
			function (entries) {
				if (!entries[0].isIntersecting) return;
				observer.disconnect();
				anime({
					targets: cards,
					opacity: [0, 1],
					translateY: [28, 0],
					duration: 580,
					easing: "easeOutCubic",
					delay: anime.stagger(70),
				});
			},
			{ threshold: 0.2 }
		);
		observer.observe(grid);
	}

	// ----- About section (index): cards and intro stagger -----
	function initAboutSection() {
		if (document.querySelector(".about_executive")) return; // inner about page uses initAboutPage
		var about = document.querySelector(".about");
		if (!about) return;

		var intro = about.querySelector(".about_intro");
		var cards = about.querySelectorAll(".about_card");
		var title = about.querySelector(".titlepage h2");

		var targets = [title, intro].filter(Boolean);
		targets.forEach(function (el) {
			el.style.opacity = "0";
			el.style.transform = "translateY(20px)";
		});
		cards.forEach(function (c) {
			c.style.opacity = "0";
			c.style.transform = "translateY(24px)";
		});

		var observer = new IntersectionObserver(
			function (entries) {
				if (!entries[0].isIntersecting) return;
				observer.disconnect();
				anime({
					targets: targets,
					opacity: [0, 1],
					translateY: [20, 0],
					duration: 600,
					easing: "easeOutCubic",
					delay: anime.stagger(100),
				});
				anime({
					targets: cards,
					opacity: [0, 1],
					translateY: [24, 0],
					duration: 600,
					easing: "easeOutCubic",
					delay: anime.stagger(120, { start: 200 }),
				});
			},
			{ threshold: 0.15 }
		);
		observer.observe(about);
	}

	// ----- Inner page hero (compliance / value-proposition): stagger -----
	function initInnerHero() {
		var hero = document.querySelector(".compliance-hero-inner");
		if (!hero) return;

		var h1 = hero.querySelector("h1");
		var p = hero.querySelector("p");
		if (!h1 && !p) return;

		var els = [h1, p].filter(Boolean);
		els.forEach(function (el) {
			el.style.opacity = "0";
			el.style.transform = "translateY(22px)";
		});

		anime({
			targets: els,
			opacity: [0, 1],
			translateY: [22, 0],
			duration: 700,
			easing: "easeOutCubic",
			delay: anime.stagger(150),
		});
	}

	// ----- Compliance / value-proposition cards: stagger when in view -----
	function initComplianceCards() {
		var list = document.querySelector(".compliance-list .compliance-cards");
		if (!list) return;

		var cards = list.querySelectorAll(".compliance-card");
		if (!cards.length) return;

		cards.forEach(function (c) {
			c.style.opacity = "0";
			c.style.transform = "translateY(26px)";
		});

		var observer = new IntersectionObserver(
			function (entries) {
				if (!entries[0].isIntersecting) return;
				observer.disconnect();
				anime({
					targets: cards,
					opacity: [0, 1],
					translateY: [26, 0],
					duration: 600,
					easing: "easeOutCubic",
					delay: anime.stagger(90),
				});
			},
			{ threshold: 0.12 }
		);
		observer.observe(list);
	}

	// ----- About page: executive + cards -----
	function initAboutPage() {
		var exec = document.querySelector(".about_executive");
		if (!exec) return;

		var title = exec.querySelector(".about_executive_title");
		var company = exec.querySelector(".about_executive_company");
		var text = exec.querySelector(".about_executive_text");
		var cards = document.querySelectorAll(".about_card");
		var els = [title, company, text].filter(Boolean);

		els.forEach(function (el) {
			el.style.opacity = "0";
			el.style.transform = "translateY(18px)";
		});
		cards.forEach(function (c) {
			c.style.opacity = "0";
			c.style.transform = "translateY(22px)";
		});

		var observer = new IntersectionObserver(
			function (entries) {
				if (!entries[0].isIntersecting) return;
				observer.disconnect();
				anime({
					targets: els,
					opacity: [0, 1],
					translateY: [18, 0],
					duration: 580,
					easing: "easeOutCubic",
					delay: anime.stagger(100),
				});
				anime({
					targets: cards,
					opacity: [0, 1],
					translateY: [22, 0],
					duration: 580,
					easing: "easeOutCubic",
					delay: anime.stagger(110, { start: 350 }),
				});
			},
			{ threshold: 0.1 }
		);
		observer.observe(exec);
	}

	// ----- .read_more button: 360° rotate on hover is handled by CSS (style.css) -----
	function initReadMoreButtons() {
		// No JS hover needed; CSS applies transform: rotate(360deg) on hover
	}

	// ----- What we do intro: subtle fade-up when in view -----
	function initWeDoIntro() {
		var weDo = document.getElementById("what-we-do");
		if (!weDo) return;

		var intro = weDo.querySelector(".we_do_intro");
		if (!intro) return;

		intro.style.opacity = "0";
		intro.style.transform = "translateY(16px)";

		var observer = new IntersectionObserver(
			function (entries) {
				if (!entries[0].isIntersecting) return;
				observer.disconnect();
				anime({
					targets: intro,
					opacity: [0, 1],
					translateY: [16, 0],
					duration: 650,
					easing: "easeOutCubic",
				});
			},
			{ threshold: 0.2 }
		);
		observer.observe(weDo);
	}

	// ----- Why Choose Tekvion: stagger boxes when in view -----
	function initChoseSection() {
		var chose = document.querySelector(".chose");
		if (!chose) return;

		var boxes = chose.querySelectorAll(".chose_box");
		if (!boxes.length) return;

		boxes.forEach(function (el) {
			el.style.opacity = "0";
			el.style.transform = "translateY(20px)";
		});

		var observer = new IntersectionObserver(
			function (entries) {
				if (!entries[0].isIntersecting) return;
				observer.disconnect();
				anime({
					targets: boxes,
					opacity: [0, 1],
					translateY: [20, 0],
					duration: 560,
					easing: "easeOutCubic",
					delay: anime.stagger(100),
				});
			},
			{ threshold: 0.15 }
		);
		observer.observe(chose);
	}

	// ----- Run after DOM ready -----
	function run() {
		initHeroCarousel();
		initSolutionCards();
		initAboutSection();
		initChoseSection();
		initInnerHero();
		initComplianceCards();
		initAboutPage();
		initReadMoreButtons();
		initWeDoIntro();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", run);
	} else {
		run();
	}
})();
