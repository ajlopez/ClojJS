
(ns tests.lazy)

(println "Lazy Tests")

(defn positive-numbers 
	([] (positive-numbers 1))
	([n] (cons n (lazy-seq (positive-numbers (inc n))))))

(let [x (positive-numbers)]
    (is (= (first x) 1))
    (is (= (second x) 2)))

(let [x (positive-numbers 10)]
    (is (= (first x) 10))
    (is (= (second x) 11)))

(let [x (iterate inc 1)]
    (is (= (first x) 1))
    (is (= (second x) 2)))
