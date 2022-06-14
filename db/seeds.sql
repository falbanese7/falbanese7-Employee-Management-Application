INSERT INTO department (dept_name)
VALUES ("Management"),
       ("Sales"),
       ("Engineering"),
       ("Product"),
       ("Customer Service"),
       ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES  ("CEO", 250000, 1),
        ("Sales Lead", 150000, 2),
        ("Sales Rep", 80000, 2),
        ("Software Lead", 200000, 3),
        ("Software Engineer", 120000, 3),
        ("Product Manager", 135000, 4),
        ("Customer Service Manager", 100000, 5),
        ("Customer Service Rep", 80000, 5),
        ("VP of Finance", 200000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Richard", "Hendricks", 1, NULL),
       ("Rick", "Sanchez", 2, 1),
       ("Morty", "Smith", 3, 2),
       ("Kermit", "The Frog", 4, 1),
       ("Fozzy", "Bear", 5, 4),
       ("Miss", "Piggy", 6, 1),
       ("Annie", "Edison", 7, 1),
       ("Brita", "Perry", 8, 7),
       ("Monica", "Hall", 9, 1);
       