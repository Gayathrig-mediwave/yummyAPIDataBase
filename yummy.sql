--create yummy recipe table--
CREATE TABLE yummy_recipes (
    recipe_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
    recipe_name VARCHAR(256)    
);

--ALTERING A EXISTING TABLE--
ALTER TABLE yummy_recipes
ADD
foot_type VARCHAR(256);

ALTER TABLE yummy_recipes
RENAME COLUMN foot_type TO food_type;

UPDATE yummy_recipes
SET  
food_type = "vegetarian"
WHERE
food_type IS NULL;


--Insert values---
Insert INTO yummy_recipes (recipe_id,recipe_name) VALUES (1,"Mushroom Gravy");
Insert INTO yummy_recipes (recipe_name) VALUES ("Mushroom biryani"),("chicken Gravy"),("Chicken Biryani");
--view values---
SELECT * FROM yummy_recipes;


--create recipe image table--
CREATE TABLE yummy_recipes_image (
    image_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
    recipe_id INTEGER,
    image_url VARCHAR(256),
    image_alt VARCHAR(256),
    FOREIGN KEY(recipe_id) REFERENCES yummy_recipes(recipe_id)  
);
--Insert values---
Insert INTO yummy_recipes_image (recipe_id,image_url,image_alt) VALUES (1,"/mushroom_gravy.png","mushroom_gravy_image");
Insert INTO yummy_recipes_image (recipe_id,image_url,image_alt) VALUES (2,"/mushroom_biryani.png","mushroom_biryani_image"),(3,"/chicken_gravy.png","chicken_gravy_image"),(4,"/Chicken_biryani.png","Chicken_biryani_image");
--view values---
SELECT * FROM yummy_recipes_image;

--create recipe description table--
CREATE TABLE yummy_recipes_description (
    description_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
    recipe_id INTEGER,
    ingridients_req TEXT,
    prep_steps TEXT,
    recipe_desc TEXT,
     FOREIGN KEY(recipe_id) REFERENCES yummy_recipes(recipe_id)  
);
--Insert values---
Insert INTO yummy_recipes_description (description_id,recipe_id,ingridients_req,prep_steps,recipe_desc) 
VALUES (1,1,"mushroom and masala","wash and cook it","its a spicy gravy with good aroma");
Insert INTO yummy_recipes_description (recipe_id,ingridients_req,prep_steps,recipe_desc) 
VALUES (2,"mushroom,spices and rice","wash and cook it","biryani with good aroma"),
(3,"chicken and masala","wash and cook it","its a spicy gravy with good aroma"),
(4,"chicken,spices and rice","wash and cook it","its biryani with good aroma");
--view values---
SELECT * FROM yummy_recipes_description;

SELECT yr.recipe_id ID,
yr.recipe_name Recipe, 
yri.image_url imageURL,
yrd.ingridients_req ingridientRequired,
yrd.prep_steps PreparationSteps,
yrd.recipe_desc About 
FROM 
yummy_recipes yr
INNER JOIN yummy_recipes_image yri
ON yr.recipe_id=yri.recipe_id 
INNER JOIN yummy_recipes_description yrd
ON yr.recipe_id=yrd.recipe_id 
WHERE yr.recipe_id =1;