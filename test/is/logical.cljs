(println "Logical tests")(is (= (not false) true))(is (= (not nil) true))(is (= (not true) false))(is (= (not 1) false))(is (= (or) nil))(is (= (or false) false))(is (= (or true false false) true))(is (= (or false true false (foo)) true))(is (= (and) true))(is (= (and false) false))(is (= (and true true) true))(is (= (and false (foo)) false))(is (= (false? false) true))(is (= (false? nil) false))(is (= (false? true) false))(is (= (false? 42) false))(is (= (false? "foo") false))(is (= (true? true) true))(is (= (true? nil) false))(is (= (true? false) false))(is (= (true? 42) false))(is (= (true? "foo") false))