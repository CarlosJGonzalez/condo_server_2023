-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: us-cdbr-east-06.cleardb.net:3306
-- Generation Time: Oct 21, 2024 at 09:54 PM
-- Server version: 5.6.50-log
-- PHP Version: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `heroku_177609e3d308ca3`
--

-- --------------------------------------------------------

--
-- Table structure for table `codes`
--

CREATE TABLE `codes` (
  `id` int(11) NOT NULL,
  `code` varchar(12) NOT NULL,
  `level` varchar(15) NOT NULL,
  `description` varchar(150) NOT NULL,
  `idcondo` int(7) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `codes`
--

INSERT INTO `codes` (`id`, `code`, `level`, `description`, `idcondo`) VALUES
(4, '01.01.33', '1', 'Gastos Fijos', 1),
(5, '02.01', '1', 'Mantenimiento Instalaciones Electricas', 1),
(144, '10.10.10.0', '1', 'Pool Maintenance', 1),
(174, '22222', '1', 'any description', 1),
(164, '05.01.01', '1', 'Internet Servicex', 1);

-- --------------------------------------------------------

--
-- Table structure for table `condos`
--

CREATE TABLE `condos` (
  `id` int(7) NOT NULL,
  `condo_name` varchar(100) NOT NULL,
  `nid` varchar(16) NOT NULL,
  `address` varchar(150) DEFAULT NULL,
  `board` longtext,
  `msg1` varchar(400) DEFAULT NULL,
  `msg2` varchar(400) DEFAULT NULL,
  `msg3` varchar(400) DEFAULT NULL,
  `admName` varchar(100) NOT NULL,
  `admPhone` varchar(14) DEFAULT NULL,
  `asistName` varchar(25) DEFAULT NULL,
  `asistPhone` varchar(14) DEFAULT NULL,
  `manager` varchar(25) DEFAULT NULL,
  `managerPhone` varchar(14) DEFAULT NULL,
  `logo` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `pwd` varchar(64) DEFAULT NULL,
  `qLateFee` tinyint(1) NOT NULL DEFAULT '0',
  `feeType` tinyint(1) NOT NULL DEFAULT '0',
  `feeAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `qAdminFee` tinyint(1) NOT NULL DEFAULT '0',
  `admType` tinyint(1) NOT NULL DEFAULT '0',
  `admAmount` decimal(7,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `edited_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `condos`
--

INSERT INTO `condos` (`id`, `condo_name`, `nid`, `address`, `board`, `msg1`, `msg2`, `msg3`, `admName`, `admPhone`, `asistName`, `asistPhone`, `manager`, `managerPhone`, `logo`, `email`, `pwd`, `qLateFee`, `feeType`, `feeAmount`, `qAdminFee`, `admType`, `admAmount`, `created_at`, `edited_at`) VALUES
(1, 'Blue Lake View', 'klkl02', 'Any valid addresstest test test', '', 'Contact form use EmailJS integration', '', '123', 'Carlos Gonzalez', '19542749971', 'Watson', '1234567989', '', '', 'C:Siscondv2intro.jpg.jpg', 'tucondominioaldia@gmail.com', NULL, 0, 0, '0.00', 0, 0, '0.00', '2022-07-25 11:13:37', '2024-06-03 18:16:55');

-- --------------------------------------------------------

--
-- Table structure for table `condo_user`
--

CREATE TABLE `condo_user` (
  `id_condo` int(11) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `condo_user`
--

INSERT INTO `condo_user` (`id_condo`, `id_user`) VALUES
(1, 4),
(1, 14);

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `condo_id` int(11) NOT NULL COMMENT 'condo ext key',
  `code` varchar(16) NOT NULL,
  `description` varchar(256) NOT NULL,
  `type` enum('fixed','variable') DEFAULT 'variable',
  `level` varchar(20) DEFAULT NULL COMMENT '01.03',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `edited_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `condo_id`, `code`, `description`, `type`, `level`, `created_at`, `edited_at`) VALUES
(1, 1, 'Oficce', 'Office expenses', 'variable', NULL, '2022-07-25 11:17:24', NULL),
(2, 2, 'pool', 'Pool maintenance', 'variable', NULL, '2022-07-25 11:17:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `expenses_item`
--

CREATE TABLE `expenses_item` (
  `id` int(11) NOT NULL,
  `expenses_key` int(11) NOT NULL,
  `code` varchar(16) NOT NULL,
  `number` tinyint(4) NOT NULL DEFAULT '0',
  `description` varchar(256) NOT NULL,
  `unit` varchar(16) DEFAULT NULL COMMENT 'Pound, bag, inch',
  `cost` float(9,2) NOT NULL DEFAULT '0.00',
  `budget` float(9,2) NOT NULL DEFAULT '0.00',
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `unit_ext_key` int(11) NOT NULL COMMENT 'Link with unit',
  `edited` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `funds`
--

CREATE TABLE `funds` (
  `id` int(11) NOT NULL,
  `ext_key` int(11) NOT NULL COMMENT 'condo id',
  `account_code` varchar(11) NOT NULL,
  `type` set('fund','cash','other') NOT NULL DEFAULT 'other' COMMENT 'Bank account, fund, cash',
  `name` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `percent` decimal(4,2) UNSIGNED ZEROFILL DEFAULT '00.00',
  `calculation` set('automatic','fixed','manual','none') CHARACTER SET utf8 DEFAULT 'none',
  `edited_by` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `created_by` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `funds`
--

INSERT INTO `funds` (`id`, `ext_key`, `account_code`, `type`, `name`, `status`, `balance`, `percent`, `calculation`, `edited_by`, `created_by`) VALUES
(1, 1, 'FIM', '', 'FONDO DE INT. DE MORA', 1, '0.00', '00.00', 'none', NULL, NULL),
(2, 1, 'FAD', '', 'FONDO DE GASTOS ADM.', 1, '0.00', '00.00', 'none', NULL, NULL),
(12, 1, 'FDR', '', 'FONDO DE RESERVA', 1, '0.00', '00.00', 'none', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `fund_details`
--

CREATE TABLE `fund_details` (
  `id` bigint(20) NOT NULL,
  `ext_key` int(11) NOT NULL,
  `id_period` int(11) NOT NULL,
  `no_check` varchar(50) NOT NULL,
  `no_receipt` varchar(50) NOT NULL,
  `no_invoice` varchar(50) NOT NULL,
  `id_pay` int(11) NOT NULL,
  `id_collect` int(11) NOT NULL,
  `id_unit` int(11) NOT NULL,
  `detail` varchar(100) NOT NULL,
  `id_provider` int(11) NOT NULL,
  `provider` varchar(100) NOT NULL,
  `debit` decimal(10,2) NOT NULL,
  `credit` decimal(10,2) NOT NULL,
  `balance` decimal(10,2) NOT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `note` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `edited_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `fund_details`
--

INSERT INTO `fund_details` (`id`, `ext_key`, `id_period`, `no_check`, `no_receipt`, `no_invoice`, `id_pay`, `id_collect`, `id_unit`, `detail`, `id_provider`, `provider`, `debit`, `credit`, `balance`, `status`, `note`, `date`, `created_at`, `edited_at`) VALUES
(993, 1, 25, '', '', '', 0, 0, 0, 'GestiÃ³n 01/05/2014 al 31/05/2014', 0, '', '0.00', '11194.20', '471648.94', NULL, '', '2014-09-10', '2022-07-25 11:25:37', NULL),
(995, 1, 25, '0001', '', '', 0, 0, 0, 'HONORARIOS ADMINISTRACION', 40, 'SERVICIOS INTEGRALES LA ESTRELLA C.A.', '15000.00', '0.00', '-15000.00', NULL, '', '2014-05-30', '2022-07-25 11:25:37', NULL),
(996, 1, 25, '001', '', '', 0, 0, 0, 'SERVICIO DE AGUA POTABLE', 71, 'HIDROCAPITAL', '3453.80', '0.00', '-3453.80', NULL, '', '2014-05-15', '2022-07-25 11:25:37', NULL),
(997, 1, 25, '002', '', '', 0, 0, 0, 'SERVICIO DE ELECTRICIDAD', 37, 'CORPORACION ELECTRICA NACIONAL', '9846.97', '0.00', '-13300.77', NULL, '', '2014-05-15', '2022-07-25 11:25:37', NULL),
(998, 1, 25, '003', '', '', 0, 0, 0, 'VIGILANCIA', 72, 'SERVIG FUERZA 3 C.A.', '59039.78', '0.00', '-72340.55', NULL, '', '2014-05-15', '2022-07-25 11:25:37', NULL),
(999, 1, 25, '0004', '', '', 0, 0, 0, 'REPOSICION Y AUMENTO DE CAJA CHICA', 47, ' CAMBIO EN EFECTIVO', '19812.38', '0.00', '-92152.93', NULL, '', '2014-05-15', '2022-07-25 11:25:37', NULL),
(1000, 1, 25, '0005', '', '', 0, 0, 0, 'COMPRA DE BOMBILLOS 18 W', 47, ' CAMBIO EN EFECTIVO', '4749.92', '0.00', '-96902.85', NULL, '', '2014-05-15', '2022-07-25 11:25:37', NULL),
(1001, 1, 25, '0005', '', '', 0, 0, 0, 'FOTOCOPIAS RETENC. ISLR Y CCL IVA', 47, ' CAMBIO EN EFECTIVO', '39.20', '0.00', '-96942.05', NULL, '', '2014-05-15', '2022-07-25 11:25:37', NULL),
(1004, 2, 26, '', '', '', 0, 0, 0, 'GestiÃ³n 01/06/2014 al 30/06/2014', 0, '', '0.00', '12305.73', '483954.67', NULL, '', '2014-09-15', '2022-07-25 11:25:37', NULL),
(1006, 1, 26, '22222', '', '', 0, 0, 0, 'HONORARIOS ADMINISTRACION', 40, 'SERVICIOS INTEGRALES LA ESTRELLA C.A.', '15000.00', '0.00', '-30000.00', NULL, '', '2014-06-15', '2022-07-25 11:25:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `ext_key` int(11) NOT NULL COMMENT 'Foreign Key (codes:id)',
  `id_condo` int(11) NOT NULL COMMENT 'Id Condo',
  `code` varchar(15) NOT NULL COMMENT '01.01.02',
  `itemNumber` int(11) NOT NULL DEFAULT '0',
  `description` varchar(50) NOT NULL,
  `unit` varchar(16) DEFAULT NULL,
  `cost` decimal(8,2) NOT NULL DEFAULT '0.00',
  `budget` decimal(8,2) NOT NULL DEFAULT '0.00',
  `groupBy` tinyint(1) NOT NULL DEFAULT '0',
  `type` varchar(12) NOT NULL DEFAULT 'Fixed' COMMENT 'Fixed, Variable, InitUnit, InitProv, Private',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `edited_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `ext_key`, `id_condo`, `code`, `itemNumber`, `description`, `unit`, `cost`, `budget`, `groupBy`, `type`, `created_at`, `edited_at`) VALUES
(134, 4, 1, '01.01.02', 0, 'any descrip', 'null', '11.00', '11.00', 0, 'Variable', '2022-07-23 15:52:01', '2022-07-23 15:52:01'),
(224, 5, 1, '1234', 0, 'Mantenimiento Instalaciones', 'null', '0.00', '0.00', 0, 'Variable', '2022-07-23 19:19:48', '2022-07-23 19:19:48'),
(244, 5, 1, '02.02.01', 0, 'hjhgjgj', 'null', '34.00', '31.00', 0, 'Fijo', '2022-07-23 22:45:10', '2022-07-23 22:45:10'),
(254, 4, 1, '01.01', 0, 'sfsfsfs', 'Lb', '12.00', '14.00', 0, 'Fijo', '2022-07-23 22:45:25', '2022-07-23 22:45:25'),
(264, 5, 1, '01.01.02', 0, 'Mantenimiento Instalaciones', 'Pound', '0.00', '0.00', 0, 'Fixed', '2022-07-24 03:56:57', '2022-07-24 03:56:57'),
(304, 5, 1, '01.01.01', 0, 'Mantenimiento Instalaciones Electr', 'Pound', '123.00', '109.00', 0, 'Variable', '2022-07-24 22:06:32', '2022-07-24 22:06:32'),
(294, 5, 1, '01.03.01', 0, 'Gastos Fijos', NULL, '0.00', '0.00', 0, 'Fixed', '2022-07-24 19:08:15', '2022-07-24 19:08:15'),
(444, 4, 0, '1002', 0, 'New Item', 'pound', '15.00', '25.00', 0, 'Fixed', '2022-08-30 14:53:54', '2022-08-30 14:53:54'),
(374, 5, 1, '02.03.03', 0, 'probando', NULL, '0.00', '0.00', 0, 'Fixed', '2022-07-26 18:56:18', '2022-07-26 18:56:18'),
(384, 4, 1, '01.01.01', 0, 'Mantenimiento Instalaciones', 'Sqf', '200.00', '33.00', 0, 'Variable', '2022-08-03 23:11:48', '2022-08-03 23:11:48'),
(414, 4, 0, '1234', 0, 'Mantenimiento Instalaciones', 'points', '1.00', '2.00', 0, 'Fixed', '2022-08-10 15:55:25', '2022-08-10 15:55:25'),
(434, 4, 0, '01.01.01', 0, 'Mantenimiento Instalaciones', 'sg123', '25.00', '23.00', 0, 'Fixed', '2022-08-17 02:08:12', '2022-08-17 02:08:12'),
(464, 144, 0, '01.01.03', 0, 'Cloro granulado', 'null', '10.00', '15.00', 0, 'Variable', '2023-01-26 01:22:15', '2023-01-26 01:22:15'),
(474, 164, 0, '01.01.03', 0, 'jun july', 'u', '6.00', '7.00', 0, 'Variable', '2023-01-27 20:53:35', '2023-01-27 20:53:35'),
(484, 164, 0, '2222', 0, '33223', NULL, '0.00', '0.00', 0, 'Fixed', '2023-02-01 23:08:43', '2023-02-01 23:08:43'),
(494, 144, 0, '10.01', 0, 'any desc', 'null', '0.00', '0.00', 0, 'Fixed', '2023-08-08 17:00:10', '2023-08-08 17:00:10'),
(504, 174, 0, '12.12.12', 0, 'new item for this Group', NULL, '0.00', '0.00', 0, 'Fixed', '2023-09-22 15:05:52', '2023-09-22 15:05:52'),
(514, 174, 0, '10.12.12', 0, 'another item', NULL, '0.00', '0.00', 0, 'Fixed', '2023-09-22 15:06:08', '2023-09-22 15:06:08'),
(524, 174, 0, '020202', 0, 'any', NULL, '0.00', '0.00', 0, 'Fixed', '2024-05-17 17:08:46', '2024-05-17 17:08:46');

-- --------------------------------------------------------

--
-- Table structure for table `period`
--

CREATE TABLE `period` (
  `id` int(11) NOT NULL,
  `ext_key` int(11) NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `amount` decimal(10,0) NOT NULL,
  `status` varchar(9) NOT NULL,
  `previous` decimal(10,2) NOT NULL DEFAULT '0.00',
  `due` decimal(10,2) NOT NULL DEFAULT '0.00',
  `collected` decimal(10,2) NOT NULL DEFAULT '0.00',
  `balance` decimal(10,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `period`
--

INSERT INTO `period` (`id`, `ext_key`, `start`, `end`, `amount`, `status`, `previous`, `due`, `collected`, `balance`) VALUES
(1, 1, '2014-04-01', '2014-04-30', '0', '1', '200953.44', '0.00', '0.00', '200953.44'),
(2, 1, '2014-05-01', '2014-05-31', '123136', '1', '0.00', '123136.25', '0.00', '123136.25'),
(3, 1, '2014-06-01', '2014-06-30', '135363', '1', '123136.25', '135363.06', '0.00', '258499.31'),
(4, 1, '2014-07-01', '2014-07-31', '173817', '0', '258499.31', '173816.74', '0.00', '432316.05');

-- --------------------------------------------------------

--
-- Table structure for table `period_details`
--

CREATE TABLE `period_details` (
  `id` int(7) NOT NULL,
  `ext_key` int(11) NOT NULL COMMENT 'id period',
  `exp_number` int(7) NOT NULL DEFAULT '0' COMMENT 'column to order items',
  `id_exp` int(7) NOT NULL COMMENT 'id expenses item',
  `code` varchar(20) NOT NULL,
  `description` varchar(100) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `id_provider` int(7) DEFAULT NULL,
  `provider` varchar(100) DEFAULT NULL,
  `id_bank` int(11) DEFAULT NULL,
  `check_number` varchar(50) DEFAULT NULL,
  `invoice_number` varchar(20) DEFAULT NULL,
  `invoice_description` varchar(100) DEFAULT NULL,
  `kind` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'Type of Expense',
  `id_unit` int(7) NOT NULL,
  `group_by` int(7) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `edited_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `period_details`
--

INSERT INTO `period_details` (`id`, `ext_key`, `exp_number`, `id_exp`, `code`, `description`, `unit`, `amount`, `id_provider`, `provider`, `id_bank`, `check_number`, `invoice_number`, `invoice_description`, `kind`, `id_unit`, `group_by`, `created_at`, `edited_at`) VALUES
(4, 4, 0, 224, '1234', 'Mantenimiento de Instalaciones I', 'SG', '123.45', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2022-08-21 16:54:41');

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `id` int(10) UNSIGNED NOT NULL,
  `profile` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `rights` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`id`, `profile`, `description`, `rights`) VALUES
(4, 'Listings', 'B', '{\"condos\":1,\"codes\":1,\"expenses\":1,\"expenses_item\":1,\"period\":1,\"period_details\":1,\"items\":1,\"funds\":1,\"fund_details\":1,\"profiles\":0,\"roles\":0,\"units\":1,\"users\":0}'),
(14, 'Read', 'BR', '{\"condos\":2,\"codes\":2,\"expenses\":2,\"expenses_item\":2,\"period\":2,\"period_details\":2,\"items\":2,\"funds\":2,\"fund_details\":2,\"profiles\":1,\"roles\":1,\"units\":2,\"users\":2}'),
(24, 'Edit', 'BRE', '{\"condos\":3,\"codes\":3,\"expenses\":3,\"expenses_item\":3,\"period\":3,\"period_details\":3,\"items\":3,\"funds\":3,\"fund_details\":3,\"profiles\":1,\"roles\":1,\"units\":3,\"users\":3}'),
(34, 'Publish', 'BRA', '{\"condos\":4,\"codes\":4,\"expenses\":4,\"expenses_item\":4,\"period\":4,\"period_details\":4,\"items\":4,\"funds\":4,\"fund_details\":4,\"profiles\":1,\"roles\":2,\"units\":2,\"users\":2}'),
(44, 'Manager', 'BREA', '{\"condos\":5,\"codes\":6,\"expenses\":6,\"expenses_item\":6,\"period\":5,\"period_details\":6,\"items\":6,\"funds\":6,\"fund_details\":6,\"profiles\":2,\"roles\":2,\"units\":6,\"users\":5}'),
(54, 'Admin', 'BREAD', '{\"condos\":6,\"codes\":6,\"expenses\":6,\"expenses_item\":6,\"period\":6,\"period_details\":6,\"items\":6,\"funds\":6,\"fund_details\":6,\"profiles\":6,\"roles\":6,\"units\":6,\"users\":6}');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(10) NOT NULL,
  `id_user` int(11) NOT NULL,
  `rol` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `id_user`, `rol`) VALUES
(4, 4, '{\"condos\":6,\"codes\":6,\"expenses\":6,\"expenses_item\":6,\"period\":6,\"period_details\":6,\"items\":6,\"funds\":6,\"fund_details\":6,\"profiles\":6,\"roles\":6,\"units\":6,\"users\":6}'),
(14, 14, '{\"condos\":2,\"codes\":2,\"expenses\":2,\"expenses_item\":2,\"period\":2,\"period_details\":2,\"items\":2,\"funds\":2,\"fund_details\":2,\"profiles\":2,\"roles\":2,\"units\":2,\"users\":2}');

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` int(7) NOT NULL,
  `ext_key` int(11) NOT NULL DEFAULT '1',
  `unitNumber` varchar(20) NOT NULL,
  `alicuota` decimal(7,5) NOT NULL,
  `fixAmount` decimal(7,2) DEFAULT '5.00',
  `position` int(11) NOT NULL DEFAULT '1',
  `unitSector` int(11) DEFAULT NULL,
  `ownerName` varchar(128) CHARACTER SET utf8 NOT NULL,
  `ownerEmail1` varchar(32) DEFAULT NULL,
  `ownerEmail2` varchar(32) DEFAULT NULL,
  `ownerRif` varchar(25) DEFAULT NULL,
  `ownerAddress` varchar(150) DEFAULT NULL,
  `ownerContact` varchar(100) DEFAULT NULL,
  `ownerContactPhoneNumber` varchar(100) DEFAULT NULL,
  `ownerContactEmail` varchar(32) DEFAULT NULL,
  `receiveEmail` tinyint(1) NOT NULL DEFAULT '1',
  `ownerPhoneNumber1` varchar(12) DEFAULT NULL,
  `ownerPhoneNumber2` varchar(12) DEFAULT NULL,
  `ownerPassword` char(32) DEFAULT NULL,
  `tenantName` varchar(128) DEFAULT NULL,
  `tenantEmail1` varchar(32) DEFAULT NULL,
  `tenantEmail2` varchar(32) DEFAULT NULL,
  `tenantRif` varchar(25) DEFAULT NULL,
  `tenantContact` varchar(100) DEFAULT NULL,
  `tenantAddress` varchar(100) DEFAULT NULL,
  `tenantPhoneNumber1` varchar(11) DEFAULT NULL,
  `tenantPhoneNumber2` varchar(11) DEFAULT NULL,
  `tenantContactPhoneNumber` varchar(100) DEFAULT NULL,
  `tenantContactEmail` varchar(32) DEFAULT NULL,
  `tenantWork` varchar(100) DEFAULT NULL,
  `tenantWorkPhoneNumber` varchar(22) DEFAULT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `edited_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`id`, `ext_key`, `unitNumber`, `alicuota`, `fixAmount`, `position`, `unitSector`, `ownerName`, `ownerEmail1`, `ownerEmail2`, `ownerRif`, `ownerAddress`, `ownerContact`, `ownerContactPhoneNumber`, `ownerContactEmail`, `receiveEmail`, `ownerPhoneNumber1`, `ownerPhoneNumber2`, `ownerPassword`, `tenantName`, `tenantEmail1`, `tenantEmail2`, `tenantRif`, `tenantContact`, `tenantAddress`, `tenantPhoneNumber1`, `tenantPhoneNumber2`, `tenantContactPhoneNumber`, `tenantContactEmail`, `tenantWork`, `tenantWorkPhoneNumber`, `modified`, `created_at`, `edited_at`) VALUES
(1, 1, '557ddgrdr', '2.34000', '45.00', 12, 2, 'Fabianna Lange', 'siscond@hotmail.com', 'test@gmail.com', '5571222', 'EDIFICIO HATILLO SUITES P.B.', 'null', 'null', 'null', 1, '9541555222', '', '835ad146ac8eb18c07e52fc3b6a62cd6', 'a happy familyasdsdfsdfs', NULL, NULL, '007', 'Nia Lange', '587 1200222', '9540099999', '954', '9545555555', 'null', 'Parguito Gourmet', '712289999', '2018-11-02 23:54:46', '2022-07-25 11:12:48', '2024-08-24 21:39:15'),
(2, 1, '558', '3.45000', '45.00', 12, 2, 'Carlos J Gonzalez H', 'siscond@hotmail.com', '', '557002', 'EDIFICIO HATILLO SUITES P.B.', 'null', 'null', 'null', 0, '999', '555', '835ad146ac8eb18c07e52fc3b6a62cd6', 'Carlos Gonzalez and Family', NULL, NULL, '007', 'Nia Lange', '587', '858', '741', '954', 'null', 'Parguito Gourmet1', '', '2018-11-02 23:54:46', '2022-07-25 11:12:48', '2023-10-13 14:17:04'),
(20, 1, '444', '0.40000', '5.00', 1, NULL, 'Miguel Angel y Estefania', 'email2@domain.net', '', '0101', 'null', 'null', 'null', 'null', 1, '744445555', '01212', NULL, 'rrtetet', NULL, NULL, '', '', '557 ', '', '', '0101', 'null', '', '', '2020-05-28 17:09:30', '2022-07-25 11:12:48', NULL),
(21, 1, '3434-9', '3.00000', '5.00', 1, NULL, 'Sherlock Holmes', 'email@domain.com', 'info@tucondominioaldia.net', '', 'null', 'null', 'null', 'null', 1, '741254', '', NULL, 'John Watson', NULL, NULL, '', '', '557 Nw ', '99999', '', '', 'null', '', '', '2020-05-29 13:16:43', '2022-07-25 11:12:48', '2022-09-07 22:32:00'),
(22, 1, '3434', '3.00000', '5.00', 1, NULL, '3333', 'info@tucondominioaldia.net', 'info@tucondominioaldia.net', '', 'null', 'null', 'null', 'null', 1, '4525999999', '', NULL, 'erere', NULL, NULL, '', '', '557 Nw', '', '', '', 'null', '', '', '2020-05-29 13:17:58', '2022-07-25 11:12:48', NULL),
(72, 1, '123456', '2.00000', '5.00', 1, NULL, 'Owner Name Test', 'domain@domain.com', '', '', 'null', 'null', 'null', 'null', 1, '456799812', '', NULL, 'Any name', NULL, NULL, '', '', '', '', '', '', 'null', '', '', '2020-07-31 05:47:11', '2022-07-25 11:12:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `pwd` char(32) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `failure` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `pwd`, `photo`, `active`, `failure`, `created_at`, `updated_at`) VALUES
(4, 'carlos', 'siscond@hotmail.com', '12345678', NULL, 1, 1, '2022-08-01 14:48:13', '2023-01-18 11:32:26'),
(14, 'john doe', 'johndoe@domain.com', 'pW_1234_56', NULL, 1, 3, '2022-08-01 14:48:34', '2023-08-08 16:55:50');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `codes`
--
ALTER TABLE `codes`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `condos`
--
ALTER TABLE `condos`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `RIF` (`nid`) USING BTREE;

--
-- Indexes for table `condo_user`
--
ALTER TABLE `condo_user`
  ADD KEY `condox` (`id_condo`),
  ADD KEY `userx` (`id_user`) USING BTREE;

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `thekey` (`condo_id`,`code`) USING BTREE;

--
-- Indexes for table `expenses_item`
--
ALTER TABLE `expenses_item`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `funds`
--
ALTER TABLE `funds`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `ext_key` (`ext_key`,`account_code`) USING BTREE;

--
-- Indexes for table `fund_details`
--
ALTER TABLE `fund_details`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `ext_key` (`ext_key`) USING BTREE;

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `UniqueKey` (`ext_key`,`code`,`id_condo`) USING BTREE,
  ADD KEY `ext_key` (`ext_key`);

--
-- Indexes for table `period`
--
ALTER TABLE `period`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `ext_key` (`ext_key`) USING BTREE;

--
-- Indexes for table `period_details`
--
ALTER TABLE `period_details`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `ext_key` (`ext_key`) USING BTREE;

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userx` (`id_user`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`,`ext_key`,`unitNumber`) USING BTREE,
  ADD KEY `extKey` (`ext_key`) USING BTREE,
  ADD KEY `unit` (`unitNumber`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `codes`
--
ALTER TABLE `codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=175;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `expenses_item`
--
ALTER TABLE `expenses_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `funds`
--
ALTER TABLE `funds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=525;

--
-- AUTO_INCREMENT for table `period`
--
ALTER TABLE `period`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `period_details`
--
ALTER TABLE `period_details`
  MODIFY `id` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `condos`
--
ALTER TABLE `condos`
  ADD CONSTRAINT `condos_ibfk_1` FOREIGN KEY (`id`) REFERENCES `period` (`ext_key`);

--
-- Constraints for table `condo_user`
--
ALTER TABLE `condo_user`
  ADD CONSTRAINT `condo_user_ibfk_1` FOREIGN KEY (`id_condo`) REFERENCES `condos` (`id`),
  ADD CONSTRAINT `condo_user_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);

--
-- Constraints for table `funds`
--
ALTER TABLE `funds`
  ADD CONSTRAINT `condo_id` FOREIGN KEY (`ext_key`) REFERENCES `condos` (`id`);

--
-- Constraints for table `fund_details`
--
ALTER TABLE `fund_details`
  ADD CONSTRAINT `id_fund` FOREIGN KEY (`ext_key`) REFERENCES `funds` (`id`);

--
-- Constraints for table `period_details`
--
ALTER TABLE `period_details`
  ADD CONSTRAINT `period_details_ibfk_1` FOREIGN KEY (`ext_key`) REFERENCES `period` (`id`);

--
-- Constraints for table `roles`
--
ALTER TABLE `roles`
  ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);

--
-- Constraints for table `units`
--
ALTER TABLE `units`
  ADD CONSTRAINT `id_condo` FOREIGN KEY (`ext_key`) REFERENCES `condos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
