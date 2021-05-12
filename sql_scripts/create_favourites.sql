CREATE TABLE favourites (user_ID,
			dog_ID,
			PRIMARY KEY(user_ID, dog_ID),
			FOREIGN KEY (user_ID) REFERENCES users (ID),
			FOREIGN KEY (dog_ID) REFERENCES dogs (ID));