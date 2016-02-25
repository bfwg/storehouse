WITH RECURSIVE leaf_categories
AS(
    SELECT c.parent_id, c.id
    FROM category c
    WHERE c.parent_id = 1
UNION ALL
    SELECT b.parent_id, c.id
    FROM leaf_categories b, category c
    WHERE b.id = c.parent_id
)
SELECT lc.parent_id, lc.id, cm.source_category_id
    FROM leaf_categories as lc
    LEFT JOIN category_mapping as cm ON cm.category_id = lc.id
    WHERE lc.id NOT IN (SELECT parent_id FROM category WHERE parent_id IS NOT NULL)
    GROUP BY lc.parent_id, lc.id, cm.source_category_id
    ORDER BY lc.parent_id, lc.id;
