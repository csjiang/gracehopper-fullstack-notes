CREATE TABLE actors(
	id INTEGER PRIMARY KEY, --can't use INT for primary key 
	first_name TEXT NULL,
	last_name TEXT NULL,
	gender TEXT NULL
	);

CREATE TABLE roles(
	actor_id INTEGER,
	movie_id INTEGER,
	role_name TEXT NULL
	);

--commands: .tables 
--.schema tablename --> shows the CREATE TABLE statement that created that table
--.help: display more commands

 SELECT name, year FROM movies WHERE year = 1902 AND rank > 5;

 --Find all movie-names that have the word "Car" as the first word in the name.

SELECT name FROM movies WHERE name LIKE 'Car %';

SELECT * FROM movies WHERE year = 1993;

SELECT COUNT(*) as num_movies_1982 FROM movies WHERE year = 1982;

SELECT * FROM actors WHERE last_name LIKE '%stack%';

SELECT COUNT(*) as count, first_name AS first_name FROM actors GROUP BY first_name ORDER BY count DESC LIMIT 10;
SELECT COUNT(*) as count, last_name AS last_name FROM actors GROUP BY last_name ORDER BY count DESC LIMIT 10;

SELECT COUNT(*) as count, first_name, last_name FROM actors INNER JOIN roles ON roles.actor_id = actors.id GROUP BY actor_id ORDER BY count DESC LIMIT 100;


--movies of each genre ordered by least popular
SELECT COUNT(*) AS count, genre FROM movies_genres GROUP BY genre ORDER BY count;

--List the first and last names of all the actors who played in the 1995 movie 'Braveheart', arranged alphabetically by last name.
SELECT first_name, last_name FROM actors INNER JOIN 
(SELECT * FROM roles INNER JOIN 
	(SELECT * FROM movies WHERE name = 'Braveheart') 
	as mm ON mm.id = roles.movie_id) 
as braveheart_roles ON braveheart_roles.actor_id = actors.id ORDER BY last_name;

-- List all the directors who directed a 'Film-Noir'-genre movie in a leap year (for the sake of this challenge, pretend that all years divisible by 4 are leap years — which is not true in real life). Your query should return director name, the movie name, and the year, sorted by movie name.
SELECT first_name, last_name, movie_name, year 
FROM (SELECT * 
	FROM directors INNER JOIN (SELECT * 
		FROM movies_genres INNER JOIN (SELECT id, name AS movie_name, year 
			FROM movies) as movies ON movies_genres.movie_id = movies.id) 
	as movies_and_genres WHERE genre = 'Film-Noir') WHERE year % 4 = 0 ORDER BY movie_name;
--overuse of subselects
--aliasing full results by wrapping everything in parentheses + then doing AS after could make things weird 
SELECT first_name || ' ' || last_name AS director_name, name AS movie_name, year FROM directors 
	INNER JOIN movies_directors ON directors.id = movies_directors.director_id 
		INNER JOIN movies_genres AS mg ON mg.movie_id = movies_directors.movie_id AND mg.genre = 'Film-Noir' 
			INNER JOIN movies ON mg.movie_id = movies.id
				WHERE year % 4 = 0 ORDER BY name;

--List all the actors that have worked with Kevin Bacon in Drama movies (include the movie name). Please exclude Mr. Bacon himself from the results.

SELECT sub.*
	FROM (
		SELECT * FROM roles
				INNER JOIN actors )

SELECT name, first_name, last_name FROM (
	SELECT name, bacon_id, movie_id AS bacon_movie_id FROM (
		SELECT first_name AS first_name, last_name AS last_name, id AS bacon_id FROM actors 
		WHERE first_name = 'Kevin' AND last_name = 'Bacon' 
		) bacon_id 
			INNER JOIN roles ON roles.actor_id = bacon_id.bacon_id
				INNER JOIN movies ON movies.id = movie_id) bacon_movies
					INNER JOIN movies_genres ON movies_genres.movie_id = bacon_movies.bacon_movie_id
						INNER JOIN roles ON roles.movie_id = bacon_movies.bacon_movie_id
							INNER JOIN actors ON actors.id = roles.actor_id 
								WHERE genre = 'Drama' AND actor_id != bacon_id;

-- Kevin Bacon ID from actors where name = kevin bacon 
-- select roles where actor id = kevin bacon id and output movie ids of kevin bacon movies from that 
-- select movies where movie id matches that movie id 
-- join movies_genres where movies_genres.movie_id = movies.movie_id where genre = drama 
-- join roles where movie id matches that movie id and actor id != kevin bacon actor id
-- join actors where actor id matches the ones in roles and get name from that 



-- Which actors have acted in a film before 1900 and also in a film after 2000? 
-- NOTE: we are not asking you for all the pre-1900 and post-2000 actors — 
-- we are asking for each actor who worked in both eras!

SELECT * FROM (
	SELECT first_name, last_name, actor_id FROM movies
		INNER JOIN roles ON roles.movie_id = movies.id
			INNER JOIN actors ON actors.id = actor_id
				WHERE year > 2000)
INTERSECT 
SELECT * FROM (
	SELECT first_name, last_name, actor_id FROM movies
		INNER JOIN roles ON roles.movie_id = movies.id
			INNER JOIN actors ON actors.id = actor_id
				WHERE year < 1900) ORDER BY last_name;

--Find actors that played five or more DISTINCT roles in the same movie after the year 1990.
SELECT first_name, last_name, name, year, COUNT(DISTINCT role) AS num_roles FROM 
	(SELECT * FROM movies 
		INNER JOIN roles ON roles.movie_id = id
		WHERE year > 1990
		) post_1990_roles
	INNER JOIN actors ON actors.id = post_1990_roles.actor_id
		GROUP BY actor_id, movie_id
			HAVING num_roles >= 5;

-- For each year, count the number of movies in that year that had only female actors. 
-- You might start by including movies with no cast, but your ultimate goal is to narrow your 
-- query to only movies that have a cast.

SELECT year, COUNT(*) as femaleOnly FROM 
	(SELECT movie_id, COUNT(*) as num_roles from roles
		INNER JOIN (
		SELECT * FROM actors
			WHERE gender = 'F'
			) female_actors
		ON female_actors.id = roles.actor_id
		GROUP BY movie_id
	INTERSECT 
	SELECT movie_id, COUNT(*) as num_roles from roles
		INNER JOIN actors ON actors.id = roles.actor_id
		GROUP BY movie_id) female_only_movies
		INNER JOIN movies ON movies.id = female_only_movies.movie_id
		GROUP BY year ORDER BY year;

--join roles actors and group by movie id count roles per movie
-- join roles (sub- female actors) and group by movie id count roles per movie BUT only female actors 
--intersect 1 and 2 and then oyu get the movies that have only female actors and where num_roles > 0
-- join the intersected thing with movies and group by year count number of movies and select that as femaleOnly 













	
