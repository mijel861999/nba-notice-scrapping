
CREATE TABLE notice (
	id INT NOT NULL AUTO_INCREMENT,
	title VARCHAR(200) NOT NULL,
	DESCRIPTION VARCHAR(250),
	content TEXT,
	createAt DATE NOT NULL,
	PRIMARY KEY (id)
);
