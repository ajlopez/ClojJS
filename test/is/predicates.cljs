
(println "Predicates tests")

(is (= (nil? nil) true))
(is (= (nil? js/undefined) true))
(is (= (nil? false) false))
(is (= (nil? true) false))
(is (= (nil? 42) false))
(is (= (nil? "foo") false))
(is (= (nil? :foo) false))
(is (= (nil? ()) false))

(is (= (some? nil) false))
(is (= (some? js/undefined) false))
(is (= (some? false) true))
(is (= (some? true) true))
(is (= (some? 42) true))
(is (= (some? "foo") true))
(is (= (some? :foo) true))
(is (= (some? ()) true))

(is (= (symbol? 'x) true))
(is (= (symbol? nil) false))
(is (= (symbol? true) false))
(is (= (symbol? false) false))
(is (= (symbol? 42) false))
(is (= (symbol? "foo") false))
(is (= (symbol? :foo) false))

