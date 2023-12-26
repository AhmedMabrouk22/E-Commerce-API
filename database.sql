-- Create Tables
CREATE TABLE IF NOT EXISTS categories (
	category_id BIGSERIAL PRIMARY KEY,
	category_name VARCHAR(255) NOT NULL UNIQUE,
	category_slug TEXT,
	category_image TEXT
);

CREATE TABLE IF NOT EXISTS sub_categories (
	subCategory_id BIGSERIAL PRIMARY KEY,
	subCategory_name VARCHAR(255) NOT NULL UNIQUE,
	subCategory_slug TEXT,
	category_id BIGINT,
	CONSTRAINT subCategory_cat_fk FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS brands (
	brand_id BIGSERIAL PRIMARY KEY,
    brand_name VARCHAR(255) NOT NULL UNIQUE,
    brand_slug TEXT,
	brand_image TEXT
);

CREATE TABLE IF NOT EXISTS products (
	product_id BIGSERIAL PRIMARY KEY,
	product_title VARCHAR(255) NOT NULL,
	product_slug TEXT,
	product_description TEXT NOT NULL, 
	product_quantity INT NOT NULL CHECK (product_quantity > 0),
	product_price DECIMAL(6,2) NOT NULL CHECK (product_price > 0),
	product_cover TEXT NOT NULL,
	category_id BIGINT,
	brand_id BIGINT,
	CONSTRAINT product_cat_fk FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT product_brand_fk FOREIGN KEY (brand_id) REFERENCES brands(brand_id) ON DELETE SET NULL ON UPDATE CASCADE,
	create_at TIMESTAMP,
	update_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cites (
	city_id SERIAL PRIMARY KEY,
	city_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS roles (
	role_id SERIAL PRIMARY KEY,
	role_name VARCHAR(100) CHECK(role_name IN ('user','admin','manager')) DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS users (
	user_id BIGSERIAL PRIMARY KEY,
	first_name VARCHAR(100) NOT NULL,
	last_name VARCHAR(100) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR NOT NULL CHECK (LENGTH(password) >= 8),
	phone_number VARCHAR(12),
	image_profile TEXT,
	role INT NOT NULL,
	active BOOLEAN DEFAULT 'TRUE'
);

CREATE TABLE IF NOT EXISTS user_auth (
	user_id BIGINT NOT NULL UNIQUE,
    passwordChangedAt TIMESTAMP,
	passwordResetCode VARCHAR(10),
	passwordResetExpires TIMESTAMP,
	passwordResetVerified BOOLEAN,
	CONSTRAINT user_auth_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS user_address (
	user_id BIGINT NOT NULL,
	city_id INT NOT NULL,
	street TEXT NOT NULL,
    CONSTRAINT user_address_user_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT user_address_city_fk FOREIGN KEY (city_id) REFERENCES cites(city_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS wishlists (
	user_id BIGINT UNIQUE NOT NULL,
	product_id BIGINT NOT NULL,
	CONSTRAINT wishlist_product_fk FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT wishlist_user_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Views
CREATE VIEW subCategory_view
AS 
SELECT s.subcategory_id, s.subcategory_name,s.subcategory_slug,s.category_id,c.category_name
FROM sub_categories s LEFT JOIN categories c
ON s.category_id = c.category_id;