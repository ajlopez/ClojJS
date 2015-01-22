
(println "List Tests")

(is (= (cons 1 '(2 3)) '(1 2 3)))
(is (= (cons 1 [2 3]) '(1 2 3)))


(is (= (length '(2)) 1))
(is (= (length '(1 2)) 2))
(is (= (length '(1 2 3)) 3))

(is (= (first '(1)) 1))
(is (= (first '(1 2 3)) 1))

(is (= (second '(1)) nil))
(is (= (second '(1 2 3)) 2))

(is (= '(1 2) '(1 2)))
(is (= nil nil))

(is (= (cons 1 '(2)) '(1 2)))
(is (= (cons 1 '(2 3)) '(1 2 3)))

(is (= (next '(1 2 3)) '(2 3)))
(is (= (next '(1)) nil))

(is (= (rest '(1 2 3)) '(2 3)))
(is (= (rest '(1)) ()))
(is (= () ()))

(is (= (first ()) nil))

(is (= (next ()) nil))
(is (= (rest ()) ()))

(is (= (count ()) 0))(is (= (count '(1 2 3)) 3))(is (nil? (seq nil)))(is (nil? (seq ())))(is (= (seq "foo") '("f" "o" "o")))(is (= (seq [1 2 3]) '(1 2 3)))(is (= (seq [3 4]) '(3 4)))
(is (= (seq '(1 2 3)) '(1 2 3)))(is (nil? (spread nil)))(is (= (list* [1 2 3]) '(1 2 3)))
(is (= (list* 1 2 [3 4]) '(1 2 3 4)))(is (= (list* 1 2 '(3 4)) '(1 2 3 4)))(is (= (list* 1 2 3 4 '(5 6 7)) '(1 2 3 4 5 6 7)))(is (= (list* 1 2 3 4 5 '(6 7)) '(1 2 3 4 5 6 7)))