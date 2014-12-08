CREATE TABLE IF NOT EXISTS `website_mode` (
  `id` int(100) NOT NULL,
  `maintenance_mode` varchar(200) NOT NULL,
  `admin_ip_address` varchar(200) NOT NULL,
  `date` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;