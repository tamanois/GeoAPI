# Context Instructions

This project purpose is to create an API that will help search for country and cities information. The API will provide endpoints to retrieve data about countries and cities, including their names, populations, and other relevant details.
The main goals is to create a RESTful API that allows users to search for countries and cities based on various criteria. It will mostly be used by developers who need to integrate country and city data into their applications (Ex: travel apps, educational platforms, fields autocomplete.).


In the codebase, a CSV file is used as the data source for countries and cities information. The CSV file contains structured data with columns representing different attributes of countries and cities, such as name, population, area, and other relevant details.


We will first import the CSV data into a database to facilitate efficient querying and retrieval of information. The API will then interact with the database to provide the requested data to users.



The API will be built using modern web development frameworks and technologies to ensure scalability, performance, and ease of use. It will include features such as filtering, sorting, and pagination to enhance the user experience when searching for countries and cities.



## Use cases

* A search for countries by name or partial name.
* A search for cities within a specific country.
* A search for cities given the country code and partial city name.
* A search for countries by city name.

You can extend the API to include additional features such as:
* Filtering countries by population size or area.
* Sorting results by different attributes (e.g., name, population).
* Pagination to handle large datasets.
* Caching to improve performance for frequently requested data.
* Rate limiting to protect the API from abuse.



## Additional Information
The authentication for the API can be implemented using API keys or OAuth to ensure that only authorized users can access the endpoints. This will help protect the data and prevent unauthorized usage. The API keys are stored securely in the database and are required to be included in the request headers for authentication.

This is only an API project, so there is no front-end interface. Users will interact with the API through HTTP requests using tools like Postman, curl, or by integrating it into their applications.

### Technologies

The API will be built using modern web development frameworks and technologies such as:

* Backend framework: Node.js with Nest.js
* Database: SQLite
* ORM: TypeORM
* CSV parsing: csv-parser or similar library
* API documentation: Swagger