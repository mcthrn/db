const client = require("./connection.js");
const express = require("express");
const cors = require("cors");
const app = express();

app.listen(3000, () => {
  console.log("Sever is now listening at port 3000");
});
//to json
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(cors());
client.connect();

//-----------------CATEGORY--------------------
//GET CATEGORY
app.get("/category", (req, res) => {
  client.query(`Select * from category`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  client.end;
});

app.get("/category/:id", (req, res) => {
  // console.log("running");
  const id = parseInt(req.params.id);
  client.query(`Select * from category where c_id=${id}`, (err, result) => {
    if (!err) {
      res.status(200).json(result.rows);
    } else {
      throw err;
    }
  });
  client.end;
});

//add category
app.post("/category", (req, res) => {
  const category = req.body;
  console.log(req.body);
  let insertQuery = `insert into category(c_name, c_createdby, c_createddate) 
                       values('${category.c_name}', '${category.c_createdby}', '${category.c_createddate}')`;

  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Insertion was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});

//----------TAGS--------------
//update tags
// app.post("/updateTags", (req, res) => {
//   const tags = req.body;
//   console.log(req.body);
//   let updateQuery = `update product set p_tags = '${tags.tag_name}'  where p_id = '${tags.p_id}'`;
//   // let insertQuery = `insert into product_tags(product_id, tag_name)
//   //                      values('${tags.p_id}', '${tags.tag_name}')`;

//   console.log(JSON.stringify(tags));
//   client.query(updateQuery, (err, result) => {
//     if (!err) {
//       res.send("Insertion was successful");
//     } else {
//       console.log("error");
//       console.log(err.message);
//     }
//   });
//   client.end;
// });

//------------PRODUCT-----------

//add product
app.post("/product", (req, res) => {
  const product = req.body;
  console.log(req.body);
  let insertQuery = `insert into product(p_sku, p_name, p_description, p_category, p_cost,p_price,p_tags) 
                       values('${product.p_sku}', '${product.p_name}', '${product.p_description}',  '${product.p_category}', '${product.p_cost}', '${product.p_price}', '${product.p_tags}')`;

  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Insertion was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});

// client.connect(); '${product.p_category}',,p_category

//GET PRODUCT
app.get("/product", (req, res) => {
  client.query(
    `SELECT b.c_name,p_id, p_sku, p_name, p_description, p_category, p_cost, p_price, p_tags
	FROM  product a left join category b on CAST(a.p_category as bigint) = b.c_id;`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
  client.end;
});

app.get("/product/:id", (req, res) => {
  // console.log("running");
  const id = parseInt(req.params.id);
  client.query(
    `SELECT prod.p_id, prod.p_sku, prod.p_name, prod.p_description, cat.c_name as p_category,   prod.p_cost, prod.p_price, prod.p_tags
	FROM product prod inner join category cat on CAST(prod.p_category as bigint) = cat.c_id where prod.p_id=${id}`,
    (err, result) => {
      if (!err) {
        res.status(200).json(result.rows);
      } else {
        throw err;
      }
    }
  );
  client.end;
});

//update product
app.post("/updateProduct", (req, res) => {
  const prod = req.body;
  console.log(req.body);
  let updateQuery = `UPDATE product
	SET  p_sku='${prod.sku}' , p_name='${prod.name}' , p_description='${prod.desc}' , p_category=(select c_id from category where c_name= '${prod.selectedcategory}' ), p_cost='${prod.cost}' , p_price='${prod.price}' , p_tags= '${prod.tag_name}' 
	WHERE p_id = '${prod.p_id}'`;
  // let insertQuery = `insert into product_tags(product_id, tag_name)
  //                      values('${tags.p_id}', '${tags.tag_name}')`;

  // console.log(JSON.stringify(tags));
  client.query(updateQuery, (err, result) => {
    if (!err) {
      res.send("Product Update");
    } else {
      console.log("error");
      console.log(err.message);
    }
  });
  client.end;
});
