
(println "range tests")

(comment (is (= (take 10 (range)) '(0 1 2 3 4 5 6 7 8 9))))
(comment (is (= (range 10) '(0 1 2 3 4 5 6 7 8 9))))
(comment (is (= (range -5 5) '(-5 -4 -3 -2 -1 0 1 2 3 4))))
(comment (is (= (range -100 100 10) '(-100 -90 -80 -70 -60 -50 -40 -30 -20 -10 0 10 20 30 40 50 60 70 80 90))))
(comment (is (= (range 0 4 2) '(0 2))))
(comment (is (= (range 0 5 2) '(0 2 4))))
(comment (is (= (range 0 7 2) '(0 2 4 6))))
(comment (is (= (range 100 0 -10) '(100 90 80 70 60 50 40 30 20 10))))
(comment (is (= (range 10 -10 -1) '(10 9 8 7 6 5 4 3 2 1 0 -1 -2 -3 -4 -5 -6 -7 -8 -9))))
