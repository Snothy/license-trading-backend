CREATE TABLE chat (ID INT NOT NULL AUTO_INCREMENT,
		   user_ID INT,
		   shelter_ID INT,
		   PRIMARY KEY (ID),
		   FOREIGN KEY (user_ID) REFERENCES users (ID),
		   FOREIGN KEY (shelter_ID) REFERENCES shelters (ID));