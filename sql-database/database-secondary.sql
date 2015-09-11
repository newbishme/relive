/* SQLEditor (MySQL (2))*/

CREATE TABLE events
(
eventId int(11) NOT NULL AUTO_INCREMENT,
dateAdded DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
startDate DATETIME,
endDate DATETIME,
eventName varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
caption varchar(255) COLLATE utf8_bin,
longitude decimal(10 , 6),
latitude decimal(10 , 6),
rankPoints int(11),
PRIMARY KEY (eventId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE crawljobs
(
crawlerId INTEGER NOT NULL AUTO_INCREMENT,
eventId int(11) NOT NULL,
startDate DATETIME NOT NULL,
endDate DATETIME NOT NULL,
hashtags VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
keywords VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
longitude decimal(10 , 6) NOT NULL,
latitude decimal(10 , 6) NOT NULL,
isActive BOOLEAN NOT NULL DEFAULT 1,
PRIMARY KEY (crawlerId)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE posthashtagrelationships
(
relationId int(11) NOT NULL AUTO_INCREMENT,
postId int(11) NOT NULL,
hashtagId int(11) NOT NULL,
PRIMARY KEY (relationId)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE providers
(
providerId int(11) NOT NULL AUTO_INCREMENT,
providerName varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
providerSite varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
PRIMARY KEY (providerId)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE posteventrelationships
(
relationId int(11) NOT NULL AUTO_INCREMENT,
eventId int(11) NOT NULL,
postId int(11) NOT NULL,
isFiltered BOOLEAN DEFAULT 0,
PRIMARY KEY (relationId)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE posts
(
postId int(11) NOT NULL AUTO_INCREMENT,
postURL VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
providerId int(11) NOT NULL,
datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
latitude decimal(10 , 6),
longitude decimal(10 , 6),
mediaJSON TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
caption VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci,
rankPoints int(11),
PRIMARY KEY (postId)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE searchentries
(
searchId int(11) NOT NULL AUTO_INCREMENT,
datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
searchKey VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
PRIMARY KEY (searchId)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci;

ALTER TABLE eventhashtagrelationships ADD UNIQUE( `eventId`, `hashtagId`);

ALTER TABLE posthashtagrelationships ADD UNIQUE( `eventId`, `hashtagId`);

ALTER TABLE posteventrelationships ADD UNIQUE( `eventId`, `postId`);

ALTER TABLE crawljobs ADD FOREIGN KEY eventId_idxfk (eventId) REFERENCES events (eventId);

ALTER TABLE eventhashtagrelationships ADD FOREIGN KEY eventId_idxfk_1 (eventId) REFERENCES events (eventId);

ALTER TABLE eventhashtagrelationships ADD FOREIGN KEY hashtagId_idxfk (hashtagId) REFERENCES hashtags (hashtagId);

ALTER TABLE posthashtagrelationships ADD FOREIGN KEY postId_idxfk (postId) REFERENCES posts (postId);

ALTER TABLE posthashtagrelationships ADD FOREIGN KEY hashtagId_idxfk_1 (hashtagId) REFERENCES hashtags (hashtagId);

ALTER TABLE posteventrelationships ADD FOREIGN KEY eventId_idxfk_2 (eventId) REFERENCES events (eventId);

ALTER TABLE posteventrelationships ADD FOREIGN KEY postId_idxfk_1 (postId) REFERENCES posts (postId);

ALTER TABLE posts ADD FOREIGN KEY providerId_idxfk (providerId) REFERENCES providers (providerId);
