-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 22, 2020 at 04:49 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.1

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
(1, 1),
(1, 2),
(1, 3),
(1, 7),
(2, 1),
(2, 6),
(3, 2),
(3, 5),
(4, 5),
(4, 7);

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
(1, 'Bruce', 'Wayne', 'brucewayne', 'batMan123', 0),
(2, 'James', 'Gordon', 'jimgordon', 'gothemPD911', 0),
(3, 'Alfred', 'Pennyworth', 'alfredp', 'sup3rButl3r', 1),
(4, 'Selina', 'Kyle', 'selinakyle', 'cat999lives', 0),
(5, 'User', 'Userus', 'user', 'abc123', 0),
(7, 'Admin', 'Adminus', 'admin', 'abc123', 1);

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
(1, 'Holiday package, the price is for one person in a room for two.', 'Rome', 'Rome1.jpg', '2020-04-06', '2020-04-10', '489'),
(2, 'Charter flight, the price is for one person', 'Prague', 'Prague1.jpg', '2020-04-08', '2020-03-13', '479'),
(3, 'Holiday package, the price is for one person in a room for two.', 'Thessaloniki', 'Thessaloniki1.jpg', '2020-04-10', '2020-04-13', '469'),
(5, 'Holiday package, the price is for one person in a room for two.', 'Crete - on discount!', 'Crete1.jpg', '2020-04-09', '2020-04-12', '349'),
(6, 'Holiday package, the price is for one person in a room for two.', 'Crete', 'Crete2.jpg', '2020-04-09', '2020-04-14', '400'),
(7, 'Holiday package, the price is for one person in a room for two.', 'Rome - for a week!', 'Rome1.jpg', '2020-04-06', '2020-04-17', '529');

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
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`vacationID`) REFERENCES `vacations` (`vacationID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
