-- MySQL dump 10.13  Distrib 5.7.18, for Win64 (x86_64)
--
-- Host: localhost    Database: eis_internal
-- ------------------------------------------------------
-- Server version	5.7.18-log

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
-- Table structure for table `accessory`
--

DROP TABLE IF EXISTS `accessory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accessory` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `model_name` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `purchase_price` double NOT NULL,
  `quantity` int(11) NOT NULL,
  `type` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `supplier_id` int(11) NOT NULL,
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accessory`
--

LOCK TABLES `accessory` WRITE;
/*!40000 ALTER TABLE `accessory` DISABLE KEYS */;
INSERT INTO `accessory` VALUES (1,'i3',300,189,'cpu',1),(2,'i5',500,11,'cpu',1),(3,'i7',700,200,'cpu',1),(4,'4',300,12,'memory',1),(5,'8',500,12,'memory',1),(6,'16',700,19,'memory',1),(7,'500',300,13,'hdd',1),(8,'1T',500,11,'hdd',1),(9,'SSD',700,19,'hdd',1),(10,'1050',300,12,'gpu',1),(11,'1060',500,11,'gpu',1),(12,'1070',700,20,'gpu',1),(13,'1080',1000,20,'gpu',1);
/*!40000 ALTER TABLE `accessory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `address` (
  `address` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `cid` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `cid` (`cid`),
  CONSTRAINT `address_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `customer` (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES ('九龙香港',1,1);
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `eid` int(11) NOT NULL,
  `is_del` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`cart_id`),
  KEY `cart_EndProduct` (`eid`),
  KEY `cart_Customer` (`cid`),
  CONSTRAINT `cart_Customer` FOREIGN KEY (`cid`) REFERENCES `customer` (`cid`),
  CONSTRAINT `cart_EndProduct` FOREIGN KEY (`eid`) REFERENCES `end_product` (`eid`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,1,1,1),(2,1,2,1),(3,1,3,1),(4,1,4,1),(5,1,5,1),(6,1,6,1),(7,1,7,1),(8,1,8,1),(9,1,9,1),(10,1,10,1),(11,1,11,1),(12,1,12,1),(13,1,13,1),(14,1,14,1),(15,1,15,1),(16,1,16,1),(17,1,17,1),(18,1,18,1),(19,1,19,1),(20,1,20,1),(21,1,21,1),(22,1,22,1),(23,1,23,1),(24,1,24,1),(25,1,25,1),(26,1,26,1),(27,1,27,1),(28,1,28,1),(29,1,29,1),(30,1,30,1),(31,1,31,1),(32,1,32,1),(33,1,33,1),(34,1,34,1),(35,1,35,1),(36,1,36,1),(37,1,37,1),(38,1,38,1),(39,1,39,1),(40,1,40,1),(41,1,41,1),(42,1,42,1),(43,1,43,1),(44,1,44,1),(45,1,45,1),(46,1,46,1),(47,1,47,1),(48,1,48,1),(49,1,49,1),(50,1,50,1),(51,1,51,0);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credit_card`
--

DROP TABLE IF EXISTS `credit_card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `credit_card` (
  `card_num` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `validate_code` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `cid` int(11) NOT NULL,
  PRIMARY KEY (`card_num`),
  KEY `cid` (`cid`),
  CONSTRAINT `credit_card_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `customer` (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credit_card`
--

LOCK TABLES `credit_card` WRITE;
/*!40000 ALTER TABLE `credit_card` DISABLE KEYS */;
INSERT INTO `credit_card` VALUES ('6005100232301232','808',1);
/*!40000 ALTER TABLE `credit_card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `first_name` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `last_name` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `ctime` bigint(20) NOT NULL,
  `mtime` bigint(20) NOT NULL,
  `last_login` datetime NOT NULL,
  `email` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `tel` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_del` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`cid`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'123456','Zeng','Li',20170415015603,20170415015603,'2017-04-19 23:14:47','quanlime@gmail.com','60892812',0),(2,'godtoknow','QUAN','Li',20170415104006,20170415104006,'0000-00-00 00:00:00','quanccs@163.com','86228711',0),(3,'godtoknow','A','B',20170415105244,20170415105244,'0000-00-00 00:00:00','liiqu\ran@live.com','123456',0),(4,'godtoknow','Carlos','Kar',20170415105507,20170415105507,'0000-00-00 00:00:00','liiquan@live.com','123456',0);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `end_consist_acc`
--

DROP TABLE IF EXISTS `end_consist_acc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `end_consist_acc` (
  `enid` int(11) NOT NULL AUTO_INCREMENT,
  `eid` int(11) NOT NULL,
  `aid` int(11) NOT NULL,
  PRIMARY KEY (`enid`),
  KEY `endc_EndProduct` (`eid`),
  KEY `endc_Accessory` (`aid`),
  CONSTRAINT `endc_Accessory` FOREIGN KEY (`aid`) REFERENCES `accessory` (`aid`),
  CONSTRAINT `endc_EndProduct` FOREIGN KEY (`eid`) REFERENCES `end_product` (`eid`)
) ENGINE=InnoDB AUTO_INCREMENT=389 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `end_consist_acc`
--

LOCK TABLES `end_consist_acc` WRITE;
/*!40000 ALTER TABLE `end_consist_acc` DISABLE KEYS */;
INSERT INTO `end_consist_acc` VALUES (1,1,1),(2,1,4),(3,1,7),(4,1,10),(5,2,2),(6,2,6),(7,2,9),(8,2,12),(9,3,1),(10,3,4),(11,3,7),(12,3,10),(13,4,2),(14,4,5),(15,4,8),(16,4,11),(17,5,1),(18,5,4),(19,5,7),(20,5,10),(21,6,2),(22,6,5),(23,6,8),(24,6,11),(25,7,2),(26,7,5),(27,7,8),(28,7,11),(29,8,3),(30,8,5),(31,8,9),(32,8,12),(33,9,2),(34,9,5),(35,9,8),(36,9,11),(37,10,3),(38,10,6),(39,10,9),(40,10,12),(41,11,2),(42,11,5),(43,11,8),(44,11,13),(45,12,2),(46,12,5),(47,12,8),(48,12,13),(49,13,2),(50,13,5),(51,13,8),(52,13,11),(53,14,2),(54,14,5),(55,14,8),(56,14,11),(57,15,2),(58,15,6),(59,15,9),(60,15,12),(61,16,2),(62,16,5),(63,16,8),(64,16,11),(65,17,2),(66,17,5),(67,17,8),(68,17,11),(69,18,2),(70,18,5),(71,18,8),(72,18,11),(73,19,1),(74,19,4),(75,19,7),(76,19,10),(125,22,2),(126,22,5),(127,22,8),(128,22,11),(137,23,2),(138,23,5),(139,23,8),(140,23,11),(149,24,2),(150,24,5),(151,24,8),(152,24,11),(161,25,1),(162,25,4),(163,25,7),(164,25,10),(173,26,1),(174,26,4),(175,26,7),(176,26,10),(185,27,1),(186,27,4),(187,27,9),(188,27,10),(189,28,2),(190,28,5),(191,28,8),(192,28,11),(193,29,1),(194,29,4),(195,29,9),(196,29,10),(197,30,1),(198,30,4),(199,30,7),(200,30,10),(201,31,1),(202,31,4),(203,31,7),(204,31,10),(205,32,2),(206,32,5),(207,32,8),(208,32,11),(209,33,1),(210,33,4),(211,33,7),(212,33,10),(213,34,2),(214,34,5),(215,34,8),(216,34,11),(217,35,2),(218,35,5),(219,35,8),(220,35,11),(221,36,2),(222,36,5),(223,36,8),(224,36,11),(225,37,1),(226,37,4),(227,37,7),(228,37,10),(229,38,1),(230,38,4),(231,38,7),(232,38,10),(233,39,2),(234,39,5),(235,39,8),(236,39,11),(237,40,2),(238,40,5),(239,40,8),(240,40,13),(241,41,2),(242,41,5),(243,41,8),(244,41,12),(245,21,1),(246,21,4),(247,21,7),(248,21,10),(257,20,1),(258,20,4),(259,20,7),(260,20,10),(274,42,5),(275,42,8),(276,42,2),(309,49,8),(310,49,2),(311,49,5),(312,49,11),(321,50,1),(322,50,7),(323,50,10),(324,50,4),(325,51,3),(326,51,5),(327,51,8),(328,51,11),(337,48,1),(338,48,4),(339,48,7),(340,48,10),(349,46,2),(350,46,5),(351,46,8),(352,46,11),(361,47,2),(362,47,5),(363,47,8),(364,47,11),(365,44,2),(366,44,8),(367,44,6),(368,44,11),(373,43,5),(375,43,8),(376,43,2),(385,45,1),(386,45,7),(387,45,4),(388,45,10);
/*!40000 ALTER TABLE `end_consist_acc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `end_product`
--

DROP TABLE IF EXISTS `end_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `end_product` (
  `eid` int(11) NOT NULL AUTO_INCREMENT,
  `status` int(11) NOT NULL DEFAULT '1',
  `oid` int(11) NOT NULL,
  `serial_number` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pid` int(11) NOT NULL,
  `ctime` bigint(20) DEFAULT NULL,
  `mtime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`eid`),
  UNIQUE KEY `serial_number` (`serial_number`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `end_product`
--

LOCK TABLES `end_product` WRITE;
/*!40000 ALTER TABLE `end_product` DISABLE KEYS */;
INSERT INTO `end_product` VALUES (1,0,1,NULL,3,NULL,NULL),(2,0,2,NULL,6,NULL,NULL),(3,0,2,NULL,3,NULL,NULL),(4,0,2,NULL,4,NULL,NULL),(5,0,3,NULL,3,NULL,NULL),(6,0,4,NULL,4,NULL,NULL),(7,0,5,NULL,4,NULL,NULL),(8,0,6,NULL,4,NULL,NULL),(9,0,7,NULL,4,NULL,NULL),(10,0,8,NULL,5,NULL,NULL),(11,0,8,NULL,6,1492628488128,1492628488128),(12,0,8,NULL,6,1492628699406,1492628699406),(13,0,8,NULL,6,1492628752988,1492628752988),(14,0,8,NULL,6,1492628903467,1492628903467),(15,0,9,NULL,4,1492629062965,1492629062965),(16,0,10,NULL,4,1492629092296,1492629092296),(17,0,10,NULL,5,1492629096968,1492629096968),(18,0,10,NULL,6,1492629101143,1492629101143),(19,0,10,NULL,3,1492629104982,1492629104982),(20,4,11,NULL,3,1492629164209,1492629164209),(21,4,12,NULL,2,1492629355958,1492629355958),(22,4,13,NULL,4,1492629422119,1492629422119),(23,4,13,NULL,5,1492629427327,1492629427327),(24,4,13,NULL,6,1492629431168,1492629431168),(25,4,13,NULL,3,1492629435850,1492629435850),(26,4,13,NULL,2,1492629440587,1492629440587),(27,4,13,NULL,1,1492629445588,1492629445588),(28,0,0,NULL,6,1492631179528,1492631179528),(29,0,0,NULL,1,1492631185057,1492631185057),(30,0,0,NULL,2,1492631193836,1492631193836),(31,0,0,NULL,3,1492631200346,1492631200346),(32,0,0,NULL,5,1492631583216,1492631583216),(33,0,0,NULL,3,1492631589312,1492631589312),(34,0,0,NULL,5,1492631688345,1492631688345),(35,0,0,NULL,6,1492631695160,1492631695160),(36,0,0,NULL,5,1492631814097,1492631814097),(37,0,0,NULL,3,1492631826144,1492631826144),(38,0,0,NULL,2,1492631834615,1492631834615),(39,0,0,NULL,5,1492631924828,1492631924828),(40,0,0,NULL,6,1492631935273,1492631935273),(41,0,0,NULL,4,1492631939708,1492631939708),(42,2,14,NULL,4,1492648111876,1492648111876),(43,3,14,NULL,4,1492648118737,1492648118737),(44,2,14,NULL,4,1492659951197,1492659951197),(45,4,15,NULL,8,1492661901111,1492661901111),(46,4,16,NULL,5,1492662341659,1492662341659),(47,4,17,NULL,6,1492663330199,1492663330199),(48,4,17,NULL,3,1492663336046,1492663336046),(49,4,18,NULL,4,1492666373029,1492666373029),(50,4,18,NULL,3,1492666388619,1492666388619),(51,0,0,NULL,5,1492670477691,1492670477691);
/*!40000 ALTER TABLE `end_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finance_record`
--

DROP TABLE IF EXISTS `finance_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `finance_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `description` longtext COLLATE utf8_unicode_ci,
  `ctime` bigint(20) DEFAULT NULL,
  `mtime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finance_record`
--

LOCK TABLES `finance_record` WRITE;
/*!40000 ALTER TABLE `finance_record` DISABLE KEYS */;
INSERT INTO `finance_record` VALUES (1,'salary',666677,'Salary of 06/2017',1492648955662,1492649582732),(2,'sales',888888,'Sell 10 laptops',1492648955662,NULL),(3,'debt',10000000,'Borrow money from HSBC',1492648955662,NULL),(4,'expense',-989820,'Pay for suppliers',1492648955662,NULL),(5,'salary',686868,'Salary of 07/2017',1492648955662,NULL),(6,'sales',888888,'fafafa',NULL,1492653175045),(7,'OtherIncome',999999999,'gogogogogogogo',1492649840470,NULL),(8,'Sales',10000,'Sales of Order #14',1492660053363,NULL),(9,'Sales',14500,'Sales of Order #15',1492661946012,NULL),(10,'debt',1200,'Sales of Order #16',1492662344697,1492668307020),(11,'Sales',2000,'Sales of Order #17',1492663341035,NULL),(12,'Sales',9000,'Sales of Order #18',1492666534568,NULL),(13,'expense',1000,'used for paying debts',1492667545177,NULL);
/*!40000 ALTER TABLE `finance_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operation`
--

DROP TABLE IF EXISTS `operation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `action` longtext COLLATE utf8_unicode_ci NOT NULL,
  `ctime` bigint(20) NOT NULL,
  `target_type` int(11) NOT NULL,
  `target_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operation`
--

LOCK TABLES `operation` WRITE;
/*!40000 ALTER TABLE `operation` DISABLE KEYS */;
INSERT INTO `operation` VALUES (1,400135,'{\"type\":\"PASS_CHECKING\",\"payload\":{}}',1492632408903,2,21),(2,400135,'{\"type\":\"UPDATE_ACCESSORY\",\"payload\":{}}',1492635067914,2,20),(3,400132,'{\"type\":\"START_DELIVERY\",\"payload\":{\"address\":\"\"}}',1492635344008,1,12),(4,400132,'{\"type\":\"END_DELIVERY\",\"payload\":{\"arriveTime\":1492646400000}}',1492635357949,1,12),(5,400135,'{\"type\":\"COMPLETE_ASSEMBLY\",\"payload\":{}}',1492637334861,2,20),(6,400135,'{\"type\":\"ADD_ACCESSORY_INVENTORY\",\"payload\":{\"quantity\":200}}',1492637390788,3,3),(7,400135,'{\"type\":\"PASS_CHECKING\",\"payload\":{}}',1492638390962,2,20),(8,400132,'{\"type\":\"START_DELIVERY\",\"payload\":{\"address\":\"\"}}',1492638650626,1,11),(9,400132,'{\"type\":\"END_DELIVERY\",\"payload\":{\"arriveTime\":1492646400000}}',1492638665950,1,11),(10,3,'{\"type\":\"UPDATE_ACCESSORY\",\"payload\":{}}',1492661427808,2,42),(11,3,'{\"type\":\"UPDATE_ACCESSORY\",\"payload\":{}}',1492666771024,2,49),(12,3,'{\"type\":\"COMPLETE_ASSEMBLY\",\"payload\":{}}',1492666817918,2,49),(13,3,'{\"type\":\"PASS_CHECKING\",\"payload\":{}}',1492666850009,2,49),(14,3,'{\"type\":\"UPDATE_ACCESSORY\",\"payload\":{}}',1492666904748,2,50),(15,3,'{\"type\":\"COMPLETE_ASSEMBLY\",\"payload\":{}}',1492666910472,2,50),(16,3,'{\"type\":\"PASS_CHECKING\",\"payload\":{}}',1492666915910,2,50),(17,1,'{\"type\":\"START_DELIVERY\",\"payload\":{\"address\":\"\"}}',1492667067668,1,18),(18,1,'{\"type\":\"END_DELIVERY\",\"payload\":{\"arriveTime\":1492646400000}}',1492667102838,1,18),(19,3,'{\"type\":\"UPDATE_ACCESSORY\",\"payload\":{}}',1492673661813,2,48),(20,3,'{\"type\":\"COMPLETE_ASSEMBLY\",\"payload\":{}}',1492673679015,2,48),(21,3,'{\"type\":\"PASS_CHECKING\",\"payload\":{}}',1492673683825,2,48),(22,3,'{\"type\":\"UPDATE_ACCESSORY\",\"payload\":{}}',1492673951879,2,46),(23,3,'{\"type\":\"COMPLETE_ASSEMBLY\",\"payload\":{}}',1492673962497,2,46),(24,3,'{\"type\":\"PASS_CHECKING\",\"payload\":{}}',1492673966997,2,46),(25,3,'{\"type\":\"UPDATE_ACCESSORY\",\"payload\":{}}',1492673976215,2,47),(26,3,'{\"type\":\"COMPLETE_ASSEMBLY\",\"payload\":{}}',1492673987449,2,47),(27,3,'{\"type\":\"PASS_CHECKING\",\"payload\":{}}',1492673994375,2,47),(28,3,'{\"type\":\"UPDATE_ACCESSORY\",\"payload\":{}}',1492674046069,2,44),(29,3,'{\"type\":\"UPDATE_ACCESSORY\",\"payload\":{}}',1492674058529,2,43),(30,3,'{\"type\":\"COMPLETE_ASSEMBLY\",\"payload\":{}}',1492676987484,2,43),(31,3,'{\"type\":\"UPDATE_ACCESSORY\",\"payload\":{}}',1492677277010,2,45),(32,3,'{\"type\":\"COMPLETE_ASSEMBLY\",\"payload\":{}}',1492677341462,2,45),(33,3,'{\"type\":\"PASS_CHECKING\",\"payload\":{}}',1492677350945,2,45),(34,3,'{\"type\":\"ADD_ACCESSORY_INVENTORY\",\"payload\":{\"quantity\":189}}',1492677451310,3,1);
/*!40000 ALTER TABLE `operation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order` (
  `oid` int(11) NOT NULL AUTO_INCREMENT,
  `status` int(11) NOT NULL DEFAULT '1',
  `cid` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `address` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ctime` bigint(20) DEFAULT NULL,
  `mtime` bigint(20) DEFAULT NULL,
  `arrive_time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`oid`),
  KEY `cid` (`cid`),
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `customer` (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (1,1,1,2000,NULL,NULL,NULL,NULL),(2,-1,1,10000,NULL,NULL,NULL,NULL),(3,-1,1,2000,NULL,NULL,NULL,NULL),(4,-1,1,10000,NULL,NULL,NULL,NULL),(5,-1,1,10000,NULL,NULL,NULL,NULL),(6,-1,1,10600,'九龙香港',NULL,NULL,NULL),(7,-1,1,10000,'九龙香港',NULL,NULL,NULL),(8,2,1,17500,'九龙香港',1492628904839,1492628904839,NULL),(9,1,1,10600,'九龙香港',1492629065536,1492629065536,NULL),(10,1,1,2000,'九龙香港',1492629105916,1492629105916,NULL),(11,6,1,2000,'九龙香港',1492629165154,1492629165154,1492646400000),(12,6,1,2400,'九龙香港',1492629356926,1492629356926,1492646400000),(13,6,1,3600,'九龙香港',1492629447628,1492629447628,1492646400000),(14,3,1,10000,'九龙香港',1492659954682,1492659954682,NULL),(15,4,1,14500,'九龙香港',1492661929234,1492661929234,NULL),(16,4,1,12000,'九龙香港',1492662342826,1492662342826,NULL),(17,4,1,2000,'九龙香港',1492663337379,1492663337379,NULL),(18,6,1,9000,'九龙香港',1492666396608,1492666396608,1492646400000);
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pro_consist_acc`
--

DROP TABLE IF EXISTS `pro_consist_acc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pro_consist_acc` (
  `prid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `aid` int(11) NOT NULL,
  PRIMARY KEY (`prid`),
  KEY `proc_Accessory` (`aid`),
  CONSTRAINT `proc_Accessory` FOREIGN KEY (`aid`) REFERENCES `accessory` (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pro_consist_acc`
--

LOCK TABLES `pro_consist_acc` WRITE;
/*!40000 ALTER TABLE `pro_consist_acc` DISABLE KEYS */;
INSERT INTO `pro_consist_acc` VALUES (1,1,1),(2,1,2),(3,1,4),(4,1,5),(5,1,9),(6,1,10),(7,2,1),(8,2,2),(9,2,3),(10,2,4),(11,2,5),(12,2,7),(13,2,8),(14,2,10),(15,2,11),(16,3,1),(17,3,4),(18,3,7),(19,3,10),(20,5,2),(21,5,3),(22,5,5),(23,5,6),(24,5,8),(25,5,9),(26,5,11),(27,5,12),(28,4,2),(29,4,3),(30,4,5),(31,4,6),(32,4,8),(33,4,9),(34,4,11),(35,4,12),(36,6,2),(37,6,3),(38,6,5),(39,6,6),(40,6,8),(41,6,9),(42,6,11),(43,6,12),(44,6,13),(45,7,3),(46,7,6),(47,7,8),(48,7,9),(49,7,12),(50,7,13),(51,8,1),(52,8,3),(53,8,4),(54,8,6),(55,8,7),(56,8,9),(57,8,10),(58,8,11),(59,8,12),(60,8,13),(61,4,1);
/*!40000 ALTER TABLE `pro_consist_acc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `model_name` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `primary_price` int(11) NOT NULL,
  `screen_size` int(11) NOT NULL,
  `image_url` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `ctime` bigint(20) DEFAULT NULL,
  `mtime` bigint(20) DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'XPS',2000,13,'/asset/image/xps.png',NULL,NULL,0),(2,'Inspiron',1200,15,'/asset/image/inspiron.png',NULL,NULL,0),(3,'Chromebook',800,13,'/asset/image/chromebook.png',NULL,NULL,0),(4,'Alienware13',7000,13,'/asset/image/alienware13.png',NULL,NULL,0),(5,'Alienware15',10000,15,'/asset/image/alienware15.png',NULL,NULL,0),(6,'Alienware17',15000,17,'/asset/image/alienware17.png',NULL,NULL,0),(7,'Dell2590',13300,25,'https://cdn.macrumors.com/images-new/buyers-products/macpro-2015-2.png',NULL,NULL,0),(8,'Dellxxx',13300,25,'/asset/image/alienware13.png',NULL,NULL,0);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supplier` (
  `supplier_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `tele` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `address` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`supplier_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (1,'lii@163.com','60892081','Kowlon',NULL);
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `first_name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `last_name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `role` int(11) NOT NULL,
  `salary` int(11) DEFAULT NULL,
  `tel` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ctime` bigint(20) DEFAULT NULL,
  `account` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'54ca740d496d8e81906d15f8f20181864aead3d9','Kai-shek','Chiang',4,12345,'000-0000000',1492653178353,400132),(2,'54ca740d496d8e81906d15f8f20181864aead3d9','Linus','Torvalds',5,12345,'000-0000000',1492653178353,400137),(3,'54ca740d496d8e81906d15f8f20181864aead3d9','Steve','Jobs',3,12345,'000-0000000',1492653178353,400135),(4,'54ca740d496d8e81906d15f8f20181864aead3d9','Bill','Gates',2,12345,'000-0000000',1492653178353,400136),(5,'54ca740d496d8e81906d15f8f20181864aead3d9','Richard','Stallman',1,12345,'000-0000000',1492653178353,400138);
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

-- Dump completed on 2017-04-20 16:46:36
