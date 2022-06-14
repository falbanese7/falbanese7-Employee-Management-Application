INSERT INTO department (dept_name)
VALUES ("Management"),
       ("Sales"),
       ("Engineering"),
       ("Product"),
       ("Customer Service"),
       ("Marketing");

INSERT INTO roles (title, salary, department_id)
VALUES  ("CEO", 300000, 1),
        ("VP of Sales", 250000, 1),
        ("VP of Engineering", 250000, 1),
        ("VP of Product", 250000, 1),
        ("VP of Customer Service", 250000, 1),
        ("VP of Finance", 250000, 1),
        ("Sales Lead", 100000, 2),
        ("Sales Rep", 80000, 2),
        ("Software Engineering Lead", 175000, 3),
        ("Software Engineer", 120000, 3),
        ("Product Manager", 140000, 4),
        ("Customer Service Manager", 100000, 5),
        ("Customer Service Rep", 80000, 5),
        ("Finance Manager", 100000, 6),
        ("Accountant", 80000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Richard", "Hendricks", 01),
       ("Morty", "Smith", 02, 101),
       ("Rick", "Sanchez", 03, 101),
       ("Annie", "Edison", 04, 101),
       ("Barry", "Benson", 05, 101),
       ("Monica", "Hall", 06, 101),
       ("Ash", "Ketchum", 07, 201),
       ("Pika", "Chu", 08, 202),
       ("Vincent", "Valentine", 09, 301),
       ("Cloud", "Strife", 10, 302),
       ("Britta", "Perry", 11, 401),
       ("Kermit", "The Frog", 12, 501),
       ("Fozzy", "Bear", 13, 502),
       ("Gonzo", "The Great", 14, 601),
       ("Rizzo", "The Rat", 15, 602);
       