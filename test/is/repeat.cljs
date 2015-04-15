
(println "repeat tests")

(is (= (take 5 (repeat "x")) '("x" "x" "x" "x" "x")))
(is (= (repeat 5 "x") '("x" "x" "x" "x" "x")))
