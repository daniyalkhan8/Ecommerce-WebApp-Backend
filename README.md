
# Ecommerce Backend WebApp

This project contains the complete backend for an E-commerce web application, built with Node.js, Express.js, and MongoDB. It features separate roles for both a single seller and multiple users, making it ideal for developers starting with frontend development who need a backend to connect to. The strength of this backend lies in its comprehensive design, covering a wide range of scenarios typically encountered in E-commerce apps. So, if you're building an E-commerce frontend and need a solid backend to power it, look no further!


## Tech Stack

**Server:** Node, Express

**Database:** MongoDB, Mongoose

**Product Images & Uploads:** Cloudinary, Express-FileUpload

**Authentication:** Json Web Token (JWT)

**Password Security:** BcryptJS

**API Error Handling:** Express-Async-Handler

**DevDependency:** Nodemon


## Features

#### Users Features:

* **Authentication:** Users can register, log in, and securely reset their passwords.
* **Product Viewing:** Browse a comprehensive product catalog with detailed overviews.
* **Shopping Cart:** Add, remove, and update item quantities for a flexible shopping experience.
* **Wish List:** Create and manage a personalized list of desired products for future reference.
* **Order Management:** Place, cancel, and view a detailed history of all orders.

#### Seller Features:

* **Authentication:** Sellers can securely register, log in, and reset their passwords.
* **Product Management:** Add, remove, update, and list all products they sell.
* **Order Management:**
    * Track and manage all user orders efficiently.
    * Update order statuses for transparency and control.

## API Reference

#### Seller Login

```http
  POST /api/seller/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. Seller email |
| `password` | `string` | **Required**. Seller password |

#### Seller Register

```http
  POST /api/seller/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `firstname` | `string` | **Required**. Seller first name |
| `lastname` | `string` | **Required**. Seller last name |
| `email` | `string` | **Required**. Seller email |
| `password` | `string` | **Required**. Seller password |
| `dob` | `string` | **Required**. Seller date of birth |

#### Seller Reset Password

```http
  PUT /api/seller/resetpassword
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. Seller JWT |
| `password` | `string` | **Required**. Seller current password |
| `newPassword` | `string` | **Required**. Seller new password |

#### Seller Add Product

```http
  POST /api/seller/products/add-product
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. Seller JWT |
| `image` | `file` | **Required**. Product image |
| `data` | `object` | **Required**. Product details object. |
| `data.name` | `string` | **Required**. Product name |
| `data.description` | `string` | **Required**. Product description |
| `data.brand` | `string` | **Required**. Product brand |
| `data.price` | `string` | **Required**. Product price |
| `data.category` | `string` | **Required**. Product category |
| `data.quantity` | `string` | **Required**. Product available units |

#### Seller Update Product

```http
  PUT /api/seller/products/update-product/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. Seller JWT |
| `image` | `file` | Product image |
| `data` | `object` | Product details object |
| `data.name` | `string` | Product name |
| `data.description` | `string` | Product description |
| `data.brand` | `string` | Product brand |
| `data.price` | `string` | Product price |
| `data.category` | `string` | Product category |
| `data.quantity` | `string` | Product available units |

#### Seller Delete Product

```http
  DELETE /api/seller/products/delete-product/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. Seller JWT |

#### Seller Get All Products

```http
  GET /api/seller/products/get-products
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. Seller JWT |

#### Seller Get All Orders

```http
  GET /api/seller/products/getorders
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. Seller JWT |

#### Seller Update Order Status

```http
  PUT /api/seller/products/updateorderstate/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. Seller JWT |
| `orderStatus` | `string` | **Required**. Order new status |

#### User Login

```http
  POST /api/users/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. User email |
| `password` | `string` | **Required**. User password |

#### User Register

```http
  POST /api/users/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `firstname` | `string` | **Required**. User first name |
| `lastname` | `string` | **Required**. User last name |
| `email` | `string` | **Required**. User email |
| `password` | `string` | **Required**. User password |
| `dob` | `string` | **Required**. User date of birth |
| `address` | `object` | **Required**. User address information |
| `address.city` | `string` | **Required**. City of residence |
| `address.state` | `string` | **Required**. State or province |
| `address.country` | `string` | **Required**. Country of residence |
| `address.street` | `string` | **Required**. Street address |

#### User Reset Password

```http
  PUT /api/users/resetpassword
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. User JWT |
| `password` | `string` | **Required**. User current password |
| `newPassword` | `string` | **Required**. User new password |

#### User Get All Products

```http
  GET /api/users/products/getproducts
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. User JWT |

#### User Add Product To Cart

```http
  POST /api/users/products/addtocart/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. User JWT |
| `quantity` | `string` | **Required**. Quantity of product |

#### User Get Cart Items

```http
  GET /api/users/products/getcartitems
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. User JWT |

#### User Update Cart Item Quantity

```http
  PUT /api/users/products/updatecartitemquantity/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. User JWT |
| `quantity` | `string` | **Required**. Updated quantity of product |

#### User Remove Product From Cart

```http
  DELETE /api/users/products/removecartitem/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. User JWT |

#### User Add Product To Wish List

```http
  POST /api/users/products/addtowishlist/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. User JWT |

#### User Get Wish List Items

```http
  GET /api/users/products/getwishlist
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. User JWT |

#### User Remove Product From Wish List

```http
  DELETE /api/users/products/removefromwishlist/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. User JWT |

#### User Place Order

```http
  POST /api/users/products/placeorder
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. User JWT |
| `cartItems` | `array` | **Required**. Array of cart item ids |
| `cartItems[]` | `string` | **Required**. Individual cart item id |

#### User Cancel Order

```http
  PUT /api/users/products/cancelorder/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. User JWT |

#### User Get All Orders

```http
  GET /api/users/products/getorders
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `bearer` | **Required**. User JWT |

## Run Locally

#### Download and Install NodeJS

[Click Here to Download NodeJS Installer](https://nodejs.org/en/download)

#### Download and Install Postman

[Click Here to Download Postman Installer](https://www.postman.com/downloads/)

#### Create a Cloudinary Account

[Click Here to Create A Cloudinary Account](https://cloudinary.com/users/register_free)

After that create `Ecommerce-Backend-WebApp` folder in Cloudinary, and inside that folder create `Products` folder.

#### Clone the project

```bash
  git clone https://github.com/daniyalkhan8/Ecommerce-WebApp-Backend.git
```

#### Go to the project directory

```bash
  cd Ecommerce-WebApp-Backend
```

#### Install dependencies

```bash
  npm i
```

#### Set Environment Variables

Set the environment variables mentioned below in `.env` file present in project's root directory.

`MONGO_URI` MongoDB connection string.

`PORT` Port on which project will run.

`CLOUD_NAME` Cloudinary cloud name.

`API_KEY` Cloudinary API key.

`API_SECERET` Cloudinary API seceret.

`NODE_ENV` Either 'development' or 'production'.

`JWT_SECERET` A unique JWT seceret.

#### Start the server

```bash
  npm run start
```
#### Import The Postman Requests Collection

In the project's root directory, there's a `Postman Request Collection` json file for you. Import it into Postman, and the request collection magically appears, saving you time—no need to create each request one by one. Simply go to your Postman home screen, click 'Import,' and easily drag-and-drop the file or select it from your device.


## Author

- Github [@daniyalkhan8](https://github.com/daniyalkhan8)

- LinkedIn [@daniyalkhandurrani](https://linkedin.com/in/daniyalkhandurrani)
