CREATE TABLE users_roles (user_ID INT,
			 role_ID INT,
			 PRIMARY KEY(user_ID, role_ID),
			 FOREIGN KEY (user_ID) REFERENCES users (ID),
			 FOREIGN KEY (role_ID) REFERENCES roles (ID));

			 