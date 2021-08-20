SELECT * FROM categories;

SELECT id, name FROM categories
  JOIN categories_articles
  ON id = category_id
  GROUP BY id;

SELECT id, name, count(article_id) FROM categories
  LEFT JOIN categories_articles
  ON id = category_id
  GROUP BY id;

SELECT articles.*,
   COUNT(comments.id) AS comments_count,
   STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
   users.first_name,
   users.last_name,
   users.email
FROM articles
  JOIN categories_articles ON articles.id = categories_articles.article_id
  JOIN categories ON categories_articles.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
  GROUP BY articles.id, users.id;

SELECT articles.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM articles
  JOIN categories_articles ON articles.id = categories_articles.article_id
  JOIN categories ON categories_articles.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
WHERE articles.id = 1
  GROUP BY articles.id, users.id;

SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.create_at DESC
  LIMIT 5;

SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 1
  ORDER BY comments.create_at DESC;

UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 1;
