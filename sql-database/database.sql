/* SQLEditor (MySQL (2))*/

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE events
(
`eventId` int(11) NOT NULL AUTO_INCREMENT,
`dateAdded` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
startDate datetime,
endDate datetime,
eventName varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
caption varchar(255) CHARACTER SET utf8 COLLATE utf8_bin,
longitude decimal(10 , 6),
latitude decimal(10 , 6),
rankPoints int(11),
PRIMARY KEY (eventId)
) ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE crawljobs
(
crawlerId INTEGER NOT NULL AUTO_INCREMENT,
eventId int(11) NOT NULL,
startDate datetime NOT NULL,
endDate datetime NOT NULL,
hashtags VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
keywords VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
longitude decimal(10 , 6) NOT NULL,
latitude decimal(10 , 6) NOT NULL,
isActive BOOLEAN NOT NULL DEFAULT 1,
PRIMARY KEY (crawlerId)
) ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE hashtags
(
hashtagId int(11) NOT NULL AUTO_INCREMENT,
hashtag VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL UNIQUE,
PRIMARY KEY (hashtagId)
);

CREATE TABLE eventhashtagrelationships
(
relationId int(11) NOT NULL AUTO_INCREMENT,
eventId int(11) NOT NULL,
hashtagId int(11) NOT NULL,
PRIMARY KEY (relationId)
) ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE mediaurls
(
mediaURLId int(11) NOT NULL AUTO_INCREMENT,
mediaId int(11) NOT NULL,
width int(11) NOT NULL DEFAULT 0,
height int(11) NOT NULL DEFAULT 0,
sizes ENUM('low_resolution','standard_resolution','thumbnail','small','medium','thumb','large'),
PRIMARY KEY (mediaURLId)
);

CREATE TABLE medias
(
mediaId int(11) NOT NULL AUTO_INCREMENT,
postId int(11) NOT NULL,
type ENUM('photo','video'),
PRIMARY KEY (mediaId)
);

CREATE TABLE posthashtagrelationships
(
relationId int(11) NOT NULL AUTO_INCREMENT,
postId int(11) NOT NULL,
hashtagId int(11) NOT NULL,
PRIMARY KEY (relationId)
) ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE providers
(
providerId int(11) NOT NULL AUTO_INCREMENT,
providerName varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
providerSite varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
PRIMARY KEY (providerId)
) ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE posteventrelationships
(
relationId int(11) NOT NULL AUTO_INCREMENT,
eventId int(11) NOT NULL,
postId int(11) NOT NULL,
isFiltered BOOLEAN DEFAULT 0,
PRIMARY KEY (relationId)
) ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE posts
(
postId int(11) NOT NULL AUTO_INCREMENT,
datetime datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
postURL VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
author VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
latitude decimal(10 , 6),
longitude decimal(10 , 6),
caption VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_bin,
providerId int(11) NOT NULL,
rankPoints int(11),
PRIMARY KEY (postId)
) ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE searchentries
(
searchId int(11) NOT NULL AUTO_INCREMENT,
datetime datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
searchKey VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
PRIMARY KEY (searchId)
) ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci;

ALTER TABLE eventhashtagrelationships ADD UNIQUE( `eventId`, `hashtagId`);

ALTER TABLE posthashtagrelationships ADD UNIQUE( `postId`, `hashtagId`);

ALTER TABLE posteventrelationships ADD UNIQUE( `eventId`, `postId`);

ALTER TABLE crawljobs ADD FOREIGN KEY eventId_idxfk (eventId) REFERENCES events (eventId);

ALTER TABLE eventhashtagrelationships ADD FOREIGN KEY eventId_idxfk_1 (eventId) REFERENCES events (eventId);

ALTER TABLE eventhashtagrelationships ADD FOREIGN KEY hashtagId_idxfk (hashtagId) REFERENCES hashtags (hashtagId);

ALTER TABLE mediaurls ADD FOREIGN KEY postId_idxfk_1 (mediaId) REFERENCES medias (mediaId);

ALTER TABLE medias ADD FOREIGN KEY postId_idxfk_1 (postId) REFERENCES posts (postId);

ALTER TABLE posthashtagrelationships ADD FOREIGN KEY postId_idxfk (postId) REFERENCES posts (postId);

ALTER TABLE posthashtagrelationships ADD FOREIGN KEY hashtagId_idxfk_1 (hashtagId) REFERENCES hashtags (hashtagId);

ALTER TABLE posteventrelationships ADD FOREIGN KEY eventId_idxfk_2 (eventId) REFERENCES events (eventId);

ALTER TABLE posteventrelationships ADD FOREIGN KEY postId_idxfk_1 (postId) REFERENCES posts (postId);

ALTER TABLE posts ADD FOREIGN KEY providerId_idxfk (providerId) REFERENCES providers (providerId);
