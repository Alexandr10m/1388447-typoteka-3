CREATE TABLE users
(
    id            integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name    varchar(255)        NOT NULL,
    last_name     varchar(255)        NOT NULL,
    password_hash varchar(255)        NOT NULL,
    email         varchar(255) UNIQUE NOT NULL,
--     Если поле не обязательное, то NOT NULL не ставим? Или нужно ставить какие-то другие ключевые слова?
    avatar        varchar(50)
);

CREATE TABLE articles
(
    id         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id    integer      NOT NULL,
    title      varchar(250) NOT NULL,
    announce   varchar(250) NOT NULL,
--     Если поле не обязательное, то NOT NULL не ставим? Или нужно ставить какие-то другие ключевые слова?
    full_text  varchar(1000),
    picture    varchar(255),
    created_at timestamp DEFAULT current_timestamp,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE categories
(
    id   integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    name varchar(255)
);

CREATE TABLE comments
(
    id         integer      NOT NULL GENERATED ALWAYS AS IDENTITY,
    text       varchar(100) NOT NULL,
    user_id    integer      NOT NULL,
    article_id integer      NOT NULL,
    create_at  timestamp DEFAULT current_timestamp,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (article_id) REFERENCES articles (id)
);

CREATE TABLE categories_articles
(
    category_id integer NOT NULL,
    article_id  integer NOT NULL,
    PRIMARY KEY (category_id, article_id),
    FOREIGN KEY (category_id) REFERENCES categories (id),
    FOREIGN KEY (article_id) REFERENCES articles (id)
);

CREATE
INDEX ON articles(title);
