const db = require("better-sqlite3")("./Sqlite_database/yummyapp.db", {
  fileMustExist: true,
});
const { Router } = require("express");
const router = Router();

//return all recipes
router.get(["/", "/recipes"], (req, res) => {
  const recipes = db
    .prepare(
      `SELECT recipe_id ID, 
        recipe_name RECIPE,
        food_type  Food_Type
        FROM 
        yummy_recipes;`
    )
    .all();
  res.send(recipes);
});
//return 1 recipe:
router.get("/:id", (req, res) => {
  const recipes = db
    .prepare(
      `SELECT yr.recipe_id ID,
      yr.recipe_name Recipe, 
      yr.food_type  FoodType,
      yri.image_url ImageURL,
      yri.image_alt ImageInfo,
      yrd.ingridients_req IngridientRequired,
      yrd.prep_steps PreparationSteps,
      yrd.recipe_desc About 
      FROM 
      yummy_recipes yr
      INNER JOIN yummy_recipes_image yri
      ON yr.recipe_id=yri.recipe_id 
      INNER JOIN yummy_recipes_description yrd
      ON yr.recipe_id=yrd.recipe_id 
      WHERE yr.recipe_id =?;`
    )
    .get(req.params.id);
  if (!recipes) {
    return res.status(404).send({
      message: `${req.params.id} recipe not found`,
    });
  }
  res.send(recipes);
});
//add 1 recipe:
router.post("/", (req, res) => {
  const payload = req.body;
  if (
    !payload.recipe_name ||
    !payload.image_url ||
    !payload.ingridients_req ||
    !payload.prep_steps ||
    !payload.recipe_desc
  ) {
    return res.status(400).send({
      message: "Enter all details about recipe",
    });
  }
  const addOneRecipe = db
    .prepare(
      ` INSERT INTO yummy_recipes 
     (recipe_name,food_type) 
     VALUES (@recipe_name,@food_type);`
    )
    .run({
      recipe_name: payload.recipe_name,
      food_type: payload.food_type,
    });

  const newRecipeId = addOneRecipe.lastInsertRowid;

  const addOneRecipeImage = db
    .prepare(
      `Insert INTO yummy_recipes_image 
      (recipe_id,image_url,image_alt)
      VALUES (@newRecipeId,@image_url,@image_alt);`
    )
    .run({
      newRecipeId: newRecipeId,
      image_url: payload.image_url,
      image_alt: payload.image_alt,
    });
  const addOneRecipeDesc = db
    .prepare(
      `Insert INTO yummy_recipes_description 
      (recipe_id,ingridients_req,prep_steps,recipe_desc)
      VALUES (@newRecipeId,@ingridients_req,@prep_steps,@recipe_desc);`
    )
    .run({
      newRecipeId: newRecipeId,
      ingridients_req: payload.ingridients_req,
      prep_steps: payload.prep_steps,
      recipe_desc: payload.recipe_desc,
    });
  console.log(JSON.stringify(payload));
  return res.status(201).send({
    recipe_id: newRecipeId,
    recipe_name: payload.recipe_name,
    food_type: payload.food_type,
    image_url: payload.image_url,
    image_alt: payload.image_alt,
    ingridients_req: payload.ingridients_req,
    prep_steps: payload.prep_steps,
    recipe_desc: payload.recipe_desc,
  });
});

//update a recipe
router.put("/:id", (req, res) => {
  const payload = req.body;
  if (
    !payload.recipe_name ||
    !payload.image_url ||
    !payload.ingridients_req ||
    !payload.prep_steps ||
    !payload.recipe_desc
  ) {
    return res.status(400).send({
      message: "Enter all details about recipe",
    });
  }
  const updateOneRecipe = db
    .prepare(
      `SELECT yr.recipe_id ID,
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
    WHERE yr.recipe_id =?;`
    )
    .get(req.params.id);
  if (!updateOneRecipe) {
    return res.status(404).send({
      message: `${req.params.id} recipe not found`,
    });
  }

  db.prepare(
    `UPDATE 
    yummy_recipes 
    SET 
    recipe_name=@recipe_name,
    food_type=@food_type,
    WHERE 
    recipe_id=@recipe_id;`
  ).run({
    recipe_id: req.params.id,
    recipe_name: payload.recipe_name,
    food_type: payload.food_type,
  });

  db.prepare(
    `UPDATE yummy_recipes_image 
    SET 
        recipe_id=@recipe_id,
        image_url=@image_url,
        image_alt=@image_alt
    WHERE 
    recipe_id=@recipe_id;`
  ).run({
    recipe_id: req.params.recipe_id,
    image_url: payload.image_url,
    image_alt: payload.image_alt,
  });
  db.prepare(
    `UPDATE yummy_recipes_description 
      SET 
      recipe_id=@recipe_id,
      ingridients_req=@ingridients_req,
      prep_steps=@prep_steps,
      recipe_desc=@recipe_desc
      WHERE 
      recipe_id=@recipe_id;`
  ).run({
    recipe_id: req.params.recipe_id,
    ingridients_req: payload.ingridients_req,
    prep_steps: payload.prep_steps,
    recipe_desc: payload.recipe_desc,
  });
  console.log(JSON.stringify(payload));
  return res.status(201).send({
    recipe_id: req.params.recipe_id,
    image_url: payload.image_url,
    image_alt: payload.image_alt,
    ingridients_req: payload.ingridients_req,
    prep_steps: payload.prep_steps,
    recipe_desc: payload.recipe_desc,
  });
});

//delete a recipe
router.delete("/:id", (req, res) => {
  const deleteOneRecipe = db
    .prepare(
      `SELECT yr.recipe_id ID,
      yr.recipe_name Recipe, 
      yr.food_type  Food_Type, 
      yri.image_url imageURL,
      yri.image_alt imageInfo,
      yrd.ingridients_req ingridientRequired,
      yrd.prep_steps PreparationSteps,
      yrd.recipe_desc About 
      FROM 
      yummy_recipes yr
      INNER JOIN yummy_recipes_image yri
      ON yr.recipe_id=yri.recipe_id 
      INNER JOIN yummy_recipes_description yrd
      ON yr.recipe_id=yrd.recipe_id 
      WHERE yr.recipe_id =?;`
    )
    .get(req.params.id);
  if (!deleteOneRecipe) {
    return res.status(404).send({
      message: `${req.params.id} recipe not found`,
    });
  }
  db.prepare(
    `DELETE FROM  
    yummy_recipes_image 
      WHERE 
      recipe_id=@recipe_id;`
  ).run({ recipe_id: req.params.id });
  db.prepare(
    `DELETE FROM 
     yummy_recipes_description 
        WHERE 
        recipe_id=@recipe_id;`
  ).run({ recipe_id: req.params.id });
  db.prepare(
    ` DELETE FROM 
      yummy_recipes 
      WHERE 
      recipe_id=@recipe_id ;`
  ).run({ recipe_id: req.params.id });

  return res.status(201).send({ deleteOneRecipe });
});

module.exports = router;
