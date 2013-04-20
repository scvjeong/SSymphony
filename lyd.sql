-- MySQL dump 10.13  Distrib 5.5.17, for Linux (x86_64)
--
-- Host: localhost    Database: lyd
-- ------------------------------------------------------
-- Server version	5.5.17-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `agenda`
--

DROP TABLE IF EXISTS `agenda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agenda` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `idx_meeting_planning` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `goal` varchar(255) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `order` int(11) NOT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agenda`
--

LOCK TABLES `agenda` WRITE;
/*!40000 ALTER TABLE `agenda` DISABLE KEYS */;
INSERT INTO `agenda` VALUES (1,1,'Idea Generation','Idea Generation','00:00:00','00:00:00',1),(2,1,'Idea Consolidation','Idea Consolidation','00:00:00','00:00:00',2),(3,1,'Idea Evaluation','Idea Evaluation','00:00:00','00:00:00',3),(4,1,'Implementation Planning','Implementation Planning','00:00:00','00:00:00',4);
/*!40000 ALTER TABLE `agenda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group`
--

DROP TABLE IF EXISTS `group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group`
--

LOCK TABLES `group` WRITE;
/*!40000 ALTER TABLE `group` DISABLE KEYS */;
/*!40000 ALTER TABLE `group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `help`
--

DROP TABLE IF EXISTS `help`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `help` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `help`
--

LOCK TABLES `help` WRITE;
/*!40000 ALTER TABLE `help` DISABLE KEYS */;
/*!40000 ALTER TABLE `help` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meeting_planning`
--

DROP TABLE IF EXISTS `meeting_planning`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meeting_planning` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `idx_onwer` int(11) NOT NULL,
  `idx_onwer_type` enum('user','group','admin') NOT NULL DEFAULT 'admin',
  `subject` varchar(255) NOT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meeting_planning`
--

LOCK TABLES `meeting_planning` WRITE;
/*!40000 ALTER TABLE `meeting_planning` DISABLE KEYS */;
INSERT INTO `meeting_planning` VALUES (1,1,'admin','Group Decision Making'),(2,1,'admin','Project Evaluation'),(3,1,'admin','Strategic Planning'),(4,1,'admin','Focus Groups and Expert Panels'),(5,1,'admin','Conflict Resolution'),(6,1,'admin','Problem Solving'),(7,1,'admin','경영 전략 회의'),(8,1,'admin','마케팅 전략 회의'),(9,1,'admin','포지션 맵 논의 회의'),(12,1,'admin','비지니스 모델 수립 회의');
/*!40000 ALTER TABLE `meeting_planning` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relation_agenda_tools`
--

DROP TABLE IF EXISTS `relation_agenda_tools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relation_agenda_tools` (
  `idx_agenda` int(11) NOT NULL,
  `idx_tools` int(11) NOT NULL,
  KEY `idx_agenda` (`idx_agenda`),
  KEY `idx_tools` (`idx_tools`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relation_agenda_tools`
--

LOCK TABLES `relation_agenda_tools` WRITE;
/*!40000 ALTER TABLE `relation_agenda_tools` DISABLE KEYS */;
/*!40000 ALTER TABLE `relation_agenda_tools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relation_group_meeting`
--

DROP TABLE IF EXISTS `relation_group_meeting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relation_group_meeting` (
  `idx_group` int(11) NOT NULL,
  `idx_meeting` int(11) NOT NULL,
  KEY `idx_group` (`idx_group`),
  KEY `idx_meeting` (`idx_meeting`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relation_group_meeting`
--

LOCK TABLES `relation_group_meeting` WRITE;
/*!40000 ALTER TABLE `relation_group_meeting` DISABLE KEYS */;
/*!40000 ALTER TABLE `relation_group_meeting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relation_user_group`
--

DROP TABLE IF EXISTS `relation_user_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relation_user_group` (
  `idx_user` int(11) NOT NULL,
  `idx_group` int(11) NOT NULL,
  KEY `idx_user` (`idx_user`),
  KEY `idx_group` (`idx_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relation_user_group`
--

LOCK TABLES `relation_user_group` WRITE;
/*!40000 ALTER TABLE `relation_user_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `relation_user_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relation_user_meeting`
--

DROP TABLE IF EXISTS `relation_user_meeting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relation_user_meeting` (
  `idx_user` int(11) NOT NULL,
  `idx_meeting` int(11) NOT NULL,
  KEY `idx_user` (`idx_user`),
  KEY `idx_meeting` (`idx_meeting`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relation_user_meeting`
--

LOCK TABLES `relation_user_meeting` WRITE;
/*!40000 ALTER TABLE `relation_user_meeting` DISABLE KEYS */;
/*!40000 ALTER TABLE `relation_user_meeting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tools`
--

DROP TABLE IF EXISTS `tools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tools` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `comment` text NOT NULL,
  `use_flag` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tools`
--

LOCK TABLES `tools` WRITE;
/*!40000 ALTER TABLE `tools` DISABLE KEYS */;
INSERT INTO `tools` VALUES (1,'list','','Y'),(2,'postit','','Y'),(3,'mindmap','','Y'),(4,'vote','','Y'),(5,'matrix','','Y');
/*!40000 ALTER TABLE `tools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `id` varchar(100) NOT NULL,
  `pw` char(32) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-04-09 23:46:35
