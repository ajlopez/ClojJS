
(def fibo (fn [x]
    (if (< x 0) 0
        (if (<= x 2) 1
            (+ (fibo (- x 1)) (fibo (- x 2)))))))
            
(println (fibo 1))
(println (fibo 2))
(println (fibo 3))
(println (fibo 4))
(println (fibo 5))
(println (fibo 6))
(println (fibo 7))
(println (fibo 8))