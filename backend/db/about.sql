-- À Propos page: tables + seed data
-- Import via cPanel → phpMyAdmin → your database → Import tab.
-- Safe to run when these tables do not exist yet. Generated file — do not edit by hand.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS about_content (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  hero_title_fr        VARCHAR(300), hero_title_en VARCHAR(300), hero_title_rw VARCHAR(300),
  hero_subtitle_fr     VARCHAR(300), hero_subtitle_en VARCHAR(300), hero_subtitle_rw VARCHAR(300),
  diocese_tab_fr       VARCHAR(120), diocese_tab_en VARCHAR(120), diocese_tab_rw VARCHAR(120),
  bishop_tab_fr        VARCHAR(120), bishop_tab_en VARCHAR(120), bishop_tab_rw VARCHAR(120),
  diocese_title_fr     VARCHAR(300), diocese_title_en VARCHAR(300), diocese_title_rw VARCHAR(300),
  diocese_text_fr      LONGTEXT, diocese_text_en LONGTEXT, diocese_text_rw LONGTEXT,
  diocese_image        VARCHAR(500),
  stats_title_fr       VARCHAR(200), stats_title_en VARCHAR(200), stats_title_rw VARCHAR(200),
  stats_designation_fr VARCHAR(120), stats_designation_en VARCHAR(120), stats_designation_rw VARCHAR(120),
  stats_figure_fr      VARCHAR(120), stats_figure_en VARCHAR(120), stats_figure_rw VARCHAR(120),
  bishop_title_fr      VARCHAR(200), bishop_title_en VARCHAR(200), bishop_title_rw VARCHAR(200),
  bishop_role_fr       VARCHAR(200), bishop_role_en VARCHAR(200), bishop_role_rw VARCHAR(200),
  bishop_text_fr       LONGTEXT, bishop_text_en LONGTEXT, bishop_text_rw LONGTEXT,
  bishop_image         VARCHAR(500),
  collab_title_fr      VARCHAR(200), collab_title_en VARCHAR(200), collab_title_rw VARCHAR(200),
  updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS about_stats (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  label_fr   VARCHAR(255), label_en VARCHAR(255), label_rw VARCHAR(255),
  value      VARCHAR(120),
  is_section TINYINT(1) DEFAULT 0,
  sort_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS about_collaborators (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(200),
  role_fr    VARCHAR(200), role_en VARCHAR(200), role_rw VARCHAR(200),
  sort_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO about_content (hero_title_fr, hero_title_en, hero_title_rw, hero_subtitle_fr, hero_subtitle_en, hero_subtitle_rw, diocese_tab_fr, diocese_tab_en, diocese_tab_rw, bishop_tab_fr, bishop_tab_en, bishop_tab_rw, diocese_title_fr, diocese_title_en, diocese_title_rw, diocese_text_fr, diocese_text_en, diocese_text_rw, diocese_image, stats_title_fr, stats_title_en, stats_title_rw, stats_designation_fr, stats_designation_en, stats_designation_rw, stats_figure_fr, stats_figure_en, stats_figure_rw, bishop_title_fr, bishop_title_en, bishop_title_rw, bishop_role_fr, bishop_role_en, bishop_role_rw, bishop_text_fr, bishop_text_en, bishop_text_rw, bishop_image, collab_title_fr, collab_title_en, collab_title_rw)
VALUES ('À Propos du Diocèse de Kabgayi', 'About the Diocese of Kabgayi', 'Ibyerekeye Diyosezi ya Kabgayi', 'Une Église particulière au cœur du Rwanda', 'A particular Church at the heart of Rwanda', 'Itorero ryihariye mu Rwanda', 'Le Diocèse', 'The Diocese', 'Diyosezi', 'Notre Évêque', 'Our Bishop', 'Umusenyeri Wacu', 'Le Diocèse de Kabgayi', 'The Diocese of Kabgayi', 'Diyosezi ya Kabgayi', 'Le diocèse de Kabgayi est une circonscription de l\'Église catholique au Rwanda, dont le siège est situé à Gitarama, dans la Province du Sud. Il s\'étend sur 2 187 km² à travers les districts de Muhanga, Kamonyi, Ruhango et Nyanza. Son évêque actuel, Mgr Balthazar Ntivuguruzwa, a été ordonné en juin 2023.\n\nLe territoire du Diocèse de Kabgayi se situe en province Sud du Rwanda, et couvre l’étendue de trois districts à savoir Kamonyi, Muhanga et Ruhango ainsi qu’une petite portion du district de Nyanza sur une superficie de 2.187 km2. D’après les statistiques de l’année 2023, le diocèse de Kabgayi compte 695.920 catholiques sur une population approximative de 1.203.959 habitants, ce qui fait une portion de 57,8% de toute la population avec une diminution de 4% par rapport à l’année 2022.\n\nLe Diocèse de Kabgayi est composé aujourd’hui de 31 paroisses. Les deux nouvelles paroisses sont celles de Kabugondo et Gasovu fondées en 2024.\n\nAu niveau du Personnel apostolique, le nombre des prêtres diocésains résidents dans le Diocèse et dans les services interdiocésains au Rwanda s’élève à 101. Le diocèse compte 10 prêtres religieux qui font leur apostolat sous convention. Le total général de tous les prêtres diocésains, y compris ceux qui sont aux études et d’autres qui vivent à l’étranger, s’élève au nombre de 154 prêtres incardinés.\n\nBREVE CHRONOLOGIE HIERARCHIQUE DU DIOCESE DE KABGAYI\n\nL’histoire du Diocèse de Kabgayi se confond jusqu’en 1952 avec l’histoire religieuse du Christianisme au Rwanda.', 'The Diocese of Kabgayi is a circumscription of the Catholic Church in Rwanda, with its seat in Gitarama, in the Southern Province. It covers an area of 2,187 km² across the districts of Muhanga, Kamonyi, Ruhango and Nyanza. Its current bishop, Mgr Balthazar Ntivuguruzwa, was ordained in June 2023.\n\nThe Diocese of Kabgayi is located in the Southern Province of Rwanda and covers three districts: Kamonyi, Muhanga, and Ruhango, as well as a small portion of the Nyanza district, encompassing an area of 2,187 km². According to 2023 statistics, the Diocese of Kabgayi has 695,920 Catholics out of an approximate population of 1,203,959, representing 57.8% of the total population, a decrease of 4% compared to 2022.\n\nThe Diocese of Kabgayi currently comprises 31 parishes. The two new parishes are Kabugondo and Gasovu, founded in 2024.\n\nRegarding the apostolic personnel, the number of diocesan priests residing in the Diocese and serving in interdiocesan offices in Rwanda is 101. The diocese has 10 religious priests who carry out their ministry under contract. The total number of all diocesan priests, including those studying and others living abroad, is 154 incardinated priests.\n\nBRIEF HIERARCHICAL CHRONOLOGY OF THE DIOCESE OF KABGAYI\n\nThe history of the Diocese of Kabgayi is intertwined with the religious history of Christianity in Rwanda until 1952.', 'Diyosezi ya Kabgayi ni ingengabitekerezo y\'Itorero Gatolika mu Rwanda, aho icyicaro cya Gitarama, mu Ntara y\'Epfo. Igizwe ku 2,187 km² kuzuye imirenge ya Muhanga, Kamonyi, Ruhango na Nyanza. Umusenyeri wayo ubu, Mgr Balthazar Ntivuguruzwa, yashinzwe mu kwezi wa Nyakanga 2023.\n\nDiyosezi ya Kabgayi ni imwe mu Diyosezi za kera za Gatolika mu Rwanda. Yashinzwe mu ntangiriro z\'ikinyejana cya 20 n\'Ubutumwa bw\'Abapadiri b\'i Afrika (Pères Blancs), kandi yakoreye mu gukurura abantu kuri Yesu Kristu no guteza imbere abantu mu Rwanda.\n\nKabgayi, iherereye mu Ntara y\'Epfo ya Rwanda, ni icyicaro cy\'Umusenyeri kandi ikigarama nka Katedrale ya Notre-Dame ya Kabgayi, imwe mu nziza kandi za kera mu gihugu.', NULL, 'Statistiques du Diocèse 2026', 'Diocese Statistics 2026', 'Imibare y\'Ingenzi ya Diyosezi 2026', 'Désignation', 'Designation', 'Icyo Bigaragaza', 'Chiffre', 'Figure', 'Umubare', 'Mgr Balthazar Ntivuguruzwa', 'Mgr Balthazar Ntivuguruzwa', 'Mgr Balthazar Ntivuguruzwa', 'Évêque du Diocèse de Kabgayi', 'Bishop of the Diocese of Kabgayi', 'Umusenyeri wa Diyosezi ya Kabgayi', 'Mgr Balthazar Ntivuguruzwa est l\'évêque actuel du Diocèse de Kabgayi, ordonné en juin 2023.', 'Mgr Balthazar Ntivuguruzwa is the current bishop of the Diocese of Kabgayi, ordained in June 2023.', 'Mgr Balthazar Ntivuguruzwa ni umusenyeri w\'ubu wa Diyosezi ya Kabgayi, yashinzwe mu kwezi wa Nyakanga 2023.', NULL, 'Ses Collaborateurs', 'His Collaborators', 'Abafasha be');

INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Population', 'Population', 'Abaturage', '1 120 821', 0, 1);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Baptisés Catholiques', 'Baptized Catholics', 'Ababatijwe Abagatolika', '666 097', 0, 2);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Catéchumènes', 'Catechumens', 'Abatoza', '5 668', 0, 3);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Total Catholiques', 'Total Catholics', 'Abagatolika Bose', '638 368', 0, 4);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('% des Cath. / Pop. Totale', '% Catholics / Total Pop.', '% y\'Abagatolika ku Baturage Bose', '59.20%', 0, 5);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Paroisses', 'Parishes', 'Amaparuwasi', '31', 0, 6);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Centrales', 'Central Stations', 'Ibigo Nkuru', '507', 0, 7);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Comités Ecclésiales de Base', 'Basic Ecclesial Communities', 'Amatorero Mato', '5 927', 0, 8);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Prêtres', 'Priests', 'Abapadiri', NULL, 1, 9);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Prêtres Diocésains', 'Diocesan Priests', 'Abapadiri ba Diyosezi', '80', 0, 10);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Prêtres Religieux', 'Religious Priests', 'Abapadiri b\'Amashyirahamwe', '20', 0, 11);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Religieux', 'Religious Brothers', 'Abarumuna', '77', 0, 12);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Religieuses', 'Religious Sisters', 'Abaseturi', '430', 0, 13);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Communautés Masculines', 'Male Communities', 'Amashyirahamwe y\'Abagabo', '15', 0, 14);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Communautés Féminines', 'Female Communities', 'Amashyirahamwe y\'Abagore', '36', 0, 15);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Catéchistes', 'Catechists', 'Abatekiseri', '740', 0, 16);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Grands Séminaristes', 'Major Seminarians', 'Abasemenari Bakuru', '65', 0, 17);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Petits Séminaristes', 'Minor Seminarians', 'Abasemenari Bato', '306', 0, 18);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Écoles', 'Schools', 'Amashuri', NULL, 1, 19);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Écoles Primaires', 'Primary Schools', 'Amashuri Abanza', '127', 0, 20);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Écoles Secondaires', 'Secondary Schools', 'Amashuri Yisumbuye', '105', 0, 21);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Écoles Supérieures Laïques', 'Lay Higher Education Schools', 'Amashuri Makuru y\'Abasivili', '1', 0, 22);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Formations Sanitaires de l\'Église', 'Church Health Facilities', 'Ivuriro ry\'Itorero', NULL, 1, 23);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Centres de Santé', 'Health Centers', 'Ibigo Nderabuzima', '10', 0, 24);
INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ('Hôpitaux', 'Hospitals', 'Ibitaro', '2', 0, 25);

INSERT INTO about_collaborators (name, role_fr, role_en, role_rw, sort_order) VALUES ('Mgr Hodari Jean de Dieu', 'Vicaire Général', 'Vicar General', 'Visi Jenerali', 1);
INSERT INTO about_collaborators (name, role_fr, role_en, role_rw, sort_order) VALUES ('Abbé Joseph Emmanuel Kageruka', 'Chancelier', 'Chancellor', 'Shanseliye', 2);
INSERT INTO about_collaborators (name, role_fr, role_en, role_rw, sort_order) VALUES ('Abbé Alype Hategekimana', 'Secrétaire de l\'Évêché', 'Secretary of the Bishopric', 'Umunyamabanga w\'Ubwepiskopi', 3);
INSERT INTO about_collaborators (name, role_fr, role_en, role_rw, sort_order) VALUES ('Abbé Eugène Dushimimana', 'Économe du Diocèse', 'Diocesan Bursar', 'Umubitsi wa Diyosezi', 4);
