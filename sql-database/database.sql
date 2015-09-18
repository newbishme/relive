/* SQLEditor (MySQL (2))*/

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE events
(
`event_id` int(11) NOT NULL AUTO_INCREMENT,
`dateAdded` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
startDate datetime,
endDate datetime,
eventName varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
caption varchar(255) CHARACTER SET utf8 COLLATE utf8_bin,
longitude decimal(10 , 6),
latitude decimal(10 , 6),
rankPoints int(11) DEFAULT 0,
PRIMARY KEY (event_id)
) ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE crawljobs
(
crawler_id INTEGER NOT NULL AUTO_INCREMENT,
event_id int(11) NOT NULL,
startDate datetime NULL,
endDate datetime NULL,
hashtags VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
keywords VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
longitude decimal(10 , 6) NULL,
latitude decimal(10 , 6) NULL,
isActive BOOLEAN NOT NULL DEFAULT 1,
PRIMARY KEY (crawler_id)
) ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE hashtags
(
hashtag_id int(11) NOT NULL AUTO_INCREMENT,
hashtag VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL UNIQUE,
PRIMARY KEY (hashtag_id)
);

CREATE TABLE eventhashtagrelationships
(
relation_id int(11) NOT NULL AUTO_INCREMENT,
event_id int(11) NOT NULL,
hashtag_id int(11) NOT NULL,
PRIMARY KEY (relation_id)
) ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE mediaurls
(
mediaurl_id int(11) NOT NULL AUTO_INCREMENT,
media_id int(11) NOT NULL,
mediaURL varchar(255) NOT NULL,
width int(11) NOT NULL DEFAULT 0,
height int(11) NOT NULL DEFAULT 0,
sizes ENUM('low_resolution','standard_resolution','thumbnail','small','medium','thumb','large'),
PRIMARY KEY (mediaurl_id)
);

CREATE TABLE medias
(
media_id int(11) NOT NULL AUTO_INCREMENT,
post_id int(11) NOT NULL,
type ENUM('photo','video'),
PRIMARY KEY (media_id)
);

CREATE TABLE posthashtagrelationships
(
relation_id int(11) NOT NULL AUTO_INCREMENT,
post_id int(11) NOT NULL,
hashtag_id int(11) NOT NULL,
PRIMARY KEY (relation_id)
) ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE providers
(
provider_id int(11) NOT NULL AUTO_INCREMENT,
providerName varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
providerSite varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
PRIMARY KEY (provider_id)
) ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE posteventrelationships
(
relation_id int(11) NOT NULL AUTO_INCREMENT,
event_id int(11) NOT NULL,
post_id int(11) NOT NULL,
isFiltered BOOLEAN DEFAULT 0,
PRIMARY KEY (relation_id)
) ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE posts
(
post_id int(11) NOT NULL AUTO_INCREMENT,
datetime datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
postURL VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
author VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
latitude decimal(10 , 6),
longitude decimal(10 , 6),
caption TEXT CHARACTER SET utf8 COLLATE utf8_bin,
provider_id int(11) NOT NULL,
rankPoints int(11) DEFAULT 0,
PRIMARY KEY (post_id)
) ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE searchentries
(
search_id int(11) NOT NULL AUTO_INCREMENT,
datetime datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
searchKey VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
PRIMARY KEY (search_id)
) ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci;

ALTER TABLE eventhashtagrelationships ADD UNIQUE( `event_id`, `hashtag_id`);

ALTER TABLE posthashtagrelationships ADD UNIQUE( `post_id`, `hashtag_id`);

ALTER TABLE posteventrelationships ADD UNIQUE( `event_id`, `post_id`);

ALTER TABLE crawljobs ADD FOREIGN KEY event_id_idxfk (event_id) REFERENCES events (event_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE eventhashtagrelationships ADD FOREIGN KEY event_id_idxfk_1 (event_id) REFERENCES events (event_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE eventhashtagrelationships ADD FOREIGN KEY hashtag_id_idxfk (hashtag_id) REFERENCES hashtags (hashtag_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE mediaurls ADD FOREIGN KEY post_id_idxfk_1 (media_id) REFERENCES medias (media_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE medias ADD FOREIGN KEY post_id_idxfk_1 (post_id) REFERENCES posts (post_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE posthashtagrelationships ADD FOREIGN KEY post_id_idxfk (post_id) REFERENCES posts (post_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE posthashtagrelationships ADD FOREIGN KEY hashtag_id_idxfk_1 (hashtag_id) REFERENCES hashtags (hashtag_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE posteventrelationships ADD FOREIGN KEY event_id_idxfk_2 (event_id) REFERENCES events (event_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE posteventrelationships ADD FOREIGN KEY post_id_idxfk_1 (post_id) REFERENCES posts (post_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE posts ADD FOREIGN KEY provider_id_idxfk (provider_id) REFERENCES providers (provider_id) ON DELETE CASCADE ON UPDATE CASCADE;

DELIMITER $$
CREATE TRIGGER delete_posts_on_event_deletion
AFTER DELETE ON `events`
FOR EACH ROW
BEGIN
DELETE FROM `posts` WHERE post_id in (select post_id from posteventrelationships where event_id = old.event_id);
END$$
DELIMITER ;
