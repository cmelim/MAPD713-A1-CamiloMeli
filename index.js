let SERVER_NAME = 'product-api'
let PORT = 5000;
let HOST = '127.0.0.1';

let errors = require('restify-errors');
let restify = require('restify')

  // Get a persistence engine for the products
  , productsSave = require('save')('product')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('**** Resources: ****')
  console.log('********************')
  console.log(' /product')
  console.log(' /products/:id')  
})

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Get all products in the system
server.get('/products', function (req, res, next) {
  console.log('GET /products params=>' + JSON.stringify(req.params));

  // Find every entity within the given collection
  productsSave.find({}, function (error, products) {

    // Return all of the products in the system
    res.send(products)
  })
})

// Get a single PRODUCT by their user id
server.get('/products/:id', function (req, res, next) {
  console.log('GET /products/:id params=>' + JSON.stringify(req.params));

  // Find a single PRODUCT by their id within save
  productsSave.findOne({ _id: req.params.id }, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    if (product) {
      // Send the products if no issues
      res.send(product)
    } else {
      // Send 404 header if the user doesn't exist
      //res.send(404)
      res.json({MessageEvent: 'no found product' })
    }
  })
})

// Create a new product
server.post('/products', function (req, res, next) {
  console.log('POST /products params=>' + JSON.stringify(req.params));
  console.log('POST /products body=>' + JSON.stringify(req.body));

  // validation of manadatory fields
  if (req.body.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('name must be supplied'))
  }
  if (req.body.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('price must be supplied'))
  }
  if (req.body.quantity === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('quantity must be supplied'))
  }

  let newProduct = {
		name: req.body.name, 
		price: req.body.price,
    quantity: req.body.quantity
	}

  // Create the product using the persistence engine
  productsSave.create( newProduct, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    // Send the product if no issues
    res.send(201, user)
  })
})

// Update a product by their id
server.put('/products/:id', function (req, res, next) {
  console.log('POST /products params=>' + JSON.stringify(req.params));
  console.log('POST /products body=>' + JSON.stringify(req.body));
  // validation of manadatory fields
  if (req.body.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('name must be supplied'))
  }
  if (req.body.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('pric must be supplied'))
  }
  
  let newProduct = {
		_id: req.body.id,
		name: req.body.name, 
		price: req.body.price,
    quantity: req.body.quantity
	}
  
  // Update the product with the persistence engine
  productsSave.update(newProduct, function (error, user) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
})

// Delete product with the given id
server.del('/products/:id', function (req, res, next) {
  console.log('POST /products params=>' + JSON.stringify(req.params));
  // Delete the user with the persistence engine
  productsSave.delete(req.params.id, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    // Send a 204 response
    res.send(204)
  })
})


