
INSERT INTO users (username, password, email) VALUES ('adaamin', 'mypasaasword', 'emaillaaall');
INSERT INTO users (username, password, email) VALUES ('John', 'pisslow', 'yep');
INSERT INTO users (username, password, email) VALUES ('Mary', 'wtftheheck', 'socute@gmail.com');


INSERT INTO applications (user_ID, company_name, address, postcode) VALUES (2,'pokemon', 'manchester', 'CV58GT');
INSERT INTO applications (user_ID, company_name, address, postcode) VALUES (3,'cocacola', 'liverpool', 'CV19JK');
INSERT INTO applications (user_ID, company_name, address, postcode) VALUES (2,'potato', 'lancaster', 'VY3LY3');


INSERT INTO images (imageURL, application_ID) VALUES ('something.com/something', 1);
INSERT INTO images (imageURL, application_ID) VALUES ('something.com/wow', 2);
INSERT INTO images (imageURL, application_ID) VALUES ('something.com/hehe', 3);


INSERT INTO chats (user_ID, staff_ID, status) VALUES (1,1,0);
INSERT INTO chats (user_ID, staff_ID, status) VALUES (2,1,0);
INSERT INTO chats (user_ID, staff_ID, status) VALUES (2,1,1);
INSERT INTO chats (user_ID, staff_ID, status) VALUES (2,2,1);


INSERT INTO chat_messages (chat_ID, user_ID, message_content) VALUES (1, 1, 'Do you really want this license , John?');
INSERT INTO chat_messages (chat_ID, user_ID, message_content) VALUES (1, 2, 'Yes, adaamin, I REALLY want this license!');
INSERT INTO chat_messages (chat_ID, user_ID, message_content) VALUES (3, 2, 'Who are you? >:@');


INSERT INTO roles (name) VALUES ('administator');
INSERT INTO roles (name) VALUES ('staff');
INSERT INTO roles (name) VALUES ('user');


INSERT INTO users_roles (user_ID, role_ID) VALUES (1,1);
INSERT INTO users_roles (user_ID, role_ID) VALUES (2,2);
INSERT INTO users_roles (user_ID, role_ID) VALUES (3,3);
