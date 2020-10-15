-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2020 at 07:44 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacations`
--
CREATE DATABASE IF NOT EXISTS `vacations` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `vacations`;

-- --------------------------------------------------------

--
-- Table structure for table `followers`
--

CREATE TABLE `followers` (
  `userID` int(11) NOT NULL,
  `vacationID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `followers`
--

INSERT INTO `followers` (`userID`, `vacationID`) VALUES
(2, 1),
(2, 3),
(2, 6),
(2, 7),
(3, 2),
(3, 3),
(4, 1),
(4, 2),
(4, 3),
(4, 6);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `firstName`, `lastName`, `username`, `password`, `isAdmin`) VALUES
(1, 'Bruce', 'Wayne', 'brucew', 'batman', 1),
(2, 'Alfred', 'Pennyworth', 'alfredp', 'superbutler', 0),
(3, 'James', 'Gordon', 'jamesg', 'gothem911', 0),
(4, 'Selina', 'Kyle', 'selinak', 'cat9lives', 0);

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `vacationID` int(11) NOT NULL,
  `description` varchar(4000) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `picFileName` varchar(255) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `price` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`vacationID`, `description`, `destination`, `picFileName`, `startDate`, `endDate`, `price`) VALUES
(1, 'Ireland is known for its wide expanses of lush, green fields. In fact, its nickname is the Emerald Isle. But there are also large areas of rugged, rocky landscape.', 'Ireland', 'fe262004-1e5c-453d-96ed-bd0670b29083.jpg', '2020-04-23', '2020-04-26', '499'),
(2, 'Madeira is a popular year-round resort. The region is noted for its Madeira wine, gastronomy, historical and cultural value, flora and fauna, landscapes and embroidery artisans.', 'Madeira', 'c9314b1e-c48a-4daa-a6e8-79b219a4a4d2.jpg', '2020-05-06', '2020-05-10', '399'),
(3, 'London is the capital and largest city of England and the United Kingdom, and is considered to be one of the worlds most important global cities.', 'London', '14436709-2d83-4762-966c-2d314ef529ba.jpg', '2020-04-21', '2020-04-25', '599'),
(5, 'Nevada is located in a mountainous region that includes vast semiarid grasslands and sandy alkali deserts. It is the most arid state of the country.', 'Nevada', '3c42d44f-a334-40d0-a275-27409f878049.jpg', '2020-05-14', '2020-05-28', '1299'),
(6, 'Scotland is part of the island of Great Britain. This lush beautiful country is bursting with green spaces, lush forests, towering mountains and vast lochs (the Scottish word for lakes!).', 'Scotland', 'b2d13e89-1fbc-45bd-a776-d7cd917e72a5.jpg', '2020-05-12', '2020-05-26', '889'),
(7, 'Peru is made up of a variety of landscapes, from mountains and beaches to deserts and rain forests. The capital Lima is located on the coast of the Pacific Ocean.', 'Peru', 'fe6bb127-2a5a-4102-9d6f-55ecaf1bfbdf.jpg', '2020-05-07', '2020-05-21', '1399');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `followers`
--
ALTER TABLE `followers`
  ADD UNIQUE KEY `user_vacation` (`userID`,`vacationID`) USING BTREE,
  ADD KEY `userID` (`userID`),
  ADD KEY `vacationID` (`vacationID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vacationID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vacationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`),
  ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`vacationID`) REFERENCES `vacations` (`vacationID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
