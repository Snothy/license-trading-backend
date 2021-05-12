CREATE TABLE chat (id INT NOT NULL AUTO_INCREMENT,
		   user1,
		   user2,
		   PRIMARY KEY (ID),
		   FOREIGN KEY (user1) REFERENCES users (username),
		   FOREIGN KEY (user2) REFERENCES users (username));