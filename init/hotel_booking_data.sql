DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS hotels;

CREATE TABLE hotels (
  hotel_id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_name VARCHAR(100) NOT NULL,
  location VARCHAR(100),
  rating DECIMAL(3,1),
  contact_email VARCHAR(100)
);


CREATE TABLE bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT NOT NULL,
  booking_date DATE NOT NULL,
  source VARCHAR(50) NOT NULL, 
  value DECIMAL(10,2) NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  cancelled_date DATE,
  refund_value DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) NOT NULL,
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


INSERT INTO hotels (hotel_id, hotel_name, location, rating, contact_email) VALUES
(2, 'Twinder', 'Berlin', 4.3, 'unormand0@gmail.com'),
(1, 'Mybuzz', 'Munich', 3.6, 'cparnaby1@gmail.com'),
(3, 'Motofeed', 'Hamburg', 4.0, 'pfeilden2@myspace.com'),
(5, 'Jabbersphere', 'Frankfurt', 3.9, 'agibbings3@free.com'),
(4, 'Rhycero', 'Cologne', 3.8, 'ogumery4@domainmarket.com');


INSERT INTO bookings (hotel_id, booking_date, source, value, arrival_date, departure_date, cancelled_date, refund_value, status, booking_id) VALUES
  (2, '2025-01-02', 'HolidayCheck', 631.88, '2025-01-07', '2025-01-14', NULL, 0, 'confirmed', '0001'),
  (2, '2025-01-01', 'Hotel Website', 404.98, '2025-04-10', '2025-04-17', NULL, 0, 'completed', '0002'),
  (5, '2025-05-17', 'Booking.com', 2556.06, '2025-10-07', '2025-10-14', '2025-10-05', 2526.06, 'cancelled', '0003'),
  (5, '2025-04-01', 'Manual', 1465.98, '2025-04-06', '2025-04-13', NULL, 0, 'confirmed', '0004'),
  (4, '2025-01-29', 'Trip.com', 4455.71, '2025-10-18', '2025-10-25', NULL, 0, 'confirmed', '0005'),
  (1, '2025-02-15', 'Check24', 3675.56, '2025-04-24', '2025-05-01', NULL, 0, 'confirmed', '0006'),
  (5, '2025-02-08', 'Hotels.com', 1118.83, '2025-02-13', '2025-02-20', NULL, 0, 'confirmed', '0007'),
  (3, '2025-08-25', 'Manual', 4017.76, '2025-11-18', '2025-11-25', NULL, 0, 'confirmed', '0008'),
  (2, '2025-02-15', 'Booking.com', 4557.89, '2025-02-20', '2025-02-27', NULL, 0, 'confirmed', '0009'),
  (5, '2025-02-02', 'HolidayCheck', 2788.76, '2025-05-26', '2025-06-02', '2025-05-25', 2758.76, 'cancelled', '0010'),
  (3, '2025-05-19', 'Agoda', 1614.25, '2025-12-05', '2025-12-12', NULL, 0, 'completed', '0011'),
  (2, '2025-01-13', 'Manual', 1468.64, '2025-05-26', '2025-06-02', '2025-05-25', 1438.64, 'cancelled', '0012'),
  (5, '2025-04-07', 'Agoda', 1185.45, '2025-12-03', '2025-12-10', '2025-10-05', 1155.45, 'cancelled', '0013'),
  (5, '2025-01-29', 'Hotels.com', 2594.35, '2025-02-03', '2025-02-10', NULL, 0, 'completed', '0014'),
  (4, '2025-04-20', 'Other Trivago Partner', 3571.28, '2025-09-26', '2025-10-03', NULL, 0, 'confirmed', '0015'),
  (4, '2025-05-18', 'Trip.com', 3559.17, '2025-07-20', '2025-07-27', NULL, 0, 'completed', '0016'),
  (2, '2025-05-01', 'Trip.com', 1537.32, '2025-09-25', '2025-10-02', NULL, 0, 'completed', '0017'),
  (5, '2025-07-30', 'Hotel Website', 3617.12, '2025-08-04', '2025-08-11', '2025-08-03', 3587.12, 'cancelled', '0018'),
  (4, '2025-02-01', 'Trip.com', 1084.19, '2025-04-14', '2025-04-21', NULL, 0, 'completed', '0019'),
  (4, '2025-08-26', 'Agoda', 2060.61, '2025-10-14', '2025-10-21', NULL, 0, 'confirmed', '0020'),
  (4, '2025-04-05', 'Booking.com', 4918.68, '2025-05-30', '2025-06-06', NULL, 0, 'confirmed', '0021'),
  (1, '2025-02-07', 'Other Trivago Partner', 2409.27, '2025-09-19', '2025-09-26', NULL, 0, 'confirmed', '0022'),
  (2, '2025-05-11', 'Agoda', 1358.52, '2025-06-06', '2025-06-13', NULL, 0, 'completed', '0023'),
  (2, '2025-04-12', 'Other Trivago Partner', 933.47, '2025-08-05', '2025-08-12', NULL, 0, 'confirmed', '0024'),
  (5, '2025-03-10', 'Other Trivago Partner', 4064.43, '2025-11-28', '2025-12-05', NULL, 0, 'completed', '0025'),
  (4, '2025-07-17', 'Trip.com', 1226.34, '2025-10-05', '2025-10-12', '2025-10-04', 1196.34, 'cancelled', '0026'),
  (4, '2025-05-14', 'Expedia', 386.02, '2025-05-19', '2025-05-26', NULL, 0, 'confirmed', '0027'),
  (1, '2025-02-07', 'Expedia', 4683.01, '2025-10-21', '2025-10-28', '2025-10-05', 4653.01, 'cancelled', '0028'),
  (4, '2025-02-08', 'Check24', 2157.42, '2025-07-04', '2025-07-11', NULL, 0, 'confirmed', '0029'),
  (2, '2025-01-21', 'Manual', 2674.72, '2025-02-16', '2025-02-23', NULL, 0, 'confirmed', '0030'),
  (5, '2025-01-21', 'Agoda', 4822.51, '2025-09-21', '2025-09-28', '2025-09-20', 4792.51, 'cancelled', '0031'),
  (5, '2025-05-02', 'Manual', 3274.42, '2025-10-05', '2025-10-12', NULL, 0, 'completed', '0032'),
  (3, '2025-04-03', 'HolidayCheck', 3520.09, '2025-04-08', '2025-04-15', NULL, 0, 'completed', '0033'),
  (1, '2025-06-08', 'HolidayCheck', 2667.42, '2025-08-31', '2025-09-07', NULL, 0, 'completed', '0034'),
  (5, '2025-05-02', 'HolidayCheck', 1522.73, '2025-09-17', '2025-09-24', NULL, 0, 'completed', '0035'),
  (2, '2025-03-28', 'Other Trivago Partner', 4633.03, '2025-07-16', '2025-07-23', NULL, 0, 'completed', '0036'),
  (1, '2025-02-10', 'Hotel Website', 25.25, '2025-04-11', '2025-04-18', '2025-04-10', 0, 'cancelled', '0037'),
  (3, '2025-03-17', 'Manual', 2706.8, '2025-12-17', '2025-12-24', NULL, 0, 'confirmed', '0038'),
  (4, '2025-09-10', 'Trip.com', 3524.25, '2025-10-29', '2025-11-05', '2025-10-05', 3494.25, 'cancelled', '0039'),
  (1, '2025-03-31', 'Check24', 4361.17, '2025-07-21', '2025-07-28', NULL, 0, 'confirmed', '0040'),
  (3, '2025-03-13', 'Check24', 2996.82, '2025-12-17', '2025-12-24', NULL, 0, 'confirmed', '0041'),
  (3, '2025-01-06', 'Booking.com', 2982.97, '2025-01-11', '2025-01-18', NULL, 0, 'completed', '0042'),
  (5, '2025-03-26', 'Hotels.com', 188.61, '2025-03-28', '2025-04-04', NULL, 0, 'confirmed', '0043'),
  (1, '2025-02-10', 'Hotels.com', 4815.99, '2025-02-15', '2025-02-22', '2025-02-14', 4785.99, 'cancelled', '0044'),
  (3, '2025-02-02', 'HolidayCheck', 673.48, '2025-12-19', '2025-12-26', NULL, 0, 'completed', '0045'),
  (2, '2025-06-04', 'Expedia', 3903.32, '2025-09-14', '2025-09-21', NULL, 0, 'confirmed', '0046'),
  (1, '2025-09-02', 'Trip.com', 4074.88, '2025-11-21', '2025-11-28', '2025-10-05', 4044.88, 'cancelled', '0047'),
  (1, '2025-02-23', 'Agoda', 832.68, '2025-08-24', '2025-08-31', NULL, 0, 'confirmed', '0048'),
  (4, '2025-07-24', 'Hotels.com', 2321.46, '2025-12-23', '2025-12-30', NULL, 0, 'confirmed', '0049'),
  (2, '2025-06-05', 'Hotel Website', 990.47, '2025-06-10', '2025-06-17', NULL, 0, 'completed', '0050'),
  (2, '2024-01-02', 'HolidayCheck', 631.88, '2024-01-07', '2024-01-14', NULL, 0, 'confirmed', '0051'),
  (2, '2024-01-01', 'Hotel Website', 404.98, '2024-04-10', '2024-04-17', NULL, 0, 'completed', '0052'),
  (5, '2024-05-17', 'Booking.com', 2556.06, '2024-10-07', '2024-10-14', '2024-10-05', 2526.06, 'cancelled', '0053'),
  (5, '2024-04-01', 'Manual', 1465.98, '2024-04-06', '2024-04-13', NULL, 0, 'confirmed', '0054'),
  (4, '2024-01-29', 'Trip.com', 4455.71, '2024-10-18', '2024-10-25', NULL, 0, 'confirmed', '0055'),
  (1, '2024-02-15', 'Check24', 3675.56, '2024-04-24', '2024-05-01', NULL, 0, 'confirmed', '0056');