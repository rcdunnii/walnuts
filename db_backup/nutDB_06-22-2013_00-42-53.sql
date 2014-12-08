-- MySQL dump 10.13  Distrib 5.5.16, for Win32 (x86)
--
-- Host: localhost    Database: walnuts
-- ------------------------------------------------------
-- Server version	5.5.16

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
-- Table structure for table `bdays`
--

DROP TABLE IF EXISTS `bdays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bdays` (
  `bDayID` int(11) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(30) NOT NULL,
  `MiddleInit` char(2) DEFAULT NULL,
  `LastName` varchar(50) NOT NULL,
  `bDayYYYY` char(4) DEFAULT NULL,
  `bDayMM` char(3) NOT NULL,
  `bDayDD` char(2) NOT NULL,
  `WalnutID` int(11) DEFAULT NULL,
  PRIMARY KEY (`bDayID`),
  KEY `name` (`LastName`,`MiddleInit`,`FirstName`),
  KEY `bdMonth` (`bDayMM`),
  KEY `bDayDD` (`bDayDD`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bdays`
--

LOCK TABLES `bdays` WRITE;
/*!40000 ALTER TABLE `bdays` DISABLE KEYS */;
INSERT INTO `bdays` VALUES (1,'Rocky','','Petre','','01','03',NULL),(2,'Ray','','Salter','','01','06',NULL),(3,'Abigail','','Gatch','','01','12',NULL),(4,'Helene','','Tatum','','01','21',NULL),(5,'Qun','','Sha','','01','23',NULL),(6,'Caroline','','Petre','','01','23',NULL),(7,'Anne','','Easthope','','01','28',NULL),(8,'Laurence','','O\'Toole','','01','29',NULL),(9,'Hugo','','Salter','','01','30',NULL),(10,'Cynthia','','Cromie','','02','03',NULL),(11,'Cate','','Judy','','02','28',NULL),(12,'Chloe','','Scott-Moncrieff','','02','26',NULL),(13,'Daryll','','Cooke','','02','19',NULL),(14,'Emma Louise','','Petre','','02','08',NULL),(15,'Edward','','Petre','','02','05',NULL),(16,'Manning','','Kalish','','06','04',NULL),(17,'Shariq/Musa','','Siddiqui','','06','30',NULL),(18,'Fenella','','Gray','','06','08',NULL),(19,'Bob','','Dunn, Jr','','06','29',NULL),(20,'Kathy','','Skinner','','06','08',NULL),(21,'Barbara','','Gatch','','06','28',NULL),(22,'Will','','Tatum','','06','10',NULL),(23,'Gin','','Cromie','','06','24',NULL);
/*!40000 ALTER TABLE `bdays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hash`
--

DROP TABLE IF EXISTS `hash`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hash` (
  `Walnut` text NOT NULL,
  `Foxy` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hash`
--

LOCK TABLES `hash` WRITE;
/*!40000 ALTER TABLE `hash` DISABLE KEYS */;
INSERT INTO `hash` VALUES ('563971f51f5842ea7b4dae7485e0095357101d8698824264dea77aba542e35fcbff10c7beaf6403f9f352aff09a32308f50868a71c27eeaafab9121ee66a9efe','2d5baeb6f13b0d31c84cfa4b5e8bd40940eb6c259caf387e997dab3c9ac02d6a9bbac0ee4f58bf3dec1869c9893b533ae43647682dc6ba1025ee696194757ccb'),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('',''),('','');
/*!40000 ALTER TABLE `hash` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nuts`
--

DROP TABLE IF EXISTS `nuts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nuts` (
  `walnutID` int(11) NOT NULL AUTO_INCREMENT,
  `SirName` varchar(30) DEFAULT NULL,
  `Names` varchar(50) DEFAULT NULL,
  `FormalNames` varchar(50) DEFAULT NULL,
  `Children` varchar(50) DEFAULT NULL,
  `Addr1` varchar(35) DEFAULT NULL,
  `Addr2` varchar(10) DEFAULT NULL,
  `Addr3` varchar(35) DEFAULT NULL,
  `Addr4` varchar(35) DEFAULT NULL,
  `Email1` varchar(30) DEFAULT NULL,
  `Email2` varchar(30) DEFAULT NULL,
  `Email3` varchar(30) DEFAULT NULL,
  `Phone1` varchar(40) DEFAULT NULL,
  `Phone2` varchar(40) DEFAULT NULL,
  `Notes` varchar(90) DEFAULT NULL,
  `Created` datetime NOT NULL,
  `Updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`walnutID`)
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nuts`
--

LOCK TABLES `nuts` WRITE;
/*!40000 ALTER TABLE `nuts` DISABLE KEYS */;
INSERT INTO `nuts` VALUES (2,'Cromie','Dan and Susan Egan Cromie','Mr and Mrs Daniel and Susan Egan Cromie','Katie, Liam, Jack','77 Lindale Street','','Stamford, CT 06902','USA','dcromie@atlasholdingsllc.com','susanegancromie@gmail.com','','H 203-274-6758','C 917-406-9049','','2013-03-10 22:02:37','2013-04-01 16:31:09'),(3,'OToole','Clare and Laurence OToole','Mr and Mrs Laurence OToole','Darren Maeve','Ballaghclay','','Clonmore Co. Carlow','Ireland','otoolelp@gmail.com','toclare@gmail.com','','Cell (011)-353 [0] 86 155 9644','','Need to verify the cell #','2013-03-10 22:02:37','2013-04-25 20:13:00'),(5,'Cromie','Gin Cromie','Ms. Virginia S. Cromie','','665 Metropolitan Ave','Apt 3','Brooklyn, NY 11211','USA','gincromie@gmail.com','','','Cell 718-564-4690','','','2013-03-10 22:02:37','2013-04-01 16:27:26'),(6,'Cromie','Bill Cromie Jr','Mr. William J. Cromie Jr.','','665 Metropolitan Ave','Apt 3','Brooklyn, NY 11211','USA','bill.cromie@gmail.com','none','','C 917-215-3576','','','2013-03-10 22:02:37','2013-04-15 03:00:28'),(7,'Cromie','Cynthia (Skinner) and Bill Cromie','Dr. and Mrs William J. Cromie','','157 Lancaster Street','','Albany, NY 12210','USA','burlturn@gmail.com','ccromie@capital.net','','H 518-432-8962','C 518-866-2372','','2013-03-10 22:02:37','2013-04-15 14:48:43'),(8,'Dollimore','Anne (Withers) Dollimore','Mrs. Colin Dollimore','','6305 Pershing Ave','','St. Louis, Mo','USA','adollimore@sbcglobal.net','','','H 314-863-0622','','','2013-03-10 22:02:37','2013-06-19 03:56:39'),(9,'Dunn','Sarah (Skinner) and Bob Dunn Jr.','Dr. and Mrs. Robert C. Dunn Jr.','','390 Moll Rd.','','Augusta, Mo.','USA','rcdunnii@gmail.com','ssdunnii@gmail.com','','H 636-798-2100','C 314-775-3616','','2013-03-10 22:02:37','2013-03-09 13:15:49'),(10,'Dunn','Bob and Mary Dunn','Mr. and Mrs. Robert Dunn III','Bobby, Frank, John, Agnes','6055 Lindell Blvd','','St. Louis, Mo. 63112','USA','mdunn12@slu.edu','bdunn@tscp.com','','H 314-727-0120','C 314-397-3074','','2013-03-10 22:02:37','2013-03-09 13:15:49'),(20,'Easthope','Anne (Hollo) and David Easthope','Mr. and Mrs. David Easthope','Henry','1848 Filbert St','','San Francisco, CA 94123','USA','davideasthope@gmail.com','aeasthope@yahoo.com','','Anne Cell 415-203-1792','David Cell 415-994-2578','These cell phone numbers need to be verified','2013-03-10 22:02:37','2013-03-09 18:10:59'),(21,'Fehlig','Sarah (Gatch) and Ed Fehlig','Mr. and Mrs. Edward Fehlig','','16 Washington Terrace','','St Louis Mo.','USA','sarafehlig@gmail.com','','','314-361-7318','','','2013-03-10 22:02:37','2013-03-09 13:15:49'),(22,'Fehlig','Ed Fehlig Jr.','Mr. Edward Fehlig Jr.','','3450 Wyoming Ave.','','St. Louis, Mo.63118','USA','ed@fehlig.com','www.fehlig.com','','Cell 314-359-5690','W - 314-367-8911','','2013-03-10 22:02:37','2013-03-09 13:15:49'),(23,'Gatch','Calvin and Barbara Gatch','Mr. and Mrs. Calvin F. Gatch Jr.','','10086 Lake Eleanor Rd.','','Dubuque IA 52003','USA','cgatchjr@aol.com','','','H 563-556-8732','','','2013-03-10 22:02:37','2013-03-09 13:15:49'),(24,'Gatch','Calvin and Becky','Mr. and Mrs. Calvin F. Gatch III','Daisy, Abigail','1763 Old Lancaster','','Platteville, WI 53818','USA','calboy@centurytel.net','','','H 608-348-7983','','','2013-03-10 22:02:37','2013-03-09 13:15:49'),(29,'Gatch','Emily Gatch','Ms Emily Gatch','','PO BOX 1486','','La Conner, WA 98257','USA','emily.gatch@gmail.com','','','H 773-314-3171','C 505-927-5254','','2013-03-10 22:02:37','2013-03-09 13:15:49'),(30,'Halcomb','Liza (Dunn) ',' Dr. Liza Halcomb','J.T. and Charlie','6236 Waterman Ave','','St Louis, Mo 63110','USA','halcombs@wusm.wistl.edu','','','Liza Cell 314-799-9589','Jim Cell 314-799-9588','','2013-03-10 22:02:37','2013-04-14 02:13:36'),(31,'Weise','Carolyn (Purple) and Rick Weise','','Collin Kate Lara','PO BOX 28','','Vancourt, Texas 76955','USA','','','','H 325-469-3975','','None','2013-03-10 22:02:37','2013-03-09 13:15:49'),(32,'Niehues','Tibby and Rory','','Taylor, Page','1550 CR 125','','Garden City, TX 79739','USA','','','','H 432-354-2220','','Tx cousins','2013-03-10 22:02:37','2013-03-24 15:36:53'),(33,'Mueller','Leslie(Deceased) and Fred Mueller','','Amanda (married), Ariel and Alex','2102 Schwartz Rd','','San Angelo, TX, 76904','USA','steelfred@muellermetals.com','','','H 325-651-1865','W 325-651-9558','Tx cousins','2013-03-10 22:02:37','2013-03-09 13:15:49'),(34,'Johnston','Dick and Joan Johnston','','','PO BOX 82','','Vancourt, TX, 76955','USA','','','','H 325-469-3928','','','2013-03-10 22:02:37','2013-04-01 15:41:41'),(35,'Johnston','Bill and Michelle Johnston','','Will, Alyssa, Trey','PO BOX 680','','George West Texas, 78022','USA','','','','H 361-937-7038','','Tx cousins','2013-03-10 22:02:37','2013-05-19 21:08:01'),(36,'Halfmann','Alex and Meghan (Niehues) Halfmann','','','514 N. Dove','','Lubbock, TX 79416','USA','','','','','','','2013-03-10 22:02:37','2013-05-19 21:07:01'),(37,'Gleghorne','Ginnie and Kevin Gleghorne','','Darian, Regan','','PO BOX 83','Vancourt, TX, 76955','USA','','','','H 325-469-3357','','','2013-03-10 22:02:37','2013-03-09 13:15:49'),(38,'Denis','Mark and Dorothy Denis','','Kevin, Jessica','PO BOX 39','','Vancourt, TX, 76955','USA','','','','H 325-469-3926','','','2013-03-10 22:02:37','2013-05-19 21:05:56'),(39,'Skinner','Tersh and Kathy Skinner','Mr and Mrs Lemoine Skinner III','','1334 8th Ave','','San Francisco, CA 94122','USA','ls@gwtaxlaw.com','KSkinner@mofo.com','','H 415-566-1365','W 415-819-0058','Kathy\'s Cell # 415-819-0058','2013-03-10 22:52:54','2013-03-11 04:21:31'),(40,'Skinner','Kate Skinner','','','1334 8th Ave','','San Francisco, CA 94122','USA','skskinner@usfca.edu','','','C 415-613-9059','','','2013-04-15 13:16:49','2013-04-15 18:16:49'),(41,'Skinner','Sophie Skinner','','','1334 8th Ave','','San Francisco, CA 94122','USA','sskinner@oberlin.edu','','','C 415-613-9066','','','2013-04-15 13:49:39','2013-04-15 18:49:39'),(42,'Smith','Kate (Dunn) Smith','Ms Kate Smith','Peter, Sarah, Isabel, Margaret','901 Gregory Ave','','Wilmette, IL 60091','USA','kddsmith@gmail.com','','','C 847-845-3416','','','2013-04-15 13:52:50','2013-04-15 18:52:50'),(44,'Tatum','Helene (Fehlig) and Trey Tatum','Dr. and Mrs Paul Tatum','Adriana and Will','215 West Parkway Dr.','','Columbia, MO 65203','USA','familiatatum@gmail.com','doctatum@gmail.com','adritatum@gmail.com','Helene C 573-999-4266','Trey C 573-999-0355','','2013-04-15 13:59:05','2013-04-15 18:59:05'),(45,'Cremins','Jeanne and Leo Cremins','Mr and Mrs Leo P. Cremins','','7923 Kingsbury Blvd','Apt 200','St Louis, MO 63105-3861','USA','jdc140@sbcglobal.net','creminsleo@sbcglobal.net','','314-803-5443','','','2013-04-15 16:53:11','2013-04-15 22:22:01'),(46,'Wynn-Owen','Gareth and Molly Wynn-Owen','','Alicia','PF 043719','BF PO 5298','HA 4 6EP','UK','mmhollo@yahoo.com','garethwynnown@yahoo.co.uk','','','','','2013-04-15 17:24:40','2013-04-15 22:24:40'),(48,'Skinner','Charlie Skinner','Captain Charles Skinner','','5106 Deerfield Circle Dr','','St Louis Mo 63128','USA','','','','H 314-842-5892','C 314-753-4777','Mail: PO BOX 51549, St Louis, Mo. 63151','2013-04-15 17:30:44','2013-04-15 22:30:44'),(52,'Skinner Kadel','Clay Skinner and Jean Kadel','','','151 Ray Street','','Hinckley IL 60520','USA','skinner@imsa.edu','','','Clay Cell 815-931-0712','Jean Cell 815-823-3419','','2013-04-15 17:40:31','2013-04-15 22:40:31'),(53,'Quicks in Maine','','','','Noorthmoor','153 Tip To','Vinalhaven ME 04863','USA','','','','207-867-4414','','','2013-04-15 17:50:22','2013-04-15 22:50:22'),(54,'Dunns in Michigan','','','','1018 Hessel Point Rd','','Hessel, MI 49745','USA','','','','906-484-6048','','','2013-04-15 17:52:15','2013-04-15 22:52:15'),(55,'Cromie\'s Camp','','','','1242 Kathan Rd','','Corinth NY 12822','USA','','','','518-696-2287','','','2013-04-15 18:10:52','2013-05-19 21:05:41'),(56,'Cromie Trois Soeurs','','','','832 Point Rd','','Willsboro NY 12996','USA','','','','Bill Cell 518-866-2372','','','2013-04-15 18:13:20','2013-05-19 21:05:26'),(57,'Skinners Rhode Island','','','','360 Beavertail Road','','Jamestown RI 02835','USA','','','','401-423-2314','','','2013-04-15 18:14:37','2013-05-19 21:07:18'),(58,'Gray','Fenella (Petre) and Andrew Gray','','Jonathan, Simon, Philip','65 Peterborough Road','','London SW 6 3BT','UK','fenellagray@waitrose.com','','','H (011) {00} 44 [0] 125 646 3384','','','2013-04-25 04:33:37','2013-05-19 21:06:24'),(59,'Abright','John and Mandy Mueller Abright','','','270 West 3rd Street','','Williamsport PA 17701','USA','','','','C 979-450-1808','','','2013-04-25 13:52:51','2013-06-13 14:59:36'),(60,'Salter','Nicholas Salter','','','12 Thurloe Place','Flat 5','London SW 7 2RZ','UK','salter@msn.com','','','H(001) {00} 44 [0] 125 6 47 1 ','C (001) {00} 44 [0] 125 6 47 1','','2013-04-25 13:52:51','2013-05-19 21:08:46'),(61,'Scott-Montcrief','Claudia (Petre) and Ambrose Scott-Moncrief','','','Ragmore Cottage, Tunworth','Nr Basings','Hampshire RG25 2LF','UK','','','','H -(011) {00} 44 [0] 125 6 47 ','','','2013-04-25 13:52:51','2013-05-19 21:07:39'),(62,'Scott-Moncrief','Chloe Scott-Moncrief and Oliver Jones','','','031 Sapperton Court, Gee St','','London, EC1V 3RR','UK','chloe@typeshop.co.uk','','','','','','2013-04-25 13:52:51','2013-04-24 23:45:12'),(63,'Bancroft-Cooke','Nicholas Bancroft-Cooke','','','China Central Place, Chaoyang Distr','Apt 2701 B','Beijing','China','ubancroft@yahoo.com','','','China Cell 0086 132 4180 8603','UK Cell (011) {00} 44 [0] 797 ','','2013-04-25 13:52:51','2013-04-25 02:24:07'),(64,'Bancroft-Cooke','Sacha Bancroft-Cooke and Alberto Marcos Flores','','Siena and Cala','4. isq. Calle Caranza 17 ','','2804 Madrid','Spain','sachabancroft@gmail.com','','','H (011){00}34 914 455 004','','','2013-04-25 13:52:51','2013-05-08 16:57:06'),(67,'Petre','Charles and Melanie Petre','','','Tunworth Down House','Tunworth','Nr. Basingstoke, Hampshire RG25 2LD','UK','melanie.petre@btopenworld.com','','','H (011) {00} 44 [0] 125 646 3384','','','2013-04-25 20:09:05','2013-04-25 20:09:05'),(68,'Salter','Alicia (Cooke) and Ray Salter','','','42 Broad Street','','Alresford, Hants SO24 49AN','UK','alicia@aliciasalter.com','','','H- (011) {00}44 [0] 196 277 1704','','','2013-05-19 20:58:55','2013-05-19 21:08:33'),(69,'Petre','Rocky and Caroline Petre','','','Down Farm House','','Nr. Basingstoke, Hampshire RG25 2LE','UK','caroline.petre@virgin.net','','','H- (011) {00} 44 [0] 125 647 1 716','','','2013-05-19 21:02:29','2013-05-19 21:02:29'),(70,'Petre','Edward and Lucy Petre','','George, Bertie','54 Westcroft Square','','London W6 OTA','UK','petre.edward@gmail.com','','','H- (011) {00} 44 [0] 208 563 1033','','','2013-05-19 21:04:50','2013-05-19 21:04:50'),(71,'Salter','Emma Louis Salter','','','22 Conduit Mews','','London W2 3RE','UK','emmalouise@tiscali.com','','','H- (011) {00} 44 [0] 207 723 2608','','','2013-05-19 21:11:47','2013-05-19 21:11:47'),(72,'Salter','Guy Salter','','Toby, Hugo','35 Palliser Rd','','London W14 9EB','','','','','h- (011) {00} 44 [0] 20 7381 2335','','skype user name: guysalter','2013-05-19 21:13:36','2013-05-19 21:13:36'),(73,'Cartwright','Georgina (Petre) and Thomas Cartwright','','Hugo, Oliver, James','Mayfield House, Houghton, Stockbrid','','Hants SO2O 6LT','UK','georgina.cartwright@btinternet','','','H (011) {00} 44 [0] 179 438 9187','','','2013-05-23 20:51:22','2013-05-23 20:51:22'),(74,'Cooke','Andrew Cooke','','','16 Ennismore Mews','','London SW7 1AN','UK','andy@junioraspirin.com','andy@bancroftcooke.com','','C- (011) {00} 44 [0] 797 369 5002','','','2013-05-23 20:53:09','2013-05-23 20:53:09'),(75,'Cooke','Anthony and Daryll Cooke','','','Poland Court Poland Lane, Oldiham','Nr Hook','Hampshire RG29 1JL','UK','anthiny@eidonetco.uk','daryll@bancroft-cooke.com','','','','Need to recheck Daryll\'s email address','2013-05-23 20:57:00','2013-05-23 20:57:00'),(76,'Pentland','David and Kimberly Pentland','Mr and Mrs David Lee Pentland, Jr','','5225 Windsor Parkway','','St Louis, Mo 63116','USA','kimsells4u@gmail.com','davidpentlandjr@gmail.com','','David\'s C - 314-602-9539','Kim\'s C - 314-602-9145','','2013-05-23 21:01:57','2013-05-23 21:01:57'),(77,'Pentland','Joe Pentland','Mr Joseph Chambers Pentland','','1042 Broad Street','#311','Bridgeport, CT 06604','USA','josephpentland@gmail.com','','','C- 203-918-2597','','','2013-05-23 21:03:39','2013-05-23 21:03:39'),(78,'Pentland','Bill and Heather Pentland','Mr and Mrs William MacKenzie Pentland','Ian, Charles','19 Brookside Drive','','Darien, CT 06820','USA','wpentland@law.pace.edu','chinaheather@yahoo.com','','Heather C- 203-561-7052','Bill C- 203-561-3712','','2013-05-23 21:06:48','2013-05-23 21:06:48'),(79,'Pentland','Clay Pentland','Mr Nathaniel Claiborne Pentland','','100 Sout Kirkwood Rd','Apt 406-A','St Louis Mo 63122','USA','numberonedjs2007@gmail.com','','','C- 314-484-0439','','','2013-05-23 21:08:55','2013-05-23 21:08:55'),(80,'Skinner','Bill and Karen Skinner','Mr and Mrs William P Skinner','Will and Suzanne','5903 Skyline Heights Court','','Alexandria, VA 22311','USA','wskinner@cov.com','kks100@cox.net','','Bill C- 202-679-0234','KKS C- 703-887-2367','','2013-05-23 21:13:12','2013-05-23 21:13:12'),(81,'Skinner','Will and Christina Skinner','Mr and Mrs William P Skinner Jr','','8 Spruce St','Apt 19A','New York, NY 10038','USA','wpskinner@gmail.com','christinapskinner@gmail.com','','703-850-9057','','','2013-05-23 21:15:40','2013-05-23 21:15:40'),(86,'Denis','Chico and Ginnie Denis','','','1000 Fort McKavett Rd','PO BOX 84','Vancourt, TX 76955','USA','chico@centex.net','','','H 325-469-3980','','','2013-05-31 18:05:13','2013-05-31 18:05:13'),(87,'Moone Athy','','','','','','Augusta MO','USA','','','','636-987-2337','','','2013-05-31 18:09:01','2013-05-31 18:09:01'),(88,'Skinner','Tersh','Lemoine Skinner III','','10940 Wilshire Blvd','Suite 1400','Los Angeles, CA 90024','USA','ls@gwtaxlaw.com','','','W - 310-208-8282','C - 310-562-2635','LA Office','2013-05-31 18:15:04','2013-05-31 18:15:04'),(89,'Siddiqui','Alicia (Judy) and Shariq','','Musa, Isa','921 Tavalon Ave','','St Louis Mo 63119','USA','ajudy71171@hotmail.com','','','H 314-918-7090','C 314-225-1416','','2013-05-31 18:18:26','2013-05-31 18:18:26'),(90,'Sha','Dellie (Fehlig) and Qun','Dr Qun Sha and Ms Delphine Fehlig','Sarah Lin, Samuel','16 Washington Terracer','','St Louis, Mo 63112','USA','qsha@msn.com','','','Qun Cell 412-297-9611','Dellie Cell 314-374-2074','','2013-05-31 18:21:13','2013-05-31 18:21:13'),(91,'Quick','Jennie (Skinner) and Richard Quick','Dr. and Mrs. Richard T. Quick','','9821 Copper Hill Rd','','St Louis Mo 63124','USA','vcsquick@yahoo.com','','','Jennie Cell 314-580-6054','Richard\'s Cell 314-580-1381','','2013-05-31 18:23:46','2013-05-31 18:23:46'),(92,'McClelland','Zellie (Dunn) and John McClelland','','Jack, Claire, Christopher','5221 Westminster Pl','','St Louis, Mo 63108','USA','zelliemc@gmail.com','','','John Cell 314-853-6351','Zel Cell 314-277-8994','','2013-05-31 18:26:59','2013-05-31 18:26:59'),(93,'Law','Hugh and Katherine Law','Mr and Mrs Hugh Law','','6208 Pershing Ave','','St Louis Mo 63130','USA','hlaw@lowenchas.com','kglaw@sbcglobal.net','','H 314-863-2159','W 314-241-5950','','2013-05-31 18:29:44','2013-05-31 18:29:44');
/*!40000 ALTER TABLE `nuts` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `NUT_CREATED` BEFORE INSERT ON `nuts`
 FOR EACH ROW SET NEW.Created = NOW() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-06-21 17:42:54
