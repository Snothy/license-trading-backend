CREATE TABLE chats (ID INT NOT NULL AUTO_INCREMENT,
		   user_ID INT,
		   staff_ID INT DEFAULT 1,
		   status INT DEFAULT 1,
		   PRIMARY KEY (ID),
		   FOREIGN KEY (user_ID) REFERENCES users (ID),
		   FOREIGN KEY (staff_ID) REFERENCES users (ID));