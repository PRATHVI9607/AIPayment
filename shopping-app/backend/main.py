from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid

app = FastAPI(title="Shopping App API", version="1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Starting Shopping API...")
    print(f"Initializing product database...")
    init_sample_products()
    print(f"Loaded {len(products_db)} products")

# In-memory product database
products_db = []

# Models
class Product(BaseModel):
    product_id: str
    name: str
    brand: str
    category: str
    price: float
    description: str
    stock: int
    image_url: Optional[str] = None

class ProductSearch(BaseModel):
    query: Optional[str] = ""
    brand: Optional[str] = None
    category: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None

# Initialize sample products
def init_sample_products():
    sample_products = [
        # Brand: TechPro
        {
            "product_id": "LAPTOP-Pro-123456",
            "name": "TechPro Laptop Pro",
            "brand": "TechPro",
            "category": "Electronics",
            "price": 999.99,
            "description": "Professional laptop with high performance processor",
            "stock": 20
        },
        {
            "product_id": "HEADPHONES-Wireless-789",
            "name": "TechPro Wireless Headphones",
            "brand": "TechPro",
            "category": "Electronics",
            "price": 79.99,
            "description": "High-quality wireless headphones with noise cancellation",
            "stock": 50
        },
        {
            "product_id": "PHONE-X1-555",
            "name": "TechPro Smartphone X1",
            "brand": "TechPro",
            "category": "Electronics",
            "price": 599.99,
            "description": "Latest smartphone with 5G connectivity and advanced camera",
            "stock": 30
        },
        {
            "product_id": "WATCH-Smart-888",
            "name": "TechPro Smart Watch",
            "brand": "TechPro",
            "category": "Electronics",
            "price": 249.99,
            "description": "Fitness tracking smartwatch with heart rate monitor",
            "stock": 100
        },
        {
            "product_id": "SPEAKER-BT-333",
            "name": "TechPro Bluetooth Speaker",
            "brand": "TechPro",
            "category": "Electronics",
            "price": 49.99,
            "description": "Portable Bluetooth speaker with 360-degree sound",
            "stock": 75
        },
        
        # Brand: HomeStyle
        {
            "product_id": "COFFEE-Maker-111",
            "name": "HomeStyle Coffee Maker",
            "brand": "HomeStyle",
            "category": "Home Appliances",
            "price": 89.99,
            "description": "Automatic coffee maker with programmable timer",
            "stock": 40
        },
        {
            "product_id": "VACUUM-Clean-222",
            "name": "HomeStyle Vacuum Cleaner",
            "brand": "HomeStyle",
            "category": "Home Appliances",
            "price": 199.99,
            "description": "Powerful vacuum cleaner with HEPA filter",
            "stock": 25
        },
        {
            "product_id": "AIR-Purifier-444",
            "name": "HomeStyle Air Purifier",
            "brand": "HomeStyle",
            "category": "Home Appliances",
            "price": 149.99,
            "description": "Advanced air purifier for clean and fresh air",
            "stock": 35
        },
        {
            "product_id": "BLENDER-Pro-666",
            "name": "HomeStyle Blender Pro",
            "brand": "HomeStyle",
            "category": "Kitchen",
            "price": 69.99,
            "description": "High-speed blender for smoothies and more",
            "stock": 60
        },
        {
            "product_id": "TOASTER-Oven-777",
            "name": "HomeStyle Toaster Oven",
            "brand": "HomeStyle",
            "category": "Kitchen",
            "price": 79.99,
            "description": "Convection toaster oven with multiple cooking modes",
            "stock": 45
        },
        {
            "product_id": "KETTLE-Elec-999",
            "name": "HomeStyle Electric Kettle",
            "brand": "HomeStyle",
            "category": "Kitchen",
            "price": 34.99,
            "description": "Fast-boiling electric kettle with auto shut-off",
            "stock": 80
        },
        {
            "product_id": "FOOD-Processor-101",
            "name": "HomeStyle Food Processor",
            "brand": "HomeStyle",
            "category": "Kitchen",
            "price": 119.99,
            "description": "Multi-function food processor for cooking prep",
            "stock": 30
        },
    ]
    
    for product_data in sample_products:
        products_db.append({
            "product_id": product_data["product_id"],
            "name": product_data["name"],
            "brand": product_data["brand"],
            "category": product_data["category"],
            "price": product_data["price"],
            "description": product_data["description"],
            "stock": product_data["stock"],
            "image_url": f"https://via.placeholder.com/300?text={product_data['name'].replace(' ', '+')}"
        })

# Routes
@app.get("/")
def read_root():
    return {"message": "Shopping App API", "status": "running"}

@app.get("/products", response_model=List[Product])
def get_all_products():
    """Get all products"""
    return products_db

@app.get("/products/{product_id}", response_model=Product)
def get_product(product_id: str):
    """Get a specific product by ID"""
    for product in products_db:
        if product["product_id"] == product_id:
            return product
    raise HTTPException(status_code=404, detail="Product not found")

@app.post("/products/search", response_model=List[Product])
def search_products(search: ProductSearch):
    """Search products based on criteria"""
    results = products_db.copy()
    
    # Filter by query (search in name and description)
    if search.query:
        query_lower = search.query.lower()
        results = [
            p for p in results
            if query_lower in p["name"].lower() or query_lower in p["description"].lower()
        ]
    
    # Filter by brand
    if search.brand:
        results = [p for p in results if p["brand"].lower() == search.brand.lower()]
    
    # Filter by category
    if search.category:
        results = [p for p in results if p["category"].lower() == search.category.lower()]
    
    # Filter by price range
    if search.min_price is not None:
        results = [p for p in results if p["price"] >= search.min_price]
    
    if search.max_price is not None:
        results = [p for p in results if p["price"] <= search.max_price]
    
    return results

@app.get("/brands")
def get_brands():
    """Get all available brands"""
    brands = list(set(p["brand"] for p in products_db))
    return {"brands": sorted(brands)}

@app.get("/categories")
def get_categories():
    """Get all available categories"""
    categories = list(set(p["category"] for p in products_db))
    return {"categories": sorted(categories)}

@app.get("/products/brand/{brand_name}", response_model=List[Product])
def get_products_by_brand(brand_name: str):
    """Get all products from a specific brand"""
    results = [p for p in products_db if p["brand"].lower() == brand_name.lower()]
    if not results:
        raise HTTPException(status_code=404, detail="Brand not found or has no products")
    return results

@app.get("/products/category/{category_name}", response_model=List[Product])
def get_products_by_category(category_name: str):
    """Get all products from a specific category"""
    results = [p for p in products_db if p["category"].lower() == category_name.lower()]
    if not results:
        raise HTTPException(status_code=404, detail="Category not found or has no products")
    return results

@app.get("/store-account")
def get_store_account():
    """Get the store's bank account information for payments"""
    return {
        "account_number": "BANK1SHOPSTORE",
        "account_name": "ShopStore Official",
        "bank": "Bank 1"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
