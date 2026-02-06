# TekVion – PHP Backend

Full PHP backend for the TekVion site: MySQL/MariaDB, admin panel (session auth), content management, and contact form.

## Requirements

- PHP 7.4+ (with PDO MySQL)
- MySQL 5.7+ or MariaDB 10.2+

## Setup

### 1. Database

Create a database and import the schema:

```bash
mysql -u root -p < sql/schema.sql
```

Or in MySQL client:

```sql
SOURCE /path/to/TekVion/sql/schema.sql;
```

### 2. Config

Copy the example config and set your database credentials:

```bash
cp config/database.local.php.example config/database.local.php
```

Edit `config/database.local.php`:

```php
return [
    'host' => 'localhost',
    'name' => 'tekvion_cms',
    'user' => 'your_user',
    'pass' => 'your_password',
];
```

### 3. Create admin user

Open in browser:

```
http://your-site/install.php
```

This creates the default admin user:

- **Email:** admin@tekvion.ae  
- **Password:** admin  

Change the password after first login (via a future “Change password” in admin, or directly in the database).

### 4. (Optional) Base path

If the site runs in a subfolder (e.g. `/tekvion/`), set in `config/config.php`:

```php
define('BASE_PATH', '/tekvion');
```

## Structure

| Path | Purpose |
|------|--------|
| `config/config.php` | App config (BASE_PATH, SITE_NAME) |
| `config/database.php` | PDO connection (reads `database.local.php`) |
| `includes/init.php` | Bootstrap (config, DB, functions, auth) |
| `includes/functions.php` | base_url(), redirect(), json_response(), e(), setting() |
| `includes/auth.php` | require_admin(), current_admin(), admin_login(), admin_logout() |
| `sql/schema.sql` | Database schema + default data |
| `admin/login.php` | Admin login (POST → session) |
| `admin/logout.php` | Destroy session, redirect to login |
| `admin/index.php` | Dashboard (requires login) |
| `admin/content.php` | Content management: homepage, services, testimonials, settings (POST saves to DB) |
| `api/get_content.php` | Public JSON API: `?type=all|settings|hero|services|testimonials` |
| `contact.php` | Contact form handler (POST → `contact_messages` table, redirect) |
| `install.php` | One-time: create default admin user |

## Database tables

- **users** – Admin users (email, password_hash, name)
- **site_settings** – Key-value (address, phone, email, copyright, we_do_intro, about_intro, etc.)
- **hero_slides** – Banner slides (sort_order, title, description)
- **services** – Services (title, description, image)
- **testimonials** – Testimonials (name, text, image)
- **contact_messages** – Contact form submissions (name, email, phone, message, read_at)

## Contact form

Forms on `index.html` and `contact.html` POST to `contact.php` with:

- `name`, `email`, `phone`, `message`
- `redirect` – URL to redirect after submit (e.g. `contact.html` or `index.html?contact=success`)

Messages are stored in `contact_messages`. View count on the admin dashboard.

## Public API

- **GET** `api/get_content.php?type=all` – Returns JSON: settings, hero_slides, services, testimonials
- **GET** `api/get_content.php?type=services` – Only services
- **GET** `api/get_content.php?type=testimonials` – Only testimonials  
- **GET** `api/get_content.php?type=settings` – Only site_settings (key-value)
- **GET** `api/get_content.php?type=hero` – Only hero_slides

Use this to drive a dynamic frontend or headless client.

## Security notes

- Remove or restrict `install.php` after first run (e.g. delete or protect by IP).
- Use HTTPS in production.
- Keep `config/database.local.php` out of version control (add to `.gitignore`).
- Change the default admin password after first login.
