
(println "Predicates tests")

(is (= (nil? nil) true))
(is (= (nil? js/undefined) true))
(is (= (nil? false) false))
(is (= (nil? true) false))
(is (= (nil? 42) false))
(is (= (nil? "foo") false))
(is (= (nil? :foo) false))
(is (= (nil? ()) false))


