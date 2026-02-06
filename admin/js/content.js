/*---------------------------------------------------------------------
   Tekvion CMS – Content load/save (localStorage)
   Populates forms from Admin.getContent(), saves with Admin.saveContent()
---------------------------------------------------------------------*/

(function () {
	'use strict';

	var DEFAULT_SERVICES = [
		{ title: 'AI & Machine Learning', desc: 'Applied AI and ML solutions to automate decisions, personalize experiences and unlock new revenue streams.', image: 'images/AI & Machine-Learning.jpeg' },
		{ title: 'Cloud Computing', desc: 'Cloud strategy, migration and managed services to build resilient, scalable platforms for modern apps.', image: 'images/Cloud-Computing.jpeg' },
		{ title: 'Big Data & Analytics', desc: 'Scalable data platforms and analytics pipelines that turn raw data into actionable business insight.', image: 'images/BigData & Analytics.jpeg' },
		{ title: 'Cybersecurity', desc: 'Comprehensive security services to protect data, secure applications and manage risk across your estate.', image: 'images/CyberSecurity.jpeg' },
		{ title: 'API & Integration', desc: 'Connect platforms and workflows with secure APIs, integrations, and scalable orchestration.', image: "images/API's & System Integration.jpeg" },
		{ title: 'Mobile & Web Development', desc: 'Modern web and mobile products with exceptional UX, scalable architecture and rapid delivery.', image: 'images/Mobile & Web Development.jpeg' },
		{ title: 'Intelligent Automation', desc: 'Streamline operations with workflow automation, RPA, and AI-driven process optimization.', image: 'images/Automations.jpeg' },
		{ title: 'IT & Infrastructure', desc: 'Resilient infrastructure, observability, and managed services to keep systems secure and fast.', image: 'images/It & Infrastructures Services.webp' }
	];

	var DEFAULT_TESTIMONIALS = [
		{ name: 'Nafidh', text: 'Tekvion transformed our digital infrastructure with their exceptional cloud and AI solutions. Their end-to-end approach to digital transformation delivered measurable business outcomes within months. Highly recommended for enterprises seeking quality and expertise.', image: 'images/clint.jpg' },
		{ name: 'Nafidh', text: 'Tekvion transformed our digital infrastructure with their exceptional cloud and AI solutions. Their end-to-end approach to digital transformation delivered measurable business outcomes within months. Highly recommended for enterprises seeking quality and expertise.', image: 'images/clint.jpg' },
		{ name: 'Nafidh', text: 'Tekvion transformed our digital infrastructure with their exceptional cloud and AI solutions. Their end-to-end approach to digital transformation delivered measurable business outcomes within months. Highly recommended for enterprises seeking quality and expertise.', image: 'images/clint.jpg' }
	];

	function showAlert(message, type) {
		type = type || 'success';
		var el = document.getElementById('contentAlert');
		if (!el) return;
		el.className = 'admin-alert admin-alert-' + type;
		el.textContent = message;
		el.style.display = 'flex';
		setTimeout(function () { el.style.display = 'none'; }, 4000);
	}

	function loadContent() {
		if (typeof Admin === 'undefined') return;
		var c = Admin.getContent();
		// Homepage
		if (c.heroTitle1) document.getElementById('heroTitle1').value = c.heroTitle1;
		if (c.heroDesc1) document.getElementById('heroDesc1').value = c.heroDesc1;
		if (c.weDoIntro) document.getElementById('weDoIntro').value = c.weDoIntro;
		if (c.aboutIntro) document.getElementById('aboutIntro').value = c.aboutIntro;
		// Settings
		if (c.settingAddress) document.getElementById('settingAddress').value = c.settingAddress;
		if (c.settingPhone) document.getElementById('settingPhone').value = c.settingPhone;
		if (c.settingEmail) document.getElementById('settingEmail').value = c.settingEmail;
		if (c.settingCopyright) document.getElementById('settingCopyright').value = c.settingCopyright;
		// Services
		var services = c.services ? (typeof c.services === 'string' ? JSON.parse(c.services) : c.services) : DEFAULT_SERVICES;
		renderServices(services);
		// Testimonials
		var testimonials = c.testimonials ? (typeof c.testimonials === 'string' ? JSON.parse(c.testimonials) : c.testimonials) : DEFAULT_TESTIMONIALS;
		renderTestimonials(testimonials);
	}

	function renderServices(list) {
		var container = document.getElementById('servicesList');
		if (!container) return;
		container.innerHTML = '';
		(list || DEFAULT_SERVICES).forEach(function (s, i) {
			var div = document.createElement('div');
			div.className = 'admin-card-body';
			div.style.borderBottom = '1px solid var(--admin-border)';
			div.style.marginBottom = '16px';
			div.style.paddingBottom = '16px';
			div.innerHTML =
				'<div class="admin-form-group"><label>Service ' + (i + 1) + ' – Title</label><input type="text" class="service-title" data-idx="' + i + '" value="' + (s.title || '').replace(/"/g, '&quot;') + '" placeholder="Title"></div>' +
				'<div class="admin-form-group"><label>Description</label><textarea class="service-desc" data-idx="' + i + '" rows="2" placeholder="Description">' + (s.desc || '').replace(/</g, '&lt;') + '</textarea></div>' +
				'<div class="admin-form-group"><label>Image path</label><input type="text" class="service-image" data-idx="' + i + '" value="' + (s.image || '').replace(/"/g, '&quot;') + '" placeholder="images/..."></div>';
			container.appendChild(div);
		});
	}

	function renderTestimonials(list) {
		var container = document.getElementById('testimonialsList');
		if (!container) return;
		container.innerHTML = '';
		(list || DEFAULT_TESTIMONIALS).forEach(function (t, i) {
			var div = document.createElement('div');
			div.className = 'admin-card-body';
			div.style.borderBottom = '1px solid var(--admin-border)';
			div.style.marginBottom = '16px';
			div.style.paddingBottom = '16px';
			div.innerHTML =
				'<div class="admin-form-group"><label>Testimonial ' + (i + 1) + ' – Name</label><input type="text" class="testimonial-name" data-idx="' + i + '" value="' + (t.name || '').replace(/"/g, '&quot;') + '" placeholder="Name"></div>' +
				'<div class="admin-form-group"><label>Quote</label><textarea class="testimonial-text" data-idx="' + i + '" rows="3" placeholder="Quote">' + (t.text || '').replace(/</g, '&lt;') + '</textarea></div>' +
				'<div class="admin-form-group"><label>Image path</label><input type="text" class="testimonial-image" data-idx="' + i + '" value="' + (t.image || '').replace(/"/g, '&quot;') + '" placeholder="images/..."></div>';
			container.appendChild(div);
		});
	}

	function getServicesFromForm() {
		var list = [];
		for (var i = 0; i < 8; i++) {
			var titleInp = document.querySelector('#servicesList .service-title[data-idx="' + i + '"]');
			var descInp = document.querySelector('#servicesList .service-desc[data-idx="' + i + '"]');
			var imgInp = document.querySelector('#servicesList .service-image[data-idx="' + i + '"]');
			list.push({
				title: titleInp ? titleInp.value : '',
				desc: descInp ? descInp.value : '',
				image: imgInp ? imgInp.value : ''
			});
		}
		return list;
	}

	function getTestimonialsFromForm() {
		var list = [];
		for (var i = 0; i < 3; i++) {
			var nameInp = document.querySelector('#testimonialsList .testimonial-name[data-idx="' + i + '"]');
			var textInp = document.querySelector('#testimonialsList .testimonial-text[data-idx="' + i + '"]');
			var imgInp = document.querySelector('#testimonialsList .testimonial-image[data-idx="' + i + '"]');
			list.push({
				name: nameInp ? nameInp.value : '',
				text: textInp ? textInp.value : '',
				image: imgInp ? imgInp.value : ''
			});
		}
		return list;
	}

	function saveHomepage() {
		if (typeof Admin === 'undefined') return;
		Admin.saveContent({
			heroTitle1: document.getElementById('heroTitle1').value,
			heroDesc1: document.getElementById('heroDesc1').value
		});
		showAlert('Homepage hero saved. Connect a backend to push changes to the live site.');
	}

	function saveHomepage2() {
		if (typeof Admin === 'undefined') return;
		Admin.saveContent({ weDoIntro: document.getElementById('weDoIntro').value });
		showAlert('What we do intro saved.');
	}

	function saveAbout() {
		if (typeof Admin === 'undefined') return;
		Admin.saveContent({ aboutIntro: document.getElementById('aboutIntro').value });
		showAlert('About intro saved.');
	}

	function saveServices() {
		if (typeof Admin === 'undefined') return;
		var list = getServicesFromForm();
		Admin.saveContent({ services: JSON.stringify(list) });
		showAlert('Services saved (' + list.length + ' items).');
	}

	function saveTestimonials() {
		if (typeof Admin === 'undefined') return;
		var list = getTestimonialsFromForm();
		Admin.saveContent({ testimonials: JSON.stringify(list) });
		showAlert('Testimonials saved (' + list.length + ' items).');
	}

	function saveSettings() {
		if (typeof Admin === 'undefined') return;
		Admin.saveContent({
			settingAddress: document.getElementById('settingAddress').value,
			settingPhone: document.getElementById('settingPhone').value,
			settingEmail: document.getElementById('settingEmail').value,
			settingCopyright: document.getElementById('settingCopyright').value
		});
		showAlert('Settings saved.');
	}

	// Restore tab from hash
	function restoreTab() {
		var hash = window.location.hash.slice(1);
		if (hash) {
			var tab = document.querySelector('.admin-tab[data-tab="' + hash + '"]');
			var pane = document.getElementById(hash);
			if (tab && pane) {
				document.querySelectorAll('.admin-tab').forEach(function (t) { t.classList.remove('active'); });
				document.querySelectorAll('.admin-tab-pane').forEach(function (p) { p.classList.remove('active'); });
				tab.classList.add('active');
				pane.classList.add('active');
			}
		}
	}

	// Auth check and init
	if (typeof Admin !== 'undefined' && !Admin.isLoggedIn()) {
		window.location.href = 'login.html';
	} else {
		var session = Admin.getSession();
		if (session && session.name) {
			var nameEl = document.getElementById('userName');
			var avatarEl = document.getElementById('userAvatar');
			if (nameEl) nameEl.textContent = session.name;
			if (avatarEl) avatarEl.textContent = (session.name.charAt(0) || 'A').toUpperCase();
		}
		loadContent();
		restoreTab();
	}

	document.getElementById('saveHomepage') && document.getElementById('saveHomepage').addEventListener('click', saveHomepage);
	document.getElementById('saveHomepage2') && document.getElementById('saveHomepage2').addEventListener('click', saveHomepage2);
	document.getElementById('saveAbout') && document.getElementById('saveAbout').addEventListener('click', saveAbout);
	document.getElementById('saveServices') && document.getElementById('saveServices').addEventListener('click', saveServices);
	document.getElementById('saveTestimonials') && document.getElementById('saveTestimonials').addEventListener('click', saveTestimonials);
	document.getElementById('saveSettings') && document.getElementById('saveSettings').addEventListener('click', saveSettings);

	window.addEventListener('hashchange', restoreTab);
})();
