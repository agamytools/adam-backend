# Structure
* I used a mix of packaging by layer and feature - system is packaged by core and domain layers, 
features are packaged by feature , and each model is organized as feature and organized internally by layer
* I used PostgreSQL as database and some denormalization for performance like save orders_count in the customer table
* I always return fast and throw exceptions and handle them in the core system exception handler - all exceptions are custom exceptions and extend from a base custom exception to handle them
in a single place and allow to add more properties if needed.
* for simplicity, I used INTEGER as primary key for all tables, but in the real world scenario I would use UUID V7 for better scalability and uniqueness across distributed systems and fast indexing
* Hash Password before save into db and use strong salt 12 to 14 chars to prevent rainbow table
