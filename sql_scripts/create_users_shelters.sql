CREATE TABLE users_shelters (user_ID INT,
			    shelter_ID INT,
			    PRIMARY KEY(user_ID, shelter_ID),
			    FOREIGN KEY (user_ID) REFERENCES users (ID),
			    FOREIGN KEY (shelter_ID) REFERENCES shelters (ID));
