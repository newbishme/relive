/* SQLEditor (MySQL (2))*/

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
ALTER DATABASE `relive` CHARACTER SET utf8mb4 COLLATE utf8mb4_bin ;

DROP TABLE IF EXISTS `crawljobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crawljobs` (
  `crawler_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `hashtags` varchar(255) DEFAULT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `longitude` decimal(10,6) DEFAULT NULL,
  `latitude` decimal(10,6) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `delay` int(11) NOT NULL DEFAULT '10',
  PRIMARY KEY (`crawler_id`),
  KEY `event_id_idxfk` (`event_id`),
  CONSTRAINT `crawljobs_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `eventhashtagrelationships`
--

DROP TABLE IF EXISTS `eventhashtagrelationships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eventhashtagrelationships` (
  `relation_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `hashtag_id` int(11) NOT NULL,
  PRIMARY KEY (`relation_id`),
  UNIQUE KEY `event_id` (`event_id`,`hashtag_id`),
  KEY `hashtag_id_idxfk` (`hashtag_id`),
  CONSTRAINT `eventhashtagrelationships_ibfk_6` FOREIGN KEY (`hashtag_id`) REFERENCES `hashtags` (`hashtag_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `eventhashtagrelationships_ibfk_5` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `event_id` int(11) NOT NULL AUTO_INCREMENT,
  `dateAdded` int(11) DEFAULT NULL,
  `startDate` int(11) DEFAULT NULL,
  `endDate` int(11) DEFAULT NULL,
  `eventName` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `caption` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `longitude` decimal(10,6) DEFAULT NULL,
  `latitude` decimal(10,6) DEFAULT NULL,
  `rankPoints` int(11) DEFAULT '0',
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Table structure for table `hashtags`
--

DROP TABLE IF EXISTS `hashtags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hashtags` (
  `hashtag_id` int(11) NOT NULL AUTO_INCREMENT,
  `hashtag` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`hashtag_id`),
  UNIQUE KEY `hashtag` (`hashtag`)
) ENGINE=InnoDB AUTO_INCREMENT=82197 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `medias`
--

DROP TABLE IF EXISTS `medias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medias` (
  `media_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `type` enum('photo','video') DEFAULT NULL,
  PRIMARY KEY (`media_id`),
  KEY `post_id_idxfk_1` (`post_id`),
  CONSTRAINT `medias_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=148439 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mediaurls`
--

DROP TABLE IF EXISTS `mediaurls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mediaurls` (
  `mediaurl_id` int(11) NOT NULL AUTO_INCREMENT,
  `media_id` int(11) NOT NULL,
  `mediaURL` varchar(255) NOT NULL,
  `width` int(11) NOT NULL DEFAULT '0',
  `height` int(11) NOT NULL DEFAULT '0',
  `sizes` enum('low_resolution','standard_resolution','thumbnail','small','medium','thumb','large') DEFAULT NULL,
  PRIMARY KEY (`mediaurl_id`),
  KEY `post_id_idxfk_1` (`media_id`),
  CONSTRAINT `mediaurls_ibfk_2` FOREIGN KEY (`media_id`) REFERENCES `medias` (`media_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=497957 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `posteventrelationships`
--

DROP TABLE IF EXISTS `posteventrelationships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posteventrelationships` (
  `relation_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `isFiltered` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`relation_id`),
  UNIQUE KEY `event_id` (`event_id`,`post_id`),
  KEY `post_id_idxfk_1` (`post_id`),
  CONSTRAINT `posteventrelationships_ibfk_4` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `posteventrelationships_ibfk_3` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=281506 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `posthashtagrelationships`
--

DROP TABLE IF EXISTS `posthashtagrelationships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posthashtagrelationships` (
  `relation_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `hashtag_id` int(11) NOT NULL,
  PRIMARY KEY (`relation_id`),
  UNIQUE KEY `post_id` (`post_id`,`hashtag_id`),
  KEY `hashtag_id_idxfk_1` (`hashtag_id`),
  CONSTRAINT `posthashtagrelationships_ibfk_4` FOREIGN KEY (`hashtag_id`) REFERENCES `hashtags` (`hashtag_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `posthashtagrelationships_ibfk_3` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=523902 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `datetime` int(11) DEFAULT NULL,
  `postURL` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `author` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `latitude` decimal(10,6) DEFAULT NULL,
  `longitude` decimal(10,6) DEFAULT NULL,
  `caption` mediumtext COLLATE utf8mb4_bin,
  `provider_id` int(11) NOT NULL,
  `rankPoints` int(11) DEFAULT '0',
  PRIMARY KEY (`post_id`),
  KEY `provider_id_idxfk` (`provider_id`),
  CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`provider_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=281575 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `providers`
--

DROP TABLE IF EXISTS `providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `providers` (
  `provider_id` int(11) NOT NULL AUTO_INCREMENT,
  `providerName` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `providerSite` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`provider_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `searchentries`
--

DROP TABLE IF EXISTS `searchentries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `searchentries` (
  `search_id` int(11) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `searchKey` varchar(255) NOT NULL,
  PRIMARY KEY (`search_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
