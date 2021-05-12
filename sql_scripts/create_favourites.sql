CREATE TABLE favourites (user_ID INT,
			dog_ID INT,
			PRIMARY KEY(user_ID, dog_ID),
			FOREIGN KEY (user_ID) REFERENCES users (ID),
			FOREIGN KEY (dog_ID) REFERENCES dogs (ID));