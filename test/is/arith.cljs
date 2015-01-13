
(println "Arithmetic Tests")

(is (= (+ 1 1) 2))
(is (= (- 3 2) 1))
(is (= (+) 0))
(is (= (+ 2) 2))
(is (= (- 3) (- 0 3)))

;(is (= (* 3 2) 6))
;(is (= (* 2)) 2)

(is (= (inc 1) 2))(is (= (dec 2) 1))