
(println "Empty tests")

(is (= (seq '(1)) '(1)))
(is (= (seq [1 2]) '(1 2)))
(is (= (seq "abc") '("a" "b" "c")))

(is (= (seq nil) nil))
(is (= (seq '()) nil))
(is (= (seq "") nil))
