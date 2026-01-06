SELECT b.reason, COUNT(b.reason) AS total
FROM Bans b
GROUP BY reason
ORDER BY total DESC;