CREATE TABLE users_shelters (user_ID,
			    shelter_ID,
			    PRIMARY KEY(user_ID, shelter_ID),
			    FOREIGN KEY (user_ID) REFERENCES users (ID),
			    FOREIGN KEY (shelter_ID) REFERENCES shelters (ID));
