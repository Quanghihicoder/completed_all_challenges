DELETE m1
FROM model m1
JOIN model m2
ON m1.Make = m2.Make AND m1.Model = m2.Model AND m1.ID < m2.ID;