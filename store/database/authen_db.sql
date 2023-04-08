-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 15, 2019 at 11:09 AM
-- Server version: 5.7.26-0ubuntu0.18.04.1
-- PHP Version: 7.2.19-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ngsi_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `authentication`
--

CREATE TABLE `authentication` (
  `authen_id` int(11) NOT NULL,
  `authen_username` varchar(200) DEFAULT NULL,
  `authen_email` varchar(200) DEFAULT NULL,
  `authen_phone` varchar(200) DEFAULT NULL,
  `authen_pass` text,
  `authen_token` text,
  `authen_group` int(11) DEFAULT NULL,
  `authen_note` text,
  `authen_parent` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `authentication`
--

INSERT INTO `authentication` (`authen_id`, `authen_username`, `authen_email`, `authen_phone`, `authen_pass`, `authen_token`, `authen_group`, `authen_note`, `authen_parent`) VALUES
(1, 'Root', NULL, NULL, '$2b$10$FsPPi/t.OT6Kh66fY9wwrebNPQF5v4XdeNZxL4y9m5Iv3f8v5UbwC', 'fca7462e959d3658cd3fe68a52fdb337', NULL, NULL, NULL),
(2, 'linhvhv', NULL, NULL, '$2b$10$F', 'dd9b4df3281eb15470719ac16b30b81d', NULL, 'fafa', 1),
(3, 'abc', NULL, NULL, '$2y$10$I7KrnMmxSIBjYNJNsgJfpelwUdo4UfDGbLeHvnHBFsqTCRwOMHTze', NULL, NULL, NULL, NULL),
(4, 'def', NULL, NULL, '$2y$10$qfZPpu6k1YMbEw5kM/RefeQ86vA4arZPcO7vhBQNgad9wfRC6qdUi', NULL, NULL, NULL, NULL),
(5, 'ijk', NULL, NULL, '$2y$10$9j0kvuTdc6q9snrkt.Waw.dOX3sF7I5qbpLtzxIH9/N3gt4Z5BlQm', NULL, NULL, NULL, NULL),
(6, 'klm', NULL, NULL, '$2y$10$IZMqkXeaxlDprTOmMPVDhO7vbjMLeYcoFcpa4EobZKV26m8A5Jx1W', NULL, NULL, NULL, NULL),
(7, 'opn', NULL, NULL, '$2y$10$K4EEZt7wKYvGUPCwWe4hce3acz3t9BVLp.DjFLsIJDfN/chy7zciG', NULL, NULL, NULL, NULL),
(8, 'sjk', NULL, NULL, '$2y$10$ygqZ4qh8fNUmIVcpGn/Zre/vHhy4xev9nnlW1tFua9atzc1e//mnq', NULL, NULL, NULL, NULL),
(9, 'sjkf', NULL, NULL, '$2y$10$jV7OWKEZtWsQARGfnzVxEu9eOds2y6J0s4sEVIMsVOff.TJHk2pZO', NULL, NULL, NULL, NULL),
(10, 'dhd', NULL, NULL, '$2y$10$/8bctOGGnf6o51uKPupu/eT3v9M6ra./dqYp5mSYOJPzZ9b8ryUOS', NULL, NULL, NULL, NULL),
(11, 'jfjkf', NULL, NULL, '$2y$10$rUt8bDd2/A5iX9k4GyL0XepnQU9rcMsZc1pL2u1IesC.i0MxLVZcG', NULL, NULL, NULL, NULL),
(12, 'rsgs', NULL, NULL, '$2y$10$B/eBPBWQONxbcQHHjuGzf.hfonbE/C0r7R4zgrteZOV2ODW4/WTIe', NULL, NULL, NULL, NULL),
(13, 'urur', NULL, NULL, '$2y$10$JTPSxfTbrmxtAgneGfC2Ge0Gd6FdSI4q/R72vIoAVg1N6TD6x20EC', NULL, NULL, NULL, NULL),
(14, 'gsgs', NULL, NULL, '$2y$10$eZw2T9mAUIvZ8bGmtHzww.Os1SsuQbhBmN4rUD.Z5Auvq9oSgUD4u', NULL, NULL, NULL, NULL),
(15, 'khl', NULL, NULL, '$2y$10$6QyXdKNMx.Tyn0kVECq2nuVrJnMwGLH/McymiFGaZoUcdSfenH4nG', NULL, NULL, NULL, NULL),
(16, 'wqe', NULL, NULL, '$2y$10$HNuNz2y7ksMGFldCR1hT/uCGkQ0fn5zpDLB/jhPwDXFfG6XMJ9CXW', NULL, NULL, NULL, NULL),
(17, 'ytr', NULL, NULL, '$2y$10$ZTzo9gixEJA0aGsQhlAZheVNb2LYrZV9qYPAy9Zgl3CWfdO.DVRUC', NULL, NULL, NULL, NULL),
(19, 'urury', NULL, NULL, '$2y$10$uxPUpy8BNsdHrq2yVQ.b7essk3cq5jz0slK2VQ20kDYKDGNKk/vca', NULL, NULL, NULL, NULL),
(20, 'sgsh', NULL, NULL, '$2y$10$1FV2PR8VIBvi1WNq.jUF0uujObqC8fnbP4pbdKQeYPk8CDyG3WWqO', NULL, NULL, NULL, NULL),
(21, 'gkky', NULL, NULL, '$2y$10$E.xNkvtb73UZBcs88GQDMO6hikb7TzSTqHHbZKFCfJFK/cyc5TLeK', NULL, NULL, NULL, NULL),
(22, 'gkkyyr', NULL, NULL, '$2y$10$C1HNmFJ2mjcSmLnpCXdaqO7qN.4atz8mwJ5PkvAfm1Imo2C0d0QfK', NULL, NULL, NULL, NULL),
(23, 'zxc', NULL, NULL, '$2y$10$w5izxPh1HhdLCmow5Ni1OukODKua4Pkec0gnQMBBl8PxPqZgLJtpO', NULL, NULL, NULL, NULL),
(24, 'zxcbn', NULL, NULL, '$2y$10$s0mJjeeaT7qM1x9HofYxRe4.WkVsLyqqAAkpjTQT9Qbw74HKWXYZS', NULL, NULL, NULL, NULL),
(25, 'zxcbnr', NULL, NULL, '$2y$10$.Lcap1ym80uW9sO0RAZTIuWAljyyVX46dv9oGQjeagan.1laS0oBC', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `authorization_ob`
--

CREATE TABLE `authorization_ob` (
  `authz_ob_id` int(11) NOT NULL,
  `authz_ob_group_id` int(11) DEFAULT NULL,
  `authz_ob_function` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `authorization_project_ob`
--

CREATE TABLE `authorization_project_ob` (
  `authz_pro_ob_pid` int(11) NOT NULL,
  `authz_pro_ob_uid` int(11) NOT NULL,
  `authz_pro_ob_pname` varchar(200) DEFAULT NULL,
  `authz_pro_ob_uname` varchar(200) DEFAULT NULL,
  `authz_pro_ob_funcs` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `authorization_project_ob`
--

INSERT INTO `authorization_project_ob` (`authz_pro_ob_pid`, `authz_pro_ob_uid`, `authz_pro_ob_pname`, `authz_pro_ob_uname`, `authz_pro_ob_funcs`) VALUES
(13, 1, 'dư án 1', 'Root', '{\"table\":{\"full\":true}}'),
(13, 2, 'dư án 1', 'linhvhv', '{\"table\":{\"full\":false},\"column\":{\"project_id\":\"Read\",\"project_name\":\"Read\",\"project_field\":\"Read\",\"project_market\":\"Read\",\"project_creator\":\"Read\",\"project_priority\":\"Read\",\"project_status\":\"Read\",\"project_next_action\":\"Read\",\"project_next_action_time\":\"Read\",\"project_bidding_time\":\"Read\",\"project_contract_time\":\"Read\",\"project_contact\":\"Read\",\"project_vender\":\"Read\",\"project_si\":\"Read\",\"project_am\":\"Read\",\"project_se\":\"Read\",\"project_note\":\"Read\",\"project_expected_revenue\":\"Read\",\"project_profit_rate\":\"Read\",\"project_expected_profit\":\"Read\",\"project_expected_time\":\"Read\",\"project_real_revenue\":\"Read\",\"project_real_profit\":\"Read\",\"project_money_output\":\"Read\",\"project_money_remain\":\"Read\",\"project_mplan_time\":\"Read\",\"project_result\":\"Read\",\"project_weight\":\"Read\",\"project_money_plan\":\"Write\"}}');

-- --------------------------------------------------------

--
-- Table structure for table `authorization_project_rb`
--

CREATE TABLE `authorization_project_rb` (
  `authz_pro_rb_pid` int(11) NOT NULL,
  `authz_pro_rb_gid` int(11) NOT NULL,
  `authz_pro_rb_pname` varchar(200) DEFAULT NULL,
  `authz_pro_rb_gname` varchar(200) DEFAULT NULL,
  `authz_pro_rb_funcs` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `authorization_rb`
--

CREATE TABLE `authorization_rb` (
  `authz_rb_id` int(11) NOT NULL,
  `authz_rb_group_id` int(11) DEFAULT NULL,
  `authz_rb_function` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `authorization_rb`
--

INSERT INTO `authorization_rb` (`authz_rb_id`, `authz_rb_group_id`, `authz_rb_function`) VALUES
(1, 1, 500),
(2, 1, 300),
(3, 1, 200),
(4, 1, 100);

-- --------------------------------------------------------

--
-- Table structure for table `controller_table`
--

CREATE TABLE `controller_table` (
  `controller_name` varchar(200) NOT NULL,
  `controller_value` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `controller_table`
--

INSERT INTO `controller_table` (`controller_name`, `controller_value`) VALUES
('CTL_NAME_REVENUE_CHART_TIME', '1546275600'),
('CTL_NAME_REVENUE_CHART_TOTAL', '80000000');

-- --------------------------------------------------------

--
-- Table structure for table `count_day_table`
--

CREATE TABLE `count_day_table` (
  `cd_time` int(11) NOT NULL,
  `cd_action_pass` int(11) DEFAULT NULL,
  `cd_action_miss` int(11) DEFAULT NULL,
  `cd_mplan_pass` int(11) DEFAULT NULL,
  `cd_mplan_miss` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `count_day_table`
--

INSERT INTO `count_day_table` (`cd_time`, `cd_action_pass`, `cd_action_miss`, `cd_mplan_pass`, `cd_mplan_miss`) VALUES
(1561309200, 1, NULL, NULL, NULL),
(1561482000, NULL, 1, NULL, 1),
(1561568400, NULL, NULL, 2, 4),
(1561654800, 0, -1, 3, 3),
(1562000400, NULL, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `fields`
--

CREATE TABLE `fields` (
  `field_id` int(11) NOT NULL,
  `field_name` varchar(200) DEFAULT NULL,
  `field_note` text,
  `field_weight` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `fields`
--

INSERT INTO `fields` (`field_id`, `field_name`, `field_note`, `field_weight`) VALUES
(2, 'SI', NULL, NULL),
(3, 'VAS', NULL, NULL),
(4, 'STARTUP', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `group_id` int(11) NOT NULL,
  `group_name` varchar(200) DEFAULT NULL,
  `group_note` text,
  `group_parent` int(11) DEFAULT NULL,
  `group_owner` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`group_id`, `group_name`, `group_note`, `group_parent`, `group_owner`) VALUES
(1, 'Root', 'Do not delete', 0, 0),
(2, 'Sales', 'test', 1, 1),
(3, 'Test', 'atatata', 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `map_people_groups`
--

CREATE TABLE `map_people_groups` (
  `map_id` int(11) NOT NULL,
  `people_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `map_people_groups`
--

INSERT INTO `map_people_groups` (`map_id`, `people_id`, `group_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(7, 25, 2),
(8, 25, 3);

-- --------------------------------------------------------

--
-- Table structure for table `markets`
--

CREATE TABLE `markets` (
  `market_id` int(11) NOT NULL,
  `market_note` text,
  `market_name` varchar(200) DEFAULT NULL,
  `market_weight` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `markets`
--

INSERT INTO `markets` (`market_id`, `market_note`, `market_name`, `market_weight`) VALUES
(2, NULL, 'Viettel', NULL),
(3, NULL, 'Vinaphone', NULL),
(4, NULL, 'Mobifone', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `permission_template`
--

CREATE TABLE `permission_template` (
  `temp_id` int(11) NOT NULL,
  `temp_name` varchar(200) DEFAULT NULL,
  `temp_permission` text,
  `temp_note` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `permission_template`
--

INSERT INTO `permission_template` (`temp_id`, `temp_name`, `temp_permission`, `temp_note`) VALUES
(2, 'Sale', '{\"table\":{\"full\":false},\"column\":{\"project_id\":\"Read\",\"project_name\":\"Read\",\"project_field\":\"Read\",\"project_market\":\"Read\",\"project_creator\":\"Read\",\"project_priority\":\"Read\",\"project_status\":\"Read\",\"project_next_action\":\"Read\",\"project_next_action_time\":\"Update\",\"project_bidding_time\":\"Write\",\"project_contract_time\":\"Read\",\"project_contact\":\"Read\",\"project_vender\":\"Read\",\"project_si\":\"Read\",\"project_am\":\"Read\",\"project_se\":\"Read\",\"project_note\":\"Read\",\"project_expected_revenue\":\"Write\",\"project_profit_rate\":\"Update\",\"project_expected_profit\":\"Write\",\"project_real_revenue\":\"Read\",\"project_real_profit\":\"Read\",\"project_money_output\":\"Read\",\"project_money_received\":\"Read\",\"project_money_remain\":\"Read\",\"project_money_plan\":\"Read\",\"project_mplan_time\":\"Read\",\"project_result\":\"Read\"}}', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL,
  `project_name` varchar(200) DEFAULT NULL,
  `project_field` int(11) DEFAULT NULL,
  `project_market` int(11) DEFAULT NULL,
  `project_priority` int(11) DEFAULT NULL,
  `project_status` text,
  `project_next_action` text,
  `project_next_action_time` int(11) DEFAULT NULL,
  `project_bidding_time` int(11) DEFAULT NULL,
  `project_contract_time` int(11) DEFAULT NULL,
  `project_contact` text,
  `project_vender` varchar(200) DEFAULT NULL,
  `project_si` varchar(200) DEFAULT NULL,
  `project_note` text,
  `project_expected_revenue` bigint(200) DEFAULT NULL,
  `project_expected_profit` bigint(200) DEFAULT NULL,
  `project_expected_time` int(11) DEFAULT NULL,
  `project_real_revenue` bigint(200) DEFAULT NULL,
  `project_real_profit` bigint(200) DEFAULT NULL,
  `project_money_received` bigint(200) DEFAULT NULL,
  `project_money_output` bigint(200) DEFAULT NULL,
  `project_money_remain` bigint(200) DEFAULT NULL,
  `project_money_plan` text,
  `project_mplan_time` int(11) DEFAULT NULL,
  `project_creator` int(11) DEFAULT NULL,
  `project_profit_rate` int(11) DEFAULT NULL,
  `project_am` varchar(200) DEFAULT NULL,
  `project_se` varchar(200) DEFAULT NULL,
  `project_result` int(11) DEFAULT NULL,
  `project_weight` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`project_id`, `project_name`, `project_field`, `project_market`, `project_priority`, `project_status`, `project_next_action`, `project_next_action_time`, `project_bidding_time`, `project_contract_time`, `project_contact`, `project_vender`, `project_si`, `project_note`, `project_expected_revenue`, `project_expected_profit`, `project_expected_time`, `project_real_revenue`, `project_real_profit`, `project_money_received`, `project_money_output`, `project_money_remain`, `project_money_plan`, `project_mplan_time`, `project_creator`, `project_profit_rate`, `project_am`, `project_se`, `project_result`, `project_weight`) VALUES
(13, 'dư án 1', 2, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1000000000, 200000000, 1561906920, 1001000000, 149000000, 75100000, 100000, 75000000, '{\"mp_id\":28,\"mp_type\":1,\"mp_pid\":13,\"mp_uid\":1,\"mp_uname\":\"Root\",\"mp_pname\":\"d\\u01b0 \\u00e1n 1\",\"mp_time\":1585993200,\"mp_note\":null,\"mp_value\":500000000,\"mp_profit_rate\":15,\"mp_profit\":75000000,\"mp_status\":100,\"mp_done_time\":1561715854,\"mp_result\":1}', 1585993200, 1, 20, NULL, NULL, 100, 14);

-- --------------------------------------------------------

--
-- Table structure for table `project_actions`
--

CREATE TABLE `project_actions` (
  `action_id` int(11) NOT NULL,
  `action_time` int(11) DEFAULT NULL,
  `action_content` text,
  `action_uname` varchar(200) DEFAULT NULL,
  `action_uid` int(11) DEFAULT NULL,
  `action_pid` int(11) DEFAULT NULL,
  `action_pname` varchar(200) DEFAULT NULL,
  `action_status` int(11) DEFAULT NULL,
  `action_done_time` int(11) DEFAULT NULL,
  `action_result` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `project_money_in`
--

CREATE TABLE `project_money_in` (
  `min_id` int(11) NOT NULL,
  `min_time` int(11) DEFAULT NULL,
  `min_pid` int(11) DEFAULT NULL,
  `min_plan` int(11) DEFAULT NULL,
  `min_pname` varchar(200) DEFAULT NULL,
  `min_uid` int(11) DEFAULT NULL,
  `min_uname` varchar(200) DEFAULT NULL,
  `min_value` bigint(200) DEFAULT NULL,
  `min_note` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `project_money_in`
--

INSERT INTO `project_money_in` (`min_id`, `min_time`, `min_pid`, `min_plan`, `min_pname`, `min_uid`, `min_uname`, `min_value`, `min_note`) VALUES
(22, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(25, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(30, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(31, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(40, 1561746940, 13, 27, 'dư án 1', 1, 'Root', 75000000, NULL),
(41, 1562038339, 13, 34, 'dư án 1', 2, 'linhvhv', 100000, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_money_out`
--

CREATE TABLE `project_money_out` (
  `mout_id` int(11) NOT NULL,
  `mout_time` int(11) DEFAULT NULL,
  `mout_pid` int(11) DEFAULT NULL,
  `mout_plan` int(11) DEFAULT NULL,
  `mout_pname` varchar(200) DEFAULT NULL,
  `mout_uid` int(11) DEFAULT NULL,
  `mout_uname` varchar(200) DEFAULT NULL,
  `mout_note` text,
  `mout_value` bigint(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `project_money_out`
--

INSERT INTO `project_money_out` (`mout_id`, `mout_time`, `mout_pid`, `mout_plan`, `mout_pname`, `mout_uid`, `mout_uname`, `mout_note`, `mout_value`) VALUES
(4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 1561747428, 13, 29, 'dư án 1', 1, 'Root', NULL, 100000);

-- --------------------------------------------------------

--
-- Table structure for table `project_money_plans`
--

CREATE TABLE `project_money_plans` (
  `mp_id` int(11) NOT NULL,
  `mp_time` int(11) DEFAULT NULL,
  `mp_type` int(11) DEFAULT NULL,
  `mp_pid` int(11) DEFAULT NULL,
  `mp_pname` varchar(200) DEFAULT NULL,
  `mp_uid` int(11) DEFAULT NULL,
  `mp_uname` varchar(200) DEFAULT NULL,
  `mp_note` text,
  `mp_value` bigint(200) DEFAULT NULL,
  `mp_profit_rate` float DEFAULT NULL,
  `mp_profit` bigint(200) DEFAULT NULL,
  `mp_status` int(11) DEFAULT NULL,
  `mp_done_time` int(11) DEFAULT NULL,
  `mp_result` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `project_money_plans`
--

INSERT INTO `project_money_plans` (`mp_id`, `mp_time`, `mp_type`, `mp_pid`, `mp_pname`, `mp_uid`, `mp_uname`, `mp_note`, `mp_value`, `mp_profit_rate`, `mp_profit`, `mp_status`, `mp_done_time`, `mp_result`) VALUES
(27, 1564566000, 1, 13, 'dư án 1', 1, 'Root', NULL, 500000000, 15, 75000000, 300, 1561746940, 1),
(28, 1585993200, 1, 13, 'dư án 1', 1, 'Root', NULL, 500000000, 15, 75000000, 100, 1561715854, 1),
(29, 1561715160, 0, 13, 'dư án 1', 1, 'Root', NULL, -100000, 100, -100000, 300, 1561747428, 0),
(34, 1561785840, 1, 13, 'dư án 1', 2, 'linhvhv', NULL, 1000000, 10, 100000, 300, 1562038339, 0),
(35, 1562037540, 0, 13, 'dư án 1', 1, 'Root', NULL, -1000000, 100, -1000000, 100, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_status`
--

CREATE TABLE `project_status` (
  `status_id` int(11) NOT NULL,
  `status_time` int(11) DEFAULT NULL,
  `status_content` text,
  `status_uname` varchar(200) DEFAULT NULL,
  `status_uid` int(11) DEFAULT NULL,
  `status_pid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `authentication`
--
ALTER TABLE `authentication`
  ADD PRIMARY KEY (`authen_id`),
  ADD UNIQUE KEY `authen_username` (`authen_username`),
  ADD UNIQUE KEY `authen_email` (`authen_email`),
  ADD UNIQUE KEY `authen_phone` (`authen_phone`),
  ADD KEY `authen_group` (`authen_group`),
  ADD KEY `authen_parent` (`authen_parent`);

--
-- Indexes for table `authorization_ob`
--
ALTER TABLE `authorization_ob`
  ADD PRIMARY KEY (`authz_ob_id`),
  ADD KEY `authz_ob_group_id` (`authz_ob_group_id`),
  ADD KEY `authz_ob_function` (`authz_ob_function`);

--
-- Indexes for table `authorization_project_ob`
--
ALTER TABLE `authorization_project_ob`
  ADD UNIQUE KEY `authz_pro_ob_pid` (`authz_pro_ob_pid`,`authz_pro_ob_uid`),
  ADD KEY `authz_pro_ob_uname` (`authz_pro_ob_uname`);

--
-- Indexes for table `authorization_project_rb`
--
ALTER TABLE `authorization_project_rb`
  ADD UNIQUE KEY `authz_pro_rb_pid` (`authz_pro_rb_pid`,`authz_pro_rb_gid`),
  ADD KEY `authz_pro_rb_pname` (`authz_pro_rb_pname`),
  ADD KEY `authz_pro_rb_gname` (`authz_pro_rb_gname`);

--
-- Indexes for table `authorization_rb`
--
ALTER TABLE `authorization_rb`
  ADD PRIMARY KEY (`authz_rb_id`),
  ADD UNIQUE KEY `authz_rb_id` (`authz_rb_id`,`authz_rb_function`),
  ADD KEY `authz_rb_group_id` (`authz_rb_group_id`),
  ADD KEY `authz_rb_function` (`authz_rb_function`);

--
-- Indexes for table `controller_table`
--
ALTER TABLE `controller_table`
  ADD UNIQUE KEY `controller_name` (`controller_name`),
  ADD KEY `controller_value` (`controller_value`);

--
-- Indexes for table `count_day_table`
--
ALTER TABLE `count_day_table`
  ADD UNIQUE KEY `cd_time` (`cd_time`),
  ADD KEY `cd_action_pass` (`cd_action_pass`),
  ADD KEY `cd_action_miss` (`cd_action_miss`),
  ADD KEY `cd_mplan_pass` (`cd_mplan_pass`),
  ADD KEY `cd_mplan_miss` (`cd_mplan_miss`);

--
-- Indexes for table `fields`
--
ALTER TABLE `fields`
  ADD PRIMARY KEY (`field_id`),
  ADD KEY `field_name` (`field_name`),
  ADD KEY `field_weight` (`field_weight`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`group_id`),
  ADD UNIQUE KEY `group_name` (`group_name`),
  ADD KEY `group_parent` (`group_parent`),
  ADD KEY `group_owner` (`group_owner`);

--
-- Indexes for table `map_people_groups`
--
ALTER TABLE `map_people_groups`
  ADD PRIMARY KEY (`map_id`),
  ADD UNIQUE KEY `group_id` (`group_id`,`people_id`);

--
-- Indexes for table `markets`
--
ALTER TABLE `markets`
  ADD PRIMARY KEY (`market_id`),
  ADD KEY `market_name` (`market_name`),
  ADD KEY `market_weight` (`market_weight`);

--
-- Indexes for table `permission_template`
--
ALTER TABLE `permission_template`
  ADD PRIMARY KEY (`temp_id`),
  ADD KEY `temp_name` (`temp_name`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD UNIQUE KEY `project_name` (`project_name`),
  ADD UNIQUE KEY `project_weight` (`project_weight`) USING BTREE,
  ADD KEY `project_field` (`project_field`),
  ADD KEY `project_market` (`project_market`),
  ADD KEY `project_priority` (`project_priority`),
  ADD KEY `project_next_action_time` (`project_next_action_time`),
  ADD KEY `project_bidding_time` (`project_bidding_time`),
  ADD KEY `project_contract_time` (`project_contract_time`),
  ADD KEY `project_vender` (`project_vender`),
  ADD KEY `project_si` (`project_si`),
  ADD KEY `project_expected_revenue` (`project_expected_revenue`),
  ADD KEY `project_expected_profit` (`project_expected_profit`),
  ADD KEY `project_real_revenue` (`project_real_revenue`),
  ADD KEY `project_real_profit` (`project_real_profit`),
  ADD KEY `project_money_received` (`project_money_received`),
  ADD KEY `project_money_output` (`project_money_output`),
  ADD KEY `project_money_remain` (`project_money_remain`),
  ADD KEY `project_mplan_time` (`project_mplan_time`),
  ADD KEY `project_creator` (`project_creator`),
  ADD KEY `project_profit_rate` (`project_profit_rate`),
  ADD KEY `project_am` (`project_am`),
  ADD KEY `project_se` (`project_se`),
  ADD KEY `project_result` (`project_result`),
  ADD KEY `project_expected_time` (`project_expected_time`) USING BTREE;

--
-- Indexes for table `project_actions`
--
ALTER TABLE `project_actions`
  ADD PRIMARY KEY (`action_id`),
  ADD KEY `action_time` (`action_time`),
  ADD KEY `action_uname` (`action_uname`),
  ADD KEY `action_uid` (`action_uid`),
  ADD KEY `action_pid` (`action_pid`),
  ADD KEY `action_status` (`action_status`),
  ADD KEY `action_done_time` (`action_done_time`),
  ADD KEY `action_result` (`action_result`),
  ADD KEY `action_pname` (`action_pname`);

--
-- Indexes for table `project_money_in`
--
ALTER TABLE `project_money_in`
  ADD PRIMARY KEY (`min_id`),
  ADD KEY `min_time` (`min_time`),
  ADD KEY `min_pid` (`min_pid`),
  ADD KEY `min_uid` (`min_uid`),
  ADD KEY `min_uname` (`min_uname`),
  ADD KEY `min_value` (`min_value`),
  ADD KEY `min_pname` (`min_pname`),
  ADD KEY `min_plan` (`min_plan`);

--
-- Indexes for table `project_money_out`
--
ALTER TABLE `project_money_out`
  ADD PRIMARY KEY (`mout_id`),
  ADD KEY `mout_time` (`mout_time`),
  ADD KEY `mout_pid` (`mout_pid`),
  ADD KEY `mout_uid` (`mout_uid`),
  ADD KEY `mout_uname` (`mout_uname`),
  ADD KEY `mout_value` (`mout_value`),
  ADD KEY `mout_pname` (`mout_pname`),
  ADD KEY `mout_plan` (`mout_plan`);

--
-- Indexes for table `project_money_plans`
--
ALTER TABLE `project_money_plans`
  ADD PRIMARY KEY (`mp_id`),
  ADD KEY `mp_time` (`mp_time`),
  ADD KEY `mp_type` (`mp_type`),
  ADD KEY `mp_pid` (`mp_pid`),
  ADD KEY `mp_uid` (`mp_uid`),
  ADD KEY `mp_uname` (`mp_uname`),
  ADD KEY `mp_value` (`mp_value`),
  ADD KEY `mp_status` (`mp_status`),
  ADD KEY `mp_done_time` (`mp_done_time`),
  ADD KEY `mp_result` (`mp_result`),
  ADD KEY `mp_pname` (`mp_pname`),
  ADD KEY `mp_profit_rate` (`mp_profit_rate`),
  ADD KEY `mp_profit` (`mp_profit`);

--
-- Indexes for table `project_status`
--
ALTER TABLE `project_status`
  ADD PRIMARY KEY (`status_id`),
  ADD KEY `status_time` (`status_time`),
  ADD KEY `status_uname` (`status_uname`),
  ADD KEY `status_uid` (`status_uid`),
  ADD KEY `status_pid` (`status_pid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `authentication`
--
ALTER TABLE `authentication`
  MODIFY `authen_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `authorization_ob`
--
ALTER TABLE `authorization_ob`
  MODIFY `authz_ob_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `authorization_rb`
--
ALTER TABLE `authorization_rb`
  MODIFY `authz_rb_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `fields`
--
ALTER TABLE `fields`
  MODIFY `field_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `group_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `map_people_groups`
--
ALTER TABLE `map_people_groups`
  MODIFY `map_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `markets`
--
ALTER TABLE `markets`
  MODIFY `market_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `permission_template`
--
ALTER TABLE `permission_template`
  MODIFY `temp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `project_actions`
--
ALTER TABLE `project_actions`
  MODIFY `action_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_money_in`
--
ALTER TABLE `project_money_in`
  MODIFY `min_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `project_money_out`
--
ALTER TABLE `project_money_out`
  MODIFY `mout_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `project_money_plans`
--
ALTER TABLE `project_money_plans`
  MODIFY `mp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `project_status`
--
ALTER TABLE `project_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
