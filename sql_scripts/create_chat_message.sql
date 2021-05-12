CREATE TABLE chat_message(ID INT NOT NULL AUTO_INCREMENT, 
			  chat_id,
			  user_id,
			  date_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			  message_content VARCHAR(512) NOT NULL,
			  PRIMARY KEY (ID),
			  FOREIGN KEY (chat_id) REFERENCES chat (ID),
			  FOREIGN KEY (user_id) REFERENCES users (ID));