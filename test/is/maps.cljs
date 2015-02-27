(println "Map Tests")(is (= { :one 1 :two 2 :three 3 } { :one 1 :two 2 :three 3 }))(is (= {} {}))(is (= { :one 1  :three 3 :two 2 } { :one 1 :two 2 :three 3 }))(is (not= { :one 1  :two 2 } { :one 1 :two 2 :three 3 }))(is (not= { :one 1  :two 2 } { :one 1 :two 2 :four 4 }))(is (= (get { :one 1 :two 2 :three 3 } :one) 1))(is (= (get { :one 1 :two 2 :three 3 } :two) 2))(is (= (get { :one 1 :two 2 :three 3 } :three) 3))(is (= (get { :one 1 :two 2 :three 3 } :four) nil))(is (= (get { :one 1 :two 2 :three 3 } :four 4) 4))(is (= ({ :one 1 :two 2 :three 3 } :one) 1))(is (= ({ :one 1 :two 2 :three 3 } :two) 2))(is (= ({ :one 1 :two 2 :three 3 } :three) 3))(is (= ({ :one 1 :two 2 :three 3 } :four) nil))(is (= ({ :one 1 :two 2 :three 3 } 4) nil))(let [map1 { :one 1 :two 2 }      map2 (assoc map1 :three 3 :four 4)]    (is (= (map2 :one) 1))    (is (= (map2 :two) 2))    (is (= (map2 :three) 3))    (is (= (map2 :four) 4))    (is (= (map1 :three) nil))    (is (= (map1 :four) nil)))(let [map1 { :one 1 :two 2 :three 3 :four 4 }      map2 (dissoc map1 :two :four)]    (is (= (map2 :one) 1))    (is (= (map2 :two) nil))    (is (= (map2 :three) 3))    (is (= (map2 :four) nil))    (is (= (map1 :three) 3))    (is (= (map1 :four) 4)))(is (= (keys {:keys :and, :some :values}) '(:keys :some)))(is (= (keys {}) nil))(is (= (keys nil) nil))