users
INSERT INTO users (username, password, email) VALUES ('adaamin', 'mypasaasword', 'emaillaaall');
INSERT INTO users (username, password, email) VALUES ('John', 'pisslow', 'yep');
INSERT INTO users (username, password, email) VALUES ('Mary', 'wtftheheck', 'socute@gmail.com');

shelters
INSERT INTO shelters (location,contact_number) VALUES ('Coventry', '074469696969');
INSERT INTO shelters (location,contact_number) VALUES ('Manchester', '04204204204');
INSERT INTO shelters (location,contact_number) VALUES ('Liverpool', '0360360360360');

dogs
INSERT INTO dogs (shelter, name, breed, age, colour) VALUES (1, 'Bob', 'Golden Retriever', 4, 'Gold');
INSERT INTO dogs (shelter, name, breed, age, colour) VALUES (2, 'Johnny', 'Husky', 15, 'Silver');
INSERT INTO dogs (shelter, name, breed, age, colour) VALUES (1, 'Ico', 'Shina Inu', 4, 'Brown');

roles
INSERT INTO roles (name) VALUES ('administator');
INSERT INTO roles (name) VALUES ('staff');
INSERT INTO roles (name) VALUES ('user');

favourites
INSERT INTO favourites (user_ID, dog_ID) VALUES (1,1);
INSERT INTO favourites (user_ID, dog_ID) VALUES (1,2);
INSERT INTO favourites (user_ID, dog_ID) VALUES (2,2);

chat
INSERT INTO chat (user_ID, shelter_ID) VALUES (1,1);
INSERT INTO chat (user_ID, shelter_ID) VALUES (2,1);
INSERT INTO chat (user_ID, shelter_ID) VALUES (2,2);
INSERT INTO chat (user_ID, shelter_ID) VALUES (2,3);

chat_message
INSERT INTO chat_message (chat_ID, user_ID, message_content) VALUES (1, 1, 'Do you really want this dog, John?');
INSERT INTO chat_message (chat_ID, user_ID, message_content) VALUES (1, 2, 'Yes, adaamin, I REALLY want this dog!');
INSERT INTO chat_message (chat_ID, user_ID, message_content) VALUES (3, 2, 'Who are you? >:@');

users_roles
INSERT INTO users_roles (user_ID, role_ID) VALUES (1,1);
INSERT INTO users_roles (user_ID, role_ID) VALUES (2,2);
INSERT INTO users_roles (user_ID, role_ID) VALUES (3,3);

users_shelters
INSERT INTO users_shelters(user_ID, shelter_ID) VALUES (1,1);
INSERT INTO users_shelters(user_ID, shelter_ID) VALUES (2,3);
INSERT INTO users_shelters(user_ID, shelter_ID) VALUES (3,2);
