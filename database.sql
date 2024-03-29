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
	product_quantity INT NOT NULL CHECK (product_quantity >= 0),
	product_price DECIMAL(6,2) NOT NULL CHECK (product_price > 0),
	product_cover TEXT NOT NULL,
	category_id BIGINT,
	brand_id BIGINT,
	ratings_number INTEGER DEFAULT 0,
	ratings_average DECIMAL(4,2) CHECK (ratings_average BETWEEN 0 AND 5),
	create_at TIMESTAMP,
	update_at TIMESTAMP,
	CONSTRAINT product_cat_fk FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT product_brand_fk FOREIGN KEY (brand_id) REFERENCES brands(brand_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS product_images (
	image_id BIGSERIAL NOT NULL UNIQUE,
	product_id BIGINT NOT NULL,
	image_path TEXT NOT NULL UNIQUE,
	CONSTRAINT product_images_pk PRIMARY KEY (image_id,product_id),
	CONSTRAINT product_images_fk FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS product_sub_categories (
	product_id BIGINT NOT NULL,
	subCategory_id BIGINT NOT NULL,
	CONSTRAINT product_sub_categories_pk PRIMARY KEY(product_id,subCategory_id),
	CONSTRAINT product_sub_category_fk FOREIGN KEY(subCategory_id) REFERENCES sub_categories(subCategory_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT product_product_fk FOREIGN KEY(product_id) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
	user_id BIGSERIAL PRIMARY KEY,
	first_name VARCHAR(100) NOT NULL,
	last_name VARCHAR(100) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR NOT NULL CHECK (LENGTH(password) >= 8),
	phone_number VARCHAR(12),
	profile_image TEXT,
	role_name VARCHAR(100) CHECK(role_name IN ('user','admin','manager')) DEFAULT 'user',
	active BOOLEAN DEFAULT 'TRUE'
);

CREATE TABLE IF NOT EXISTS reviews (
	review_id BIGSERIAL PRIMARY KEY,
	review_content TEXT NOT NULL,
	rating INTEGER NOT NULL CHECK (rating BETWEEN 0 AND 5),
	product_id BIGINT NOT NULL,
	user_id BIGINT NOT NULL,
	CONSTRAINT review_product_fk FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT review_user_fk FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS user_auth (
	user_id BIGINT NOT NULL UNIQUE,
    password_changed_at BIGINT,
	password_reset_code TEXT,
	password_reset_expires BIGINT,
	password_reset_verified BOOLEAN,
	CONSTRAINT user_auth_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS user_address (
	address_id BIGSERIAL PRIMARY KEY,
	address_alias VARCHAR(100) NOT NULL,
	user_id BIGINT NOT NULL,
	country VARCHAR(100) NOT NULL,
	city VARCHAR(100) NOT NULL,
	street TEXT NOT NULL,
    CONSTRAINT user_address_user_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT user_address_alias_unique UNIQUE(address_alias,user_id)
);

CREATE TABLE IF NOT EXISTS wishlist (
	user_id BIGINT NOT NULL,
	product_id BIGINT NOT NULL,
	CONSTRAINT wishlist_product_fk FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT wishlist_user_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT wishlist_user_product_unique UNIQUE(user_id,product_id)
);

CREATE TABLE IF NOT EXISTS coupons (
	coupon_code VARCHAR(100) PRIMARY KEY,
	expire TIMESTAMP NOT NULL,
	discount INT NOT NULL CHECK (discount > 0)
);

CREATE TABLE IF NOT EXISTS shopping_carts (
	cart_id BIGSERIAL NOT NULL UNIQUE,
	user_id BIGINT NOT NULL UNIQUE,
	total_cart_price DECIMAL,
	total_Price_after_discount DECIMAL,
	CONSTRAINT user_cart_pk PRIMARY KEY (user_id, cart_id),
	CONSTRAINT user_cart_fk FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
	cart_id BIGINT NOT NULL,
	product_id BIGINT NOT NULL,
	quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
	CONSTRAINT cart_items_pk PRIMARY KEY (cart_id, product_id),
	CONSTRAINT product_cart_fk FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT shopping_cart_fk FOREIGN KEY (cart_id) REFERENCES shopping_carts (cart_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
	order_id BIGSERIAL PRIMARY KEY,
	user_id BIGINT NOT NULL,
	shipping_address BIGINT NOT NULL,
	total_price DECIMAL NOT NULL ,
	payment_method VARCHAR(100) NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash','card')),
	is_paid BOOLEAN NOT NULL DEFAULT false,
	paid_at TIMESTAMP,
	status VARCHAR(100) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','shipped')),
	shipped_at TIMESTAMP,
	CONSTRAINT user_order_fk FOREIGN KEY(user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT address_order_fk FOREIGN KEY(shipping_address) REFERENCES user_address (address_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
	order_id BIGINT NOT NULL,
	product_id BIGINT NOT NULL,
	quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
	CONSTRAINT order_items_pk PRIMARY KEY (order_id, product_id),
	CONSTRAINT product_order_fk FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT order_fk FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Views
CREATE OR REPLACE VIEW subCategory_view
AS 
SELECT s.subcategory_id, s.subcategory_name,s.subcategory_slug,s.category_id,c.category_name
FROM sub_categories s LEFT JOIN categories c
ON s.category_id = c.category_id;

-- 

CREATE OR REPLACE VIEW products_view
AS
SELECT P.*,
JSON_AGG(JSON_BUILD_OBJECT('subcategory_id', S.subcategory_id,'subcategory_name', S.subcategory_name,'subcategory_slug',S.subcategory_slug)) AS "subCategories",
JSON_AGG(PI.image_path) AS "Images"
FROM products P INNER JOIN product_sub_categories PS
ON P.product_id = PS.product_id
INNER JOIN sub_categories s
ON S.subcategory_id = PS.subcategory_id
LEFT JOIN product_images PI
ON PI.product_id = P.product_id
GROUP BY P.product_id;

-- 

CREATE OR REPLACE VIEW product_wishlist_view
AS
SELECT P.product_id,P.product_title, P.product_slug, P.product_cover, P.product_price, W.user_id
FROM products P INNER JOIN wishlist W
ON P.product_id = W.product_id;

-- 

CREATE OR REPLACE VIEW shopping_cart_view
AS
SELECT S.*,
JSON_AGG(JSON_BUILD_OBJECT('product_id', P.product_id,'product_title', P.product_title,'product_price',P.product_price,'product_cover',P.product_cover,'quantity',C.quantity)) AS "products"
FROM shopping_carts S INNER JOIN cart_items C
ON S.cart_id = C.cart_id
INNER JOIN products P
ON P.product_id = C.product_id
GROUP BY S.cart_id,S.user_id;

-- 

CREATE OR REPLACE VIEW order_view
AS
SELECT O.order_id,
U.user_id,CONCAT(U.first_name,' ',U.last_name) AS "user_name", U.email AS "user_email",
O.total_price,O.payment_method,O.is_paid,O.paid_at,O.status,O.shipped_at,
JSON_AGG(JSON_BUILD_OBJECT('product_id', P.product_id,'product_title', P.product_title,'product_price',P.product_price,'product_cover',P.product_cover,'quantity',C.quantity)) AS "products"
FROM orders O INNER JOIN users U
ON O.user_id = U.user_id
INNER JOIN user_address A
ON U.user_id = A.user_id
INNER JOIN order_items C
ON O.order_id = C.order_id
INNER JOIN products P
ON C.product_id = P.product_id
GROUP BY O.order_id,U.user_id,CONCAT(U.first_name,' ',U.last_name),
O.total_price,O.payment_method,O.is_paid,O.paid_at,O.status,O.shipped_at;

-- 

BEGIN;
INSERT INTO users (first_name,last_name,email,password,role_name) 
VALUES ('super','admin','admin@admin.com','$2b$12$OeZH.MXVb023n33g.qAW2uhimGiBSsvAJ4zfYmQBRdxEfixIuKF/a','admin');
INSERT INTO user_auth (user_id) VALUES (1);
COMMIT;