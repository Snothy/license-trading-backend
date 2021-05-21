CREATE TABLE chat_messages (ID INT NOT NULL AUTO_INCREMENT, 
			  chat_ID INT,
			  user_ID INT,
			  date_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			  message_content VARCHAR(512) NOT NULL,
			  PRIMARY KEY (ID),
			  FOREIGN KEY (chat_ID) REFERENCES chats (ID),
			  FOREIGN KEY (user_ID) REFERENCES users (ID));