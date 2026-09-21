import products from "../data/products.js";
export const getProducts = (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const productId = products.find((product) => product.id === id);

        if(!productId){
            return res.status(404).json({
                success: false,
                message: "Product no found"
            })
        }

        res.status(200).json({
            success: true,
            productId
        });
    }catch(e){
        next(e);
    }
};

export const addProduct = (req, res, next) => {
    try {
        const { name, description, price } = req.body;

        if(!name || !description || price === undefined){
            return res.status(400).json({
                success: false,
                message: "Enter the required fields"
            });
        }

        if (typeof price !== "number" || price <= 0){
            return res.status(400).json({
                success: false,
                message: "Price must be positive number"
            });
        }

        const newProduct = {
            id: products.length > 0
            ? Math.max(...products.map((product) => product.id)) + 1
            : 1,
            name,
            description,
            price
        };

        products.push(newProduct);

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: newProduct
        });
    }catch(e){
        next(e)
    }

};

export const updateProduct = (req, res, next) => {
    try {
        const productId = Number(req.params.id);

        const product = products.find((product) => product.id === productId);


        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }


        const {name, description, price} = req.body;

        if(!name || !description || price === undefined){
            return res.status(400).json({
                success:false,
                message: "Please enter required fields"
            });
        }

        if(typeof price !== "number" || price <= 0){
            return res.status(400).json({
                success: false,
                message: "Price must be positive number"
            });
        }

        product.name = name;
        product.description = description;
        product.price = price;

        res.status(200).json({
            success: true,
            message: "Product updated successfully" ,
            product 
        });
    }catch(e){
        next(e);
    }

};

export const deleteProduct = (req, res, next) => {
    try{
        const productId = Number(req.params.id);

        const productIndex = products.findIndex(
            (product) => product.id === productId
        );

        if(productIndex === -1){
            return res.status(404).json({
                success:false,
                message: "Product not found"
            });
        }

        const deletedProduct = products.splice(productIndex, 1);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product: deleteProduct[0]
        });
    }catch(e){
        next(e)
    }
    
};