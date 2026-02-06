/*---------------------------------------------------------------------
   TekVion Admin – CMS panel JS
   Session, sidebar, user menu, content storage (localStorage)
---------------------------------------------------------------------*/

var Admin = (function () {
	'use strict';

	var STORAGE_KEY = 'tekvion_admin';
	var CONTENT_KEY = 'tekvion_cms_content';

	function getSession() {
		try {
			var data = localStorage.getItem(STORAGE_KEY);
			return data ? JSON.parse(data) : null;
		} catch (e) {
			return null;
		}
	}

	function setSession(user) {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(user || {}));
			return true;
		} catch (e) {
			return false;
		}
	}

	function clearSession() {
		try {
			localStorage.removeItem(STORAGE_KEY);
			return true;
		} catch (e) {
			return false;
		}
	}

	function isLoggedIn() {
		return !!getSession();
	}

	function getContent() {
		try {
			var data = localStorage.getItem(CONTENT_KEY);
			return data ? JSON.parse(data) : {};
		} catch (e) {
			return {};
		}
	}

	function saveContent(data) {
		try {
			var existing = getContent();
			var merged = typeof data === 'object' ? { ...existing, ...data } : existing;
			localStorage.setItem(CONTENT_KEY, JSON.stringify(merged));
			return true;
		} catch (e) {
			return false;
		}
	}

	// Sidebar toggle
	function initSidebar() {
		var sidebar = document.getElementById('adminSidebar');
		var toggle = document.getElementById('sidebarToggle');
		if (!sidebar || !toggle) return;
		toggle.addEventListener('click', function () {
			if (window.innerWidth <= 991) {
				sidebar.classList.toggle('open');
			} else {
				sidebar.classList.toggle('collapsed');
			}
		});
		// Close sidebar on mobile when clicking outside
		document.addEventListener('click', function (e) {
			if (window.innerWidth <= 991 && sidebar.classList.contains('open')) {
				if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
					sidebar.classList.remove('open');
				}
			}
		});
	}

	// User dropdown
	function initUserMenu() {
		var menu = document.getElementById('userMenu');
		var dropdown = document.getElementById('userDropdown');
		if (!menu || !dropdown) return;
		menu.addEventListener('click', function (e) {
			e.stopPropagation();
			dropdown.classList.toggle('show');
		});
		document.addEventListener('click', function () {
			dropdown.classList.remove('show');
		});
	}

	// Logout link (allow PHP logout.php to work; otherwise client-side logout)
	function initLogout() {
		var logout = document.getElementById('adminLogout');
		if (logout) {
			logout.addEventListener('click', function (e) {
				var href = this.getAttribute('href') || '';
				if (href.indexOf('logout.php') !== -1) return; // PHP backend – follow link
				e.preventDefault();
				clearSession();
				window.location.href = href || 'login.html';
			});
		}
	}

	// Tab switching (content page)
	function initTabs() {
		var tabs = document.querySelectorAll('.admin-tab');
		var panes = document.querySelectorAll('.admin-tab-pane');
		tabs.forEach(function (tab) {
			tab.addEventListener('click', function () {
				var target = tab.getAttribute('data-tab');
				tabs.forEach(function (t) { t.classList.remove('active'); });
				panes.forEach(function (p) {
					p.classList.toggle('active', p.id === target);
				});
				tab.classList.add('active');
				if (target && window.history.replaceState) {
					window.history.replaceState(null, '', '#' + target);
				}
			});
		});
		// Restore hash
		var hash = window.location.hash.slice(1);
		if (hash) {
			var tab = document.querySelector('.admin-tab[data-tab="' + hash + '"]');
			var pane = document.getElementById(hash);
			if (tab && pane) {
				tabs.forEach(function (t) { t.classList.remove('active'); });
				panes.forEach(function (p) { p.classList.remove('active'); });
				tab.classList.add('active');
				pane.classList.add('active');
			}
		}
	}

	// Set active nav link by current page
	function setActiveNav() {
		var path = window.location.pathname;
		var page = path.split('/').pop() || 'index.html';
		document.querySelectorAll('.admin-nav-link').forEach(function (link) {
			var href = link.getAttribute('href') || '';
			link.classList.remove('active');
			if (href === page || (page === 'index.html' && href.endsWith('index.html'))) {
				link.classList.add('active');
			}
			if (page === 'content.html' && window.location.hash) {
				if (link.getAttribute('href') === 'content.html#' + window.location.hash.slice(1)) {
					link.classList.add('active');
				}
			}
		});
	}

	// Init on DOM ready
	function init() {
		initSidebar();
		initUserMenu();
		initLogout();
		initTabs();
		setActiveNav();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	return {
		getSession: getSession,
		setSession: setSession,
		clearSession: clearSession,
		isLoggedIn: isLoggedIn,
		getContent: getContent,
		saveContent: saveContent,
		init: init
	};
})();
