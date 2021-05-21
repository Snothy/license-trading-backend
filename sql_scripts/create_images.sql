CREATE TABLE images ( ID INT NOT NULL AUTO_INCREMENT,
			imageURL VARCHAR(64),
			application_ID INT,
			PRIMARY KEY (ID),
			FOREIGN KEY (application_ID) REFERENCES applications (ID));