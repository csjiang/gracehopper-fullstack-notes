--setting up a site: 
	--use node and express to create a server; link that to a domain purchased from some site,
	--have server running on computer and other people can go to that ip and make/get responses to HTTP requests.

	--this will allow you to create a simple site where you can look at catalog, select items for cart, and purchase products. 
	--however, if the node process stops and starts again you won't have persistent data storage. simply storing data 
	--as variables in the process will be reset once process turns off. 

	--possible solutions: 
	--files AWS/CDN - external file to save data --> works the best for our intended functionality. 
		--could alter routes so you fs.readFile in every route to find that file 
		--sample files: catalog.txt with properties for each item;
		--user.txt 
	--update codebase with information 
	--cloud storage 

	--databases solve the problem of persisting memory to cope with 1) crashing node processes 2) node processes getting overloaded with data

	--Intro to databases - an abstraction for file storage
		--a database is sth that holds info 
		--databases can be more or less persistent + accessible 
		-- DBs are - organized - queryable -manageable 
		--eg MongoDB- nonstructured array of objects organized as files

		--before relational DBs (<1970s) 
			--data was stored in custom 'data files' 
			-- queried via app-specific code 
			-- advantages: 
			-- 	middle layer not needed
			-- 	solutions customized for each app
			-- disadvantages: 
			-- 	haSELECT * FROM movies_genres INNER JOIN 
		(SELECT id, name AS movie_name, year FROM movies WHERE year % 4 = 0 ORDER BY movie_name) 
		as movies ON movies_genres.movie_id = movies.idrd to chng system 
			-- 	knowledge not compounding 
			-- 	data-transfer difficult 
		--Database mgmt systems (DBMS) - one layer and language to store + access data. sold as a way for 'non-technical ppl' to store data

		--sequel: structured english query language
			--ef codd, larry ellison -> SQL
			--standardized in 1986
			--the third manifesto: cf object-relational impedance mismatch
		--sql is a common interface betwn lots of DBMS- mySql, Postgresql, etc 
			--we will work most with PostgreSQL

		-- relational database management systems
			-- 	data stored in relations(tables)
			-- 	a simple, structured query lang: SQL
			-- 	programmers can specify what answers a query should return, but not how the query is executed or where/how data is stored
			-- 	dbms picks an execution strategy based on indexes, data, workload etc
			-- 	multi-user, muti-threaded: multiple processes can access database at the same time

		-- --dbs are a collection of tables/relations
			-- tables have cols (attributes) + rows(instances or tuples)
			-- duplicate rows not allowed 
			-- rows often have a primary key(ID)- a unique identifier
		--schema: structure of a table: table's blueprint for data shape/format
			--content: actual data (a row) 
			--a schema is used to validate incoming content 
		--SQL used to CRUD data from database
			--INSERT, SELECT, UPDATE, DELETE, CREATE 
			-- SQL INNER JOIN Keyword. The INNER JOIN keyword selects all rows from both tables as long as there is
			 -- a match between the columns in both tables.
			 --for sqlite, all your info is in one file.
			 	SELECT * FROM students INNER JOIN enrollment ON students.id = enrollment.student_id --can result in info being duplicated 
			 	--every join produces a result table
		SELECT * FROM students INNER JOIN enrollment ON students.id = enrollment.student_id INNER JOIN schools ON enrollment.school_id = schools.id;
		HAVING is WHERE for aggregate functions: 
			SELECT Employees.LastName, Count(Orders.OrderID) AS NumberOfOrders FROM (Orders
			INNER JOIN Employees
			ON Orders.employeeID=Employees.EmployeeID)
			GROUP BY LastName
			HAVING COUNT(Orders.OrderID) > 10;
		SELECT COUNT(*) FROM students ...
		--group by - rows have hidden rows 
		--name rows: SELECT COUNT(*) as NUM_STUDENTS 
		--syntax: WHERE should never come after GROUP BY 
		--WHERE should also never be based on an aggregate column. WHERE can only do stuff where info was already in the table.
		--so we use HAVING instead 

		--INDEXES

		CREATE INDEX "movies_idx_name" ON "movies" ("name");
		--allow for fast lookups and keep computers happy 
		--to remove index: 
		DROP INDEX "movies_idx_name";

		--movies of each genre ordered by least popular
		SELECT COUNT(*) AS count, * FROM movies_genres GROUP BY genre 


-- indices probably implemented w somethign like a hash table in DB
--cf how to build custom indices 
--ORDER BY age, last_name 
--will put youngest first and then within those, ordered by last name (where usually it would be by primary key)

--speed: affected by scsale of info 
-- num of tables visited (but less of a performance constraint than size of the tables themselves) 
--SQL can do joins and running joins very quickly - it is optimized for it.
--inner joins much more optimized than subqueries. 
--emphasize joins and prebuilt tables when doing sql 
--but: in certain DBMS you can pick an underlying engine to translate and execute queries and you can tailor that to best-use case

--you can put like filering in combination: 
INNER JOIN movies ON roles.movie_id = movies.id AND movies.name LIKE '%spiderman%';
--RIGHT JOIN: even if there are no roles in a movie we will combine movies w  found roles we have already also movies that dont have any roles. 

RDB fundamentals 
- table: relation - colleciton of rows (tuples) with same columns (fields)
- row : tuple - an item, described by columns (fields)
- column : field - an attribute of an item, eg 'name'

schemas - blueprint for a table; difft from content(data adhering to a schema) 
- field types: INTEGER, STRING etc 
- primary keys uniquely identify rows in a table
- foreign keys refer to rows in other tables

DBMS- a program which receives DB queries (written in SQL) and translates them to disk/reads/writes
- manages DB persistence in an efficient, performant way
- uses special DS and algos eg B-trees
- user-friendly abstraction

SQL - shared syntax for making Db queries, difft dialects based on specific RDBMS
- declarative- state what you want, DBMS translates into actual execution plan
- joins: inner join (common), left join, right join, full join (less common)
- commands: SELECT
AS
INSERT
DELETE
UPDATE
FROM
JOIN
ON
WHERE
LIKE
AND
ORDER BY (asc/desc)
LIMIT
DISTINCT
GROUP BY 
COUNT
INSERT
INTERSECT

EXISTS
NOT















